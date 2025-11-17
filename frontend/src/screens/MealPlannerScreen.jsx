import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Switch } from 'react-native';
import API_URL from '../../config/config.js';

const goals = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'General Health'];
const genders = ['Male', 'Female', 'Other'];
const activityLevels = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extra Active'
];

export default function MealPlannerScreen() {
  const [form, setForm] = useState({
    fitnessGoal: 'General Health',
    heightCm: '',
    weightKg: '',
    age: '',
    gender: 'Other',
    activityLevel: 'Sedentary',
    likes: '',
    dislikes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [pingStatus, setPingStatus] = useState('');
  const [oneDay, setOneDay] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      !!form.heightCm && !!form.weightKg && !!form.age &&
      Number(form.heightCm) > 0 && Number(form.weightKg) > 0 && Number(form.age) > 0
    );
  }, [form]);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const params = new URLSearchParams();
      if (testMode) params.set('test', '1');
      params.set('days', oneDay ? '1' : '7');
      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_URL}/api/generate-meal-plan${qs}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e?.message || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      setPingStatus('Checking...');
      const r = await fetch(`${API_URL}/health`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      setPingStatus(`OK (${j?.env || 'unknown'})`);
    } catch (e) {
      setPingStatus(`Failed: ${e?.message || 'error'}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meal Planner</Text>
      <Text style={styles.small}>API: {API_URL}</Text>
      <View style={styles.testRow}>
        <Text style={styles.label}>Test mode (skip AI)</Text>
        <Switch value={testMode} onValueChange={setTestMode} />
      </View>
      <View style={styles.testRow}>
        <Text style={styles.label}>Quick (1 day)</Text>
        <Switch value={oneDay} onValueChange={setOneDay} />
      </View>
      <View style={[styles.testRow, { marginTop: 6 }]}>
        <TouchableOpacity style={[styles.button, { paddingVertical: 10 }]} onPress={checkConnection}>
          <Text style={styles.buttonText}>Check connection</Text>
        </TouchableOpacity>
        {!!pingStatus && <Text style={[styles.small, { marginLeft: 10 }]}>{pingStatus}</Text>}
      </View>

      <Text style={styles.label}>Fitness Goal</Text>
      <View style={styles.rowWrap}>
        {goals.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, form.fitnessGoal === g && styles.chipActive]}
            onPress={() => updateField('fitnessGoal', g)}
          >
            <Text style={[styles.chipText, form.fitnessGoal === g && styles.chipTextActive]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.rowWrap}>
        {genders.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, form.gender === g && styles.chipActive]}
            onPress={() => updateField('gender', g)}
          >
            <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.rowWrap}>
        {activityLevels.map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.chip, form.activityLevel === a && styles.chipActive]}
            onPress={() => updateField('activityLevel', a)}
          >
            <Text style={[styles.chipText, form.activityLevel === a && styles.chipTextActive]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(form.heightCm)}
        onChangeText={(t) => updateField('heightCm', t.replace(/[^0-9.]/g, ''))}
        style={styles.input}
        placeholder="e.g., 175"
      />

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        keyboardType="numeric"
        value={String(form.weightKg)}
        onChangeText={(t) => updateField('weightKg', t.replace(/[^0-9.]/g, ''))}
        style={styles.input}
        placeholder="e.g., 70"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        keyboardType="numeric"
        value={String(form.age)}
        onChangeText={(t) => updateField('age', t.replace(/[^0-9]/g, ''))}
        style={styles.input}
        placeholder="e.g., 28"
      />

      <Text style={styles.label}>Likes</Text>
      <TextInput
        value={form.likes}
        onChangeText={(t) => updateField('likes', t)}
        style={[styles.input, styles.multiline]}
        placeholder="Foods you like"
        multiline
      />

      <Text style={styles.label}>Dislikes / Restrictions</Text>
      <TextInput
        value={form.dislikes}
        onChangeText={(t) => updateField('dislikes', t)}
        style={[styles.input, styles.multiline]}
        placeholder="Dislikes, allergies"
        multiline
      />

      <View style={styles.testRow}>
        <Text style={styles.label}>Test mode (skip AI)</Text>
        <Switch value={testMode} onValueChange={setTestMode} />
      </View>

      <TouchableOpacity style={[styles.button, !canSubmit && styles.buttonDisabled]} disabled={!canSubmit || loading} onPress={submit}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Generate Meal Plan</Text>}
      </TouchableOpacity>

      {!!error && <Text style={styles.error}>{error}</Text>}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>Daily Target</Text>
          <Text style={styles.resultText}>Calories: {Math.round(result.calorieGoal)} kcal</Text>
          <Text style={styles.resultText}>Protein: {Math.round(result.macros.proteinGrams)} g</Text>
          <Text style={styles.resultText}>Carbs: {Math.round(result.macros.carbGrams)} g</Text>
          <Text style={styles.resultText}>Fat: {Math.round(result.macros.fatGrams)} g</Text>

          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>7-Day Plan</Text>
          {Object.entries(result.plan || {}).map(([day, meals]) => (
            <View key={day} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>{String(day).toUpperCase()}</Text>
              {['breakfast', 'lunch', 'dinner'].map(mealKey => (
                meals?.[mealKey] ? (
                  <Text key={mealKey} style={styles.mealText}>
                    {mealKey[0].toUpperCase() + mealKey.slice(1)}: {meals[mealKey]}
                  </Text>
                ) : null
              ))}
              {Array.isArray(meals?.snacks) && meals.snacks.length > 0 && (
                <Text style={styles.mealText}>Snacks: {meals.snacks.join(', ')}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12
  },
  label: {
    marginTop: 12,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top'
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 6,
    marginBottom: 6
  },
  chipActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff'
  },
  chipText: {
    color: '#333'
  },
  chipTextActive: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16
  },
  buttonDisabled: {
    backgroundColor: '#9cc7ff'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  },
  error: {
    color: '#c00',
    marginTop: 10
  },
  resultContainer: {
    marginTop: 20,
    paddingVertical: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  resultText: {
    marginTop: 4
  },
  dayBlock: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  dayTitle: {
    fontWeight: '700',
    marginBottom: 6
  },
  mealText: {
    marginTop: 2
  },
  testRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  small: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  }
});
