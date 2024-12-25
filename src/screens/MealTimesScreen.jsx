import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ChangeMealTimesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Change Meal Times</Text>
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
