import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Context } from '../../app/_layout';


export default function ChangeMealTimesScreen({ navigation }) {
  const [darkModeEnabled, setDarkModeEnabled] = useContext(Context);
  
  return (
    <View style={[styles.container, { backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff" }]}>
      <Text style={[styles.text, { color: darkModeEnabled ? "#fff" : "#1c1b1a" }]}>Change Meal Times</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
