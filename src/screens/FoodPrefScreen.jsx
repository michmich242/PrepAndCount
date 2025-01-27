import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";

export default function FoodPrefScreen(){
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [allergens, setAllergens] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");

  const handleSubmit = () => {
    if (!likes || !dislikes || !allergens || !dietaryRestrictions) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    Alert.alert(
      "Preferences Submitted",
      `Likes: ${likes}\nDislikes: ${dislikes}\nAllergens: ${allergens}\nDietary Restrictions: ${dietaryRestrictions}`
    );
    // Further submission logic can go here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food Preferences</Text>

      <Text style={styles.label}>Likes:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Fruits, Vegetables"
        value={likes}
        onChangeText={setLikes}
      />

      <Text style={styles.label}>Dislikes:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Spicy food, Mushrooms"
        value={dislikes}
        onChangeText={setDislikes}
      />

      <Text style={styles.label}>Allergens:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Peanuts, Gluten"
        value={allergens}
        onChangeText={setAllergens}
      />

      <Text style={styles.label}>Dietary Restrictions:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g., Vegan, Halal"
        value={dietaryRestrictions}
        onChangeText={setDietaryRestrictions}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

