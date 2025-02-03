import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';




export default function WorkoutCalendar() {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          console.log('Selected day:', day);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 20,
  },
});
