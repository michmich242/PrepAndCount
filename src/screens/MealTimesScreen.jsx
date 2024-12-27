import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MealTimesContext } from '../../hooks/mealTimes';
import { DMContext } from '../../app/_layout';

export default function ChangeMealTimesScreen({ navigation }) {
  const [darkModeEnabled] = useContext(DMContext); 
  const { breakfastTime, setBreakfastTime, lunchTime, setLunchTime, dinnerTime, setDinnerTime } = useContext(MealTimesContext);

  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff" }]}>
      <View style={styles.text}>
        <Text>Breakfast Time</Text>
        <TextInput
          keyboardType="number-pad"
          style={styles.textInput}
          value={breakfastTime}
          onChangeText={setBreakfastTime}
          placeholder={breakfastTime || "Set Breakfast Time"}
        />
      </View>
      <View style={styles.text}>
        <Text>Lunch Time</Text>
        <TextInput
          style={styles.textInput}
          value={lunchTime}
          onChangeText={setLunchTime}
          placeholder="Enter lunch time"
        />
      </View>
      <View style={styles.text}>
        <Text>Dinner Time</Text>
        <TextInput
          style={styles.textInput}
          value={dinnerTime}
          onChangeText={setDinnerTime}
          placeholder="Enter dinner time"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    marginBottom: 20,
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
