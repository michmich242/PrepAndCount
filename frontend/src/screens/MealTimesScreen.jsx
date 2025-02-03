import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MealTimesContext } from '../../hooks/mealTimes';
import { DMContext } from '../../app/_layout';

export default function ChangeMealTimesScreen({ navigation }) {
  const [darkModeEnabled] = useContext(DMContext);
  const { breakfastTime, setBreakfastTime, lunchTime, setLunchTime, dinnerTime, setDinnerTime } = useContext(MealTimesContext);

  const bgColor = darkModeEnabled ? "#1c1b1a" : "#f8f9fa";
  const textColor = darkModeEnabled ? "#ffffff" : "#333";
  const inputBgColor = darkModeEnabled ? "#2c2c2c" : "#ffffff";

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Change Meal Times</Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: textColor }]}>Breakfast Time</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
          value={breakfastTime}
          onChangeText={setBreakfastTime}
          placeholder="Enter Breakfast Time"
          placeholderTextColor={textColor}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: textColor }]}>Lunch Time</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
          value={lunchTime}
          onChangeText={setLunchTime}
          placeholder="Enter Lunch Time"
          placeholderTextColor={textColor}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: textColor }]}>Dinner Time</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
          value={dinnerTime}
          onChangeText={setDinnerTime}
          placeholder="Enter Dinner Time"
          placeholderTextColor={textColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
  },
});
