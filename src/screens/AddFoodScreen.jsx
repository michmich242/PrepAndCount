import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Context } from '../../app/_layout'
import { useContext } from "react"
import { DrawerLayout } from 'react-native-gesture-handler';



export default function AddFoodScreen() {
  const [foodItems, setFoodItems] = useState([
    { id: '1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: '2', name: 'Brown Rice', calories: 215, protein: 5, carbs: 44, fat: 1.8 },
    { id: '3', name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fat: 0.6 },
    { id: '4', name: 'Avocado', calories: 160, protein: 2, carbs: 9, fat: 15 },
  ]);

  const [darkModeEnabled, setDarkModeEnabled] = useContext(Context);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddFood = (item) => {
    if (!selectedItems.find((selected) => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveFood = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, {backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff"}]}>
      <Text style={[styles.header, {color: darkModeEnabled ? "#fff" : "#333"}]}>Add Food</Text>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchBar, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}, {color: darkModeEnabled ? "#fff" : "#333"}]}
        placeholder="Search food..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Food List */}
      <FlatList
        data={filteredFoodItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.foodItem, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}]}>
            <Text style={[styles.foodText, {color: darkModeEnabled ? "#fff" : "#333"}]}>{item.name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddFood(item)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No food items found.</Text>
        }
      />

      {/* Selected Food Items */}
      <Text style={[styles.selectedHeader, {color: darkModeEnabled ? "#fff" : "#333"}]}>Selected Food</Text>
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.selectedItem, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}]}>
            <Text style={[styles.foodText, {color: darkModeEnabled ? "#fff" : "#333"}]}>
              {item.name} - {item.calories} cal
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFood(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No food selected. Start adding items!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  foodText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007aff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
