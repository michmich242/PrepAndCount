import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = parseInt(process.env.PORT || '5000', 10);

// Helpers
function toNumber(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function mifflinStJeorBmr({ gender, weightKg, heightCm, age }) {
  const w = toNumber(weightKg);
  const h = toNumber(heightCm);
  const a = toNumber(age);
  // Mifflin-St Jeor
  const base = 10 * w + 6.25 * h - 5 * a;
  return gender === 'Male' ? base + 5 : base - 161;
}

function activityMultiplier(level) {
  switch (level) {
    case 'Sedentary': return 1.2;
    case 'Lightly Active': return 1.375;
    case 'Moderately Active': return 1.55;
    case 'Very Active': return 1.725;
    case 'Extra Active': return 1.9;
    default: return 1.2;
  }
}

function calorieAdjustmentForGoal(goal) {
  switch (goal) {
    case 'Weight Loss': return -500; // ~1 lb/week
    case 'Muscle Gain': return 300;
    case 'Maintenance': return 0;
    case 'General Health': return 0;
    default: return 0;
  }
}

function computeTargets({ fitnessGoal, gender, weightKg, heightCm, age, activityLevel }) {
  const bmr = mifflinStJeorBmr({ gender, weightKg, heightCm, age });
  const tdee = bmr * activityMultiplier(activityLevel);
  const calorieGoal = Math.max(1200, tdee + calorieAdjustmentForGoal(fitnessGoal));

  // Protein target by goal (g/kg)
  const proteinPerKg =
    fitnessGoal === 'Muscle Gain' ? 1.8 :
    fitnessGoal === 'Weight Loss' ? 1.8 :
    fitnessGoal === 'Maintenance' ? 1.6 : 1.4;
  const proteinGrams = Math.max(50, toNumber(weightKg) * proteinPerKg);

  // Fat ~25% calories
  const fatCalories = calorieGoal * 0.25;
  const fatGrams = fatCalories / 9;

  // Carbs = remaining
  const proteinCalories = proteinGrams * 4;
  const carbsCalories = Math.max(0, calorieGoal - (proteinCalories + fatCalories));
  const carbGrams = carbsCalories / 4;

  return {
    calorieGoal,
    macros: {
      proteinGrams,
      carbGrams,
      fatGrams
    }
  };
}

function buildPrompt(p) {
  const { fitnessGoal, heightCm, weightKg, age, gender, activityLevel, calorieGoal, macros, likes, dislikes } = p;
  return `
You are a certified nutritionist. Based on the following user information, create a detailed 7-day meal plan.

User Profile:
- Fitness Goal: ${fitnessGoal}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Age: ${age}
- Gender: ${gender}
- Activity Level: ${activityLevel}
- Daily Calorie Target: ${Math.round(calorieGoal)}
- Macro Targets: Protein: ${Math.round(macros.proteinGrams)}g, Carbs: ${Math.round(macros.carbGrams)}g, Fat: ${Math.round(macros.fatGrams)}g
- Likes: ${likes || 'N/A'}
- Dislikes/Restrictions: ${dislikes || 'N/A'}

Create a 7-day meal plan with specific meal names for breakfast, lunch, dinner, and 1-2 snacks per day. Return ONLY valid JSON with this exact structure and property names:
{
  "day1": { "breakfast": "meal name", "lunch": "meal name", "dinner": "meal name", "snacks": ["snack1","snack2"] },
  "day2": { ... },
  "day3": { ... },
  "day4": { ... },
  "day5": { ... },
  "day6": { ... },
  "day7": { ... }
}
No commentary, no markdown. Strict JSON only.
`.trim();
}

app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const {
      fitnessGoal = 'General Health',
      heightCm,
      weightKg,
      age,
      gender = 'Other',
      activityLevel = 'Sedentary',
      likes = '',
      dislikes = ''
    } = req.body || {};

    if (!heightCm || !weightKg || !age) {
      return res.status(400).json({ message: 'heightCm, weightKg, and age are required' });
    }

    const targets = computeTargets({ fitnessGoal, gender, weightKg, heightCm, age, activityLevel });

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ message: 'OPENAI_API_KEY is not configured on the server' });
    }
    const openai = new OpenAI({ apiKey: openaiKey });

    const prompt = buildPrompt({
      fitnessGoal,
      heightCm,
      weightKg,
      age,
      gender,
      activityLevel,
      calorieGoal: targets.calorieGoal,
      macros: targets.macros,
      likes,
      dislikes
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns strict JSON.' },
        { role: 'user', content: prompt }
      ]
    });

    const content = completion.choices?.[0]?.message?.content || '{}';
    let plan;
    try {
      plan = JSON.parse(content);
    } catch (e) {
      // Attempt to salvage JSON
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        plan = JSON.parse(content.slice(start, end + 1));
      } else {
        throw new Error('Failed to parse OpenAI JSON response');
      }
    }

    return res.json({
      calorieGoal: targets.calorieGoal,
      macros: targets.macros,
      plan
      // NOTE: FatSecret nutrition enrichment will be added in a follow-up step
    });
  } catch (err) {
    const message = err?.message || 'Unexpected error';
    return res.status(500).json({ message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


