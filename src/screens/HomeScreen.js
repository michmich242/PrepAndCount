import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

// Dynamically get the screen width for responsive chart scaling
const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  // State variables
  const [modalVisible, setModalVisible] = useState(false); // Controls the visibility of the meal planning modal
  const [selectedDate, setSelectedDate] = useState(new Date()); // Stores the currently selected date for meal planning
  const [meals, setMeals] = useState({}); // Stores all meal data, organized by date
  const [mealText, setMealText] = useState(''); // Temporary state for the meal item being added
  const [mealType, setMealType] = useState('Breakfast'); // Tracks the selected meal type (Breakfast, Lunch, Dinner)

  // Toggles the visibility of the modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Adds a meal to the selected date and meal type
  const addMeal = () => {
    const formattedDate = selectedDate.toDateString(); // Format the date to use as a key
    if (!meals[formattedDate]) {
      // Initialize date key if it doesn't exist
      meals[formattedDate] = { Breakfast: [], Lunch: [], Dinner: [] };
    }
    meals[formattedDate][mealType].push(mealText); // Add the meal to the correct meal type
    setMeals({ ...meals });   // Update state with the new meal
    setMealText('');          // Clear the input field
  };

  return (
    <View style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <Text style={styles.sectionHeader}>Calendar</Text>
        <TouchableOpacity style={styles.calendarPlaceholder} onPress={toggleModal}>
          <Text style={styles.placeholderText}>Tap to Plan Meals</Text>
        </TouchableOpacity>
      </View>

      {/* Meal Planning Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Plan Meals for {selectedDate.toDateString()}</Text>

            {/* Date Picker */}
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                if (event.type === 'set' && date) {
                  setSelectedDate(date); // Update selected date
                }
                toggleModal(); // Close the modal
              }}
            />

            {/* Meal Type Selector */}
            <View style={styles.mealTypeContainer}>
              {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.mealTypeButton, mealType === type && styles.activeMealType]}
                  onPress={() => setMealType(type)} // Update the selected meal type
                >
                  <Text style={styles.mealTypeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Meal Input */}
            <TextInput
              style={styles.input}
              placeholder={`Add a ${mealType} item`}
              value={mealText}
              onChangeText={setMealText} // Update the input field state
            />
            <Button title="Add Meal" onPress={addMeal} />

            {/* Scheduled Meals */}
            <Text style={styles.scheduledHeader}>Scheduled Meals</Text>
            <FlatList
              data={meals[selectedDate.toDateString()]?.[mealType] || []} // Retrieve meals for the selected date and type
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => <Text style={styles.scheduledMeal}>{item}</Text>}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No {mealType} items scheduled.</Text>
              }
            />

            {/* Close Modal */}
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>

      {/* Today's Meals and Macros Section */}
      <View style={styles.mealsAndMacros}>
        <View style={styles.mealsSection}>
          <Text style={styles.sectionHeader}>Today's Meals</Text>
          <Text style={styles.mealText}>☑ Breakfast</Text>
          <Text style={styles.mealText}>☐ Lunch</Text>
          <Text style={styles.mealText}>☐ Dinner</Text>
        </View>
        <View style={styles.macrosSection}>
          <Text style={styles.sectionHeader}>Macros</Text>
          <PieChart
            data={[
              { name: 'Protein', population: 30, color: 'blue', legendFontColor: '#333', legendFontSize: 12 },
              { name: 'Carbs', population: 40, color: 'red', legendFontColor: '#333', legendFontSize: 12 },
              { name: 'Fats', population: 30, color: 'yellow', legendFontColor: '#333', legendFontSize: 12 },
            ]}
            width={screenWidth * 0.8} // Chart width scales with screen size
            height={150}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              barPercentage: 0.5,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      </View>
    </View>
  );
}

// Styles for the UI components
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  calendarSection: { marginBottom: 20 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  calendarPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
  },
  placeholderText: { color: '#333', fontStyle: 'italic', fontWeight: '600' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  mealTypeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  mealTypeButton: { padding: 10, borderRadius: 5, backgroundColor: '#e0e0e0' },
  activeMealType: { backgroundColor: '#007aff' },
  mealTypeText: { color: '#333' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, marginBottom: 10, paddingHorizontal: 10 },
  scheduledHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  scheduledMeal: { fontSize: 16, marginBottom: 5 },
  emptyText: { fontStyle: 'italic', color: '#aaa' },
});
