import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// Ensure CORS preflight responses are handled
app.options('*', cors({ origin: true, credentials: true }));

const PORT = parseInt(process.env.PORT || '5000', 10);
const FATSECRET_CLIENT_ID = process.env.FATSECRET_CLIENT_ID || '';
const FATSECRET_CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || '';
const NODE_ENV = process.env.NODE_ENV || 'development';

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
  const { fitnessGoal, heightCm, weightKg, age, gender, activityLevel, calorieGoal, macros, likes, dislikes, days = 7 } = p;
  return `
You are a certified nutritionist. Create a practical, realistic meal plan tailored to the user profile below.

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

Requirements:
- Create a ${days}-day plan with 3 meals (breakfast, lunch, dinner) and 1–2 snacks per day.
- Respect dislikes/restrictions strictly. Prefer items from likes where appropriate.
- Keep dishes simple, common, and grocery-friendly for easy lookup (no brand names, no emojis).
- Avoid repetition across consecutive days; include reasonable variety (proteins, grains, vegetables, fruits).
- Portion assumptions should be implicit; DO NOT include measurements or macros in the names.

Output:
Return ONLY valid JSON with keys "day1" through "day${days}". For each day include exactly:
- "breakfast": string
- "lunch": string
- "dinner": string
- "snacks": array of 1-2 strings
No extra commentary, no markdown. Strict JSON only with the exact keys above.
`.trim();
}

// Simple health check to verify connectivity from device
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV });
});

// Friendly root route for browser checks
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'PrepAndCount backend is running',
    endpoints: [
      'GET /health',
      'POST /api/generate-meal-plan',
      'POST /api/generate-meal-plan/enriched'
    ]
  });
});

// --- FatSecret integration (optional) ---
let fatSecretTokenCache = { token: '', expiresAt: 0 };

async function getFatSecretToken() {
  if (!FATSECRET_CLIENT_ID || !FATSECRET_CLIENT_SECRET) return null;
  const now = Date.now();
  if (fatSecretTokenCache.token && fatSecretTokenCache.expiresAt > now + 60_000) {
    return fatSecretTokenCache.token;
  }
  const credentials = Buffer.from(`${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`).toString('base64');
  const resp = await fetch('https://oauth.fatsecret.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'premier'
    }).toString()
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  fatSecretTokenCache = {
    token: data.access_token || '',
    expiresAt: now + ((data.expires_in || 3600) * 1000)
  };
  return fatSecretTokenCache.token;
}

async function fatSecretSearchFood(name, token) {
  const params = new URLSearchParams({
    search_expression: name,
    max_results: '1',
    region: 'US',
    language: 'en',
    format: 'json'
  });
  const url = `https://platform.fatsecret.com/rest/foods/search/v3?${params.toString()}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  try {
    const first = data.foods_search?.results?.foods?.[0];
    return first || null;
  } catch {
    return null;
  }
}

function extractMacrosFromFood(food) {
  // Different endpoints return different shapes; try to normalize
  const serving = food?.servings?.serving?.[0] || food?.servings?.serving || {};
  const calories = toNumber(serving.calories);
  const protein = toNumber(serving.protein);
  const carbs = toNumber(serving.carbohydrate);
  const fat = toNumber(serving.fat);
  if (calories || protein || carbs || fat) {
    return { calories, protein, carbs, fat };
  }
  return null;
}

async function enrichPlanWithNutrition(plan) {
  const token = await getFatSecretToken();
  if (!token) return { planWithNutrition: plan, totalsByDay: {} };

  const result = {};
  const totalsByDay = {};
  const dayKeys = Object.keys(plan || {});

  for (const day of dayKeys) {
    const meals = plan[day] || {};
    const keys = ['breakfast', 'lunch', 'dinner'];
    const snacks = Array.isArray(meals.snacks) ? meals.snacks.slice(0, 2) : [];

    result[day] = { breakfast: null, lunch: null, dinner: null, snacks: [] };
    const dayTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    // Helper to process one item
    const processItem = async (label, name) => {
      if (!name) return null;
      const food = await fatSecretSearchFood(name, token);
      const macros = extractMacrosFromFood(food);
      if (macros) {
        dayTotals.calories += macros.calories;
        dayTotals.protein += macros.protein;
        dayTotals.carbs += macros.carbs;
        dayTotals.fat += macros.fat;
      }
      return { name, macros };
    };

    for (const k of keys) {
      try {
        result[day][k] = await processItem(k, meals[k]);
      } catch {
        result[day][k] = { name: meals[k] || null, macros: null };
      }
    }
    const snackResults = [];
    for (const s of snacks) {
      try {
        snackResults.push(await processItem('snack', s));
      } catch {
        snackResults.push({ name: s, macros: null });
      }
    }
    result[day].snacks = snackResults;
    totalsByDay[day] = {
      calories: Math.round(dayTotals.calories),
      protein: Math.round(dayTotals.protein),
      carbs: Math.round(dayTotals.carbs),
      fat: Math.round(dayTotals.fat)
    };
  }

  return { planWithNutrition: result, totalsByDay };
}

// Timeout helper to avoid hanging on upstream calls
function withTimeout(promise, ms, onTimeoutMessage = 'Operation timed out') {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(onTimeoutMessage)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

app.post('/api/generate-meal-plan', async (req, res) => {
  try {
    const startedAt = Date.now();
    const reqId = Math.random().toString(36).slice(2, 10);
    console.log(`[meal-plan][${reqId}] start`);
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

    // Fast path to isolate OpenAI issues: skip AI and return mock plan
    const testFlag = String(req.query.test || req.query.skipAi || '').toLowerCase();
    const daysParam = Math.max(1, Math.min(7, Number(req.query.days) || 7));
    const timeoutMs = Math.max(10000, Math.min(90000, Number(req.query.timeoutMs) || 45000));
    const modelParam = String(req.query.model || 'gpt-4o-mini');
    if (testFlag === '1' || testFlag === 'true') {
      const mockPlan = {
        day1: {
          breakfast: 'Oatmeal with berries',
          lunch: 'Grilled chicken salad',
          dinner: 'Salmon with quinoa and veggies',
          snacks: ['Greek yogurt', 'Apple']
        }
      };
      console.log(`[meal-plan][${reqId}] test-mode ok in ${Date.now() - startedAt}ms`);
      return res.json({
        calorieGoal: targets.calorieGoal,
        macros: targets.macros,
        plan: daysParam === 1 ? mockPlan : {
          ...mockPlan,
          day2: mockPlan.day1,
          day3: mockPlan.day1,
          day4: mockPlan.day1,
          day5: mockPlan.day1,
          day6: mockPlan.day1,
          day7: mockPlan.day1
        }
      });
    }

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
      dislikes,
      days: daysParam
    });

    const completion = await withTimeout(
      openai.chat.completions.create({
        model: modelParam,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are a helpful assistant that returns strict JSON.' },
          { role: 'user', content: prompt }
        ]
      }),
      timeoutMs,
      'OpenAI request timed out'
    );

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

    // If the model returned all 7 days but a smaller number was requested, trim it
    if (daysParam < 7) {
      const trimmed = {};
      for (let i = 1; i <= daysParam; i++) {
        const key = `day${i}`;
        if (plan[key]) trimmed[key] = plan[key];
      }
      if (Object.keys(trimmed).length > 0) {
        plan = trimmed;
      }
    }

    return res.json({
      calorieGoal: targets.calorieGoal,
      macros: targets.macros,
      plan
      // NOTE: FatSecret nutrition enrichment will be added in a follow-up step
    });
    // Note: code after return is unreachable; keep log before return if needed
  } catch (err) {
    console.error('[meal-plan] error', err);
    const message = err?.message || 'Unexpected error';
    const status = /timed out/i.test(message) ? 504 : 500;
    return res.status(status).json({ message });
  }
});

app.post('/api/recipe-instructions', async (req, res) => {
  try {
    const { mealName } = req.body || {};
    if (!mealName) return res.status(400).json({ message: 'mealName is required' });
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ message: 'OPENAI_API_KEY is not configured on the server' });
    const openai = new OpenAI({ apiKey: openaiKey });
    const prompt = `
You are a chef. Provide concise home-cook instructions for the dish: "${mealName}".
Constraints:
- 4–6 short numbered steps
- Common ingredients and simple techniques only
- No quantities, calories, or macros
- No extra commentary or markdown
Return STRICT JSON: { "steps": ["step 1", "step 2", ...] }`.trim();
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You return strict JSON only.' },
          { role: 'user', content: prompt }
        ]
      }),
      25000,
      'OpenAI request timed out'
    );
    const content = completion.choices?.[0]?.message?.content || '{}';
    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      data = JSON.parse(content.slice(start, end + 1));
    }
    return res.json({ steps: Array.isArray(data.steps) ? data.steps.slice(0, 8) : [] });
  } catch (err) {
    const message = err?.message || 'Unexpected error';
    const status = /timed out/i.test(message) ? 504 : 500;
    return res.status(status).json({ message });
  }
});

app.post('/api/nutrition/estimate', async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) {
      return res.json({ byKey: {}, totals: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
    }
    const token = await getFatSecretToken();
    const byKey = {};
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (!token) {
      // FatSecret not configured; return null macros for each item
      for (const it of items) {
        byKey[it.key] = null;
      }
      return res.json({ byKey, totals });
    }
    for (const it of items) {
      try {
        const food = await fatSecretSearchFood(String(it.name || ''), token);
        const macros = extractMacrosFromFood(food);
        byKey[it.key] = macros || null;
        if (macros) {
          totals.calories += macros.calories || 0;
          totals.protein += macros.protein || 0;
          totals.carbs += macros.carbs || 0;
          totals.fat += macros.fat || 0;
        }
      } catch {
        byKey[it.key] = null;
      }
    }
    totals.calories = Math.round(totals.calories);
    totals.protein = Math.round(totals.protein);
    totals.carbs = Math.round(totals.carbs);
    totals.fat = Math.round(totals.fat);
    return res.json({ byKey, totals });
  } catch (err) {
    const message = err?.message || 'Unexpected error';
    const status = /timed out/i.test(message) ? 504 : 500;
    return res.status(status).json({ message });
  }
});

app.post('/api/generate-meal-plan/enriched', async (req, res) => {
  try {
    const startedAt = Date.now();
    const reqId = Math.random().toString(36).slice(2, 10);
    console.log(`[meal-plan-enriched][${reqId}] start`);
    const baseResp = await (async () => {
      // Reuse computation and OpenAI call logic by invoking the main handler body
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
        return { status: 400, body: { message: 'heightCm, weightKg, and age are required' } };
      }
      const targets = computeTargets({ fitnessGoal, gender, weightKg, heightCm, age, activityLevel });
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = buildPrompt({
        fitnessGoal, heightCm, weightKg, age, gender, activityLevel,
        calorieGoal: targets.calorieGoal, macros: targets.macros, likes, dislikes
      });
      const completion = await withTimeout(
        openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are a helpful assistant that returns strict JSON.' },
            { role: 'user', content: prompt }
          ]
        }),
        45000,
        'OpenAI request timed out'
      );
      const content = completion.choices?.[0]?.message?.content || '{}';
      let plan;
      try {
        plan = JSON.parse(content);
      } catch {
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        plan = JSON.parse(content.slice(start, end + 1));
      }
      return { status: 200, body: { targets, plan } };
    })();

    if (baseResp.status !== 200) {
      return res.status(baseResp.status).json(baseResp.body);
    }

    const { targets, plan } = baseResp.body;
    const { planWithNutrition, totalsByDay } = await enrichPlanWithNutrition(plan);
    const payload = {
      calorieGoal: targets.calorieGoal,
      macros: targets.macros,
      plan: planWithNutrition,
      totalsByDay
    };
    console.log(`[meal-plan-enriched][${reqId}] ok in ${Date.now() - startedAt}ms`);
    return res.json(payload);
  } catch (err) {
    console.error('[meal-plan-enriched] error', err);
    const message = err?.message || 'Unexpected error';
    const status = /timed out/i.test(message) ? 504 : 500;
    return res.status(status).json({ message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


