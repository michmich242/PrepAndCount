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
import { useMacros } from '../../hooks/macroContext';

const screenWidth = Dimensions.get('window').width;
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

export default function HomeScreen() {
  const [darkModeEnabled] = useContext(DMContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({});
  const [mealText, setMealText] = useState('');
  const [mealType, setMealType] = useState(MEAL_TYPES[0]);
  const { state, dispatch } = useMacros();

  const theme = {
    background: darkModeEnabled ? '#1c1b1a' : '#fff',
    text: darkModeEnabled ? '#fff' : '#333',
    button: darkModeEnabled ? '#2c2c2c' : '#e0e0e0',
    buttonActive: '#007aff',
    border: darkModeEnabled ? '#333' : '#ccc',
    card: darkModeEnabled ? '#2c2c2c' : '#fff',
  };

  // Calculate total macros
  const totalMacros = state.protein.value + state.fat.value + (state.carbohydrate.value - state.fiber.value);
  const proteinPercentage = Math.round((100 * (state.protein.value / totalMacros)));
  const fatPercentage = Math.round((100 * (state.fat.value / totalMacros)));
  const netCarbPercentage = Math.round((100 * ((state.carbohydrate.value - state.fiber.value) / totalMacros)));

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

      {/* Macros Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: theme.text }]}>Macros</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Energy Summary</Text>
          <View style={styles.chartContainer}>
            <View style={styles.legendContainer}>
              <Text style={[styles.legendText, { color: '#fbd203' }]}>
                Protein ({Math.round(state.protein.value)}g) - {(proteinPercentage) ? Math.round(proteinPercentage) : 0}%
              </Text>
              <Text style={[styles.legendText, { color: '#ffb300' }]}>
                Fat ({Math.round(state.fat.value)}g) - {(fatPercentage) ? Math.round(fatPercentage) : 0}%
              </Text>
              <Text style={[styles.legendText, { color: '#ff9100' }]}>
                Net Carbs ({Math.round(state.carbohydrate.value - state.fiber.value)}g) - {(netCarbPercentage) ? Math.round(netCarbPercentage) : 0}%
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.pieContainer}>
              <PieChart
                data={[
                  {
                    name: `Protein ${state.protein.value}g`,
                    population: state.protein.value,
                    color: '#fbd203',
                    legendFontColor: theme.text,
                  },
                  {
                    name: `Fat ${state.fat.value}g`,
                    population: state.fat.value,
                    color: '#ffb300',
                    legendFontColor: theme.text,
                  },
                  {
                    name: `Net Carbs ${state.carbohydrate.value - state.fiber.value}g`,
                    population: state.carbohydrate.value - state.fiber.value,
                    color: '#ff9100',
                    legendFontColor: theme.text,
                  }
                ]}
                width={500}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  backgroundGradientFrom: '#1E2923',
                  backgroundGradientTo: '#08130D',
                  strokeWidth: 2, 
                  barPercentage: 0.5,
                  propsForLabels: {
                    display: false
                  }
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                hasLegend={false}
                center={[screenWidth / 4, 0]}
              />
              </View>
              <View style={styles.calorieContainer}>
                <Text style={[styles.calorieValue, { color: theme.text }]}>
                  {state.calories.value}
                </Text>
                <Text style={[styles.calorieUnit, { color: theme.text }]}>
                  kCal
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Meal Planning Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>Plan Meals</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendContainer: {
    flex: 1,
    paddingRight: 16,
  },
  legendText: {
    fontSize: 14,
    marginVertical: 4,
    fontWeight: '500',
  },
  rightContainer: {
    position: 'relative',
    width: 125,
    height: 125,
  },
  pieContainer: {
    position: 'absolute',
    left: -196,
    bottom: -35,
  },
  calorieContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -65 },
      { translateY: -53 }, 
    ],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 0, 
    width: 100, 
    height: 100, 
    borderRadius: 50,
  },
  calorieValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieUnit: {
    fontSize: 14,
    color: '#666',
  },
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