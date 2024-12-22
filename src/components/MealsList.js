import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function MealsList({ meals }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Meals</Text>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.completed ? styles.completedMeal : styles.meal}>
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meal: {
    fontSize: 16,
    color: '#000',
  },
  completedMeal: {
    fontSize: 16,
    color: 'green',
    textDecorationLine: 'line-through',
  },
});
