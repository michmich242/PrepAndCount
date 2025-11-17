import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import API_URL from '../../config/config';

export default function MealPlanDayScreen({ route }) {
  const { dayKey = 'day1', meals = {}, calorieGoal, macros } = route.params || {};
  const [macrosByItem, setMacrosByItem] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instructions, setInstructions] = useState({});
  const mealOrder = ['breakfast', 'lunch', 'dinner'];
  const snacks = Array.isArray(meals?.snacks) ? meals.snacks : [];

  const items = useMemo(() => {
    const base = mealOrder
      .map(k => ({ key: k, name: meals?.[k] }))
      .filter(x => !!x.name);
    const snackItems = snacks.map((s, idx) => ({ key: `snack${idx + 1}`, name: s }));
    return [...base, ...snackItems];
  }, [meals, snacks]);

  useEffect(() => {
    let cancelled = false;
    const fetchMacros = async () => {
      try {
        setLoading(true);
        const payload = { items: items.map(it => ({ key: it.key, name: it.name })) };
        const resp = await fetch(`${API_URL}/api/nutrition/estimate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (!cancelled) setMacrosByItem(data.byKey || {});
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to fetch macros');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (items.length > 0) fetchMacros();
    return () => { cancelled = true; };
  }, [items]);

  const loadInstructions = async (name, key) => {
    try {
      setInstructions(prev => ({ ...prev, [key]: { loading: true } }));
      const res = await fetch(`${API_URL}/api/recipe-instructions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealName: name })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInstructions(prev => ({ ...prev, [key]: { steps: data.steps || [] } }));
    } catch (e) {
      setInstructions(prev => ({ ...prev, [key]: { error: e?.message || 'Failed to load instructions' } }));
    }
  };

  const renderRow = (label, key, name) => {
    const m = macrosByItem[key];
    const info = instructions[key];
    return (
      <View key={key} style={styles.card}>
        <Text style={styles.mealTitle}>{label}</Text>
        <Text style={styles.mealName}>{name}</Text>
        <Text style={styles.small}>
          {m ? `≈ ${Math.round(m.calories)} kcal | P ${Math.round(m.protein)}g · C ${Math.round(m.carbs)}g · F ${Math.round(m.fat)}g` : 'Macros unavailable'}
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => loadInstructions(name, key)}>
          <Text style={styles.btnText}>How to cook</Text>
        </TouchableOpacity>
        {info?.loading && <ActivityIndicator style={{ marginTop: 6 }} />}
        {!!info?.error && <Text style={[styles.small, { color: '#c00' }]}>{info.error}</Text>}
        {Array.isArray(info?.steps) && info.steps.length > 0 && (
          <View style={styles.steps}>
            {info.steps.map((s, i) => (
              <Text key={i} style={styles.stepLine}>{`${i + 1}. ${s}`}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{String(dayKey).toUpperCase()}</Text>
      {!!calorieGoal && !!macros && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Daily Target: {Math.round(calorieGoal)} kcal</Text>
          <Text style={styles.summaryText}>P {Math.round(macros.proteinGrams)}g · C {Math.round(macros.carbGrams)}g · F {Math.round(macros.fatGrams)}g</Text>
        </View>
      )}
      {!!error && <Text style={[styles.small, { color: '#c00' }]}>{error}</Text>}
      {loading && <ActivityIndicator />}
      {mealOrder.map(k => meals?.[k] ? renderRow(k[0].toUpperCase() + k.slice(1), k, meals[k]) : null)}
      {snacks.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.section}>Snacks</Text>
          {snacks.map((s, idx) => renderRow(`Snack ${idx + 1}`, `snack${idx + 1}`, s))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  summary: { marginTop: 8 },
  summaryText: { color: '#555' },
  card: { marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 10 },
  mealTitle: { fontWeight: '700', marginBottom: 4 },
  mealName: { marginBottom: 4 },
  small: { fontSize: 12, color: '#666' },
  btn: { marginTop: 8, backgroundColor: '#007aff', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  section: { fontWeight: '700', marginBottom: 6 },
  steps: { marginTop: 8 },
  stepLine: { marginTop: 4 }
});


