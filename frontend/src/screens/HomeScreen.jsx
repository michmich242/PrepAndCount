import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DMContext } from '../../app/_layout';
import { useMacros } from '../../hooks/macroContext';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [darkModeEnabled] = useContext(DMContext);
  const { state: macroState } = useMacros();
  const [groceryItems, setGroceryItems] = useState([]);
  const [quickAddItem, setQuickAddItem] = useState('');
  const [recentFoods, setRecentFoods] = useState([]);

  // Calculate macro percentages
  const totalMacros = macroState.protein.value + macroState.carbohydrate.value + macroState.fat.value;
  const proteinPercentage = totalMacros ? (macroState.protein.value / totalMacros) * 100 : 0;
  const carbsPercentage = totalMacros ? (macroState.carbohydrate.value / totalMacros) * 100 : 0;
  const fatsPercentage = totalMacros ? (macroState.fat.value / totalMacros) * 100 : 0;

  const theme = {
    background: darkModeEnabled ? '#1c1b1a' : '#fff',
    text: darkModeEnabled ? '#fff' : '#1c1b1a',
    card: darkModeEnabled ? '#2d2d2d' : '#f5f5f5',
  };

  const navigateToAddFood = () => {
    router.push('/add-food');
  };

  const navigateToGroceryList = () => {
    router.push('/grocery-list');
  };

  const navigateToMacros = () => {
    router.push('/macros');
  };

  const QuickActionsCard = () => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={navigateToAddFood}>
          <Ionicons name="add-circle-outline" size={24} color={theme.text} />
          <Text style={[styles.quickActionText, { color: theme.text }]}>Add Food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={navigateToGroceryList}>
          <Ionicons name="list-outline" size={24} color={theme.text} />
          <Text style={[styles.quickActionText, { color: theme.text }]}>Grocery List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={navigateToMacros}>
          <Ionicons name="pie-chart-outline" size={24} color={theme.text} />
          <Text style={[styles.quickActionText, { color: theme.text }]}>Macros</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const MacroProgressCard = () => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Macros</Text>
      <View style={styles.macroProgress}>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: theme.text }]}>Protein</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${proteinPercentage}%`, backgroundColor: '#FF6B6B' }]} />
          </View>
          <Text style={[styles.macroValue, { color: theme.text }]}>{Math.round(macroState.protein.value)}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: theme.text }]}>Carbs</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${carbsPercentage}%`, backgroundColor: '#4ECDC4' }]} />
          </View>
          <Text style={[styles.macroValue, { color: theme.text }]}>{Math.round(macroState.carbohydrate.value)}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={[styles.macroLabel, { color: theme.text }]}>Fats</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${fatsPercentage}%`, backgroundColor: '#FFD93D' }]} />
          </View>
          <Text style={[styles.macroValue, { color: theme.text }]}>{Math.round(macroState.fat.value)}g</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.welcomeText, { color: theme.text }]}>Welcome Back!</Text>
      
      <QuickActionsCard />
      <MacroProgressCard />
      
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Quick Add to Grocery List</Text>
        <View style={styles.quickAdd}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={quickAddItem}
            onChangeText={setQuickAddItem}
            placeholder="Add item..."
            placeholderTextColor={darkModeEnabled ? '#666' : '#999'}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => {
            if (quickAddItem.trim()) {
              setGroceryItems([...groceryItems, quickAddItem.trim()]);
              setQuickAddItem('');
            }
          }}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 8,
  },
  quickActionText: {
    marginTop: 4,
    fontSize: 12,
  },
  macroProgress: {
    marginTop: 8,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});