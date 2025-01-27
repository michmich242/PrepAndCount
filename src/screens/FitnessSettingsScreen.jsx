import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function FitnessSettingsScreen(){
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  const handleSubmit = () => {
    if (!height || !weight || !fitnessGoal) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    Alert.alert("Success", `Height: ${height}, Weight: ${weight}, Goal: ${fitnessGoal}`);
    // You can handle further form submission logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Settings</Text>

      <Text style={styles.label}>Height (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your height"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Weight (lbs):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your weight"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Fitness Goal:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Lose weight, Build muscle"
        value={fitnessGoal}
        onChangeText={setFitnessGoal}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 20,
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

