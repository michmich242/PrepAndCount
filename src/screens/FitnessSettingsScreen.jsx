import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useContext, useEffect } from 'react';
import { DMContext } from "../../app/_layout";

export default function FitnessSettingsScreen(){
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [darkModeEnabled] = useContext(DMContext);

  const handleSubmit = () => {
    if (!height || !weight || !fitnessGoal) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    Alert.alert("Success", `Height: ${height}, Weight: ${weight}, Goal: ${fitnessGoal}`);
    // You can handle further form submission logic here
  };

  return (
    <View style={[styles.container, {backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff'}]}>
      <Text style={[styles.title, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}>Fitness Settings</Text>

      <Text style={[styles.label, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}>Height (cm):</Text>
      <TextInput
        style={[styles.input, {backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff'}, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}
        keyboardType="numeric"
        placeholder="Enter your height"
        placeholderTextColor={darkModeEnabled ? '#fff' : '#1c1b1a'}
        value={height}
        onChangeText={setHeight}
      />

      <Text style={[styles.label, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}>Weight (lbs):</Text>
      <TextInput
        style={[styles.input, {backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff'}, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}
        keyboardType="numeric"
        placeholder="Enter your weight"
        placeholderTextColor={darkModeEnabled ? '#fff' : '#1c1b1a'}
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={[styles.label, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}>Fitness Goal:</Text>
      <TextInput
        style={[styles.input, {backgroundColor: darkModeEnabled ? '#1c1b1a' : '#fff'}, {color: darkModeEnabled ? '#fff' : '#1c1b1a'}]}
        placeholder="e.g., Lose weight, Build muscle"
        placeholderTextColor={darkModeEnabled ? '#fff' : '#1c1b1a'}
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

