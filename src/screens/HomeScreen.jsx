import React, { useState, useContext } from 'react';
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
import { DMContext } from '../../app/_layout';

const screenWidth = Dimensions.get('window').width;
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export default function HomeScreen() {
  const [darkModeEnabled] = useContext(DMContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [mealText, setMealText] = useState('');
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);

  const theme = {
    background: darkModeEnabled ? '#1c1b1a' : '#fff',
    text: darkModeEnabled ? '#fff' : '#333',
    button: darkModeEnabled ? '#2c2c2c' : '#e0e0e0',
    buttonActive: '#007aff',
    border: darkModeEnabled ? '#333' : '#ccc',
  };

  const macroData = [
    { name: 'Protein', value: 30, color: '#4287f5' },
    { name: 'Carbs', value: 40, color: '#f54242' },
    { name: 'Fats', value: 30, color: '#f5d142' },
  ].map(item => ({
    ...item,
    population: item.value,
    legendFontColor: theme.text,
    legendFontSize: 12,
  }));

  const addMeal = () => {
    if (!mealText.trim()) return;
    
    const formattedDate = selectedDate.toDateString();
    setMeals(prevMeals => ({
      ...prevMeals,
      [formattedDate]: {
        ...prevMeals[formattedDate] || { Breakfast: [], Lunch: [], Dinner: [] },
        [mealType]: [...(prevMeals[formattedDate]?.[mealType] || []), mealText],
      },
    }));
    setMealText('');
  };

  const renderMealTypeButton = (type) => (
    <TouchableOpacity
      key={type}
      style={[
        styles.mealTypeButton,
        { backgroundColor: mealType === type ? theme.buttonActive : theme.button },
      ]}
      onPress={() => setMealType(type)}
    >
      <Text style={[styles.mealTypeText, { color: mealType === type ? '#fff' : theme.text }]}>
        {type}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Calendar Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Calendar</Text>
        <TouchableOpacity 
          style={[styles.calendarButton, { backgroundColor: theme.button }]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Plan Meals for {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Today's Overview */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Today's Meals</Text>
        {MEAL_TYPES.map(type => (
          <Text key={type} style={[styles.mealText, { color: theme.text }]}>
            {meals[selectedDate.toDateString()]?.[type]?.length ? '☑' : '☐'} {type}
          </Text>
        ))}
      </View>

      {/* Macros Chart */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Macros</Text>
        <PieChart
          data={macroData}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: theme.background,
            backgroundGradientTo: theme.background,
            color: (opacity = 1) => `rgba(${darkModeEnabled ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
            strokeWidth: 2,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      {/* Meal Planning Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Plan Meals
            </Text>

            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={(_, date) => date && setSelectedDate(date)}
              style={styles.datePicker}
            />

            <View style={styles.mealTypeContainer}>
              {MEAL_TYPES.map(renderMealTypeButton)}
            </View>

            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              placeholder={`Add a ${mealType} item`}
              placeholderTextColor={theme.text}
              value={mealText}
              onChangeText={setMealText}
            />

            <FlatList
              data={meals[selectedDate.toDateString()]?.[mealType] || []}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <Text style={[styles.mealItem, { color: theme.text }]}>{item}</Text>
              )}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  No {mealType.toLowerCase()} planned
                </Text>
              }
              style={styles.mealList}
            />

            <View style={styles.modalButtons}>
              <Button title="Add Meal" onPress={addMeal} />
              <Button title="Close" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendarButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealText: {
    fontSize: 16,
    marginVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  datePicker: {
    marginVertical: 16,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  mealTypeButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  mealTypeText: {
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  mealList: {
    maxHeight: 200,
    marginVertical: 16,
  },
  mealItem: {
    fontSize: 16,
    paddingVertical: 8,
  },
  emptyText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});