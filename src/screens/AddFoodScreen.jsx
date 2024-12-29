import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { DMContext } from '../../app/_layout'
import { useContext } from "react"
import { callAutoComplete } from '../../callAPI';
import { callSearch } from '../../callAPI';


export default function AddFoodScreen() {
  const [foodSuggestions, setFoodSuggestions] = useState([]);

/*
  const [foodItems, setFoodItems] = useState([{
    food_id: 59586,
    food_name: "none",
    brand_name: "none",
    food_type: "none",
    food_url: "none",
    servings:{
      serving: []
    }
  }]);
  */

const[foodItems, setFoodItems] = useState([]);

  const [darkModeEnabled, setDarkModeEnabled] = useContext(DMContext);
  const [isSuggesting, setSuggesting] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if(searchText.length > 0){
        async function fetchSuggestion(){
          try{
            const suggestions = await callAutoComplete(searchText.trim());
            setFoodSuggestions(suggestions || []);
          } catch (error){
            console.error("Error fetching suggestions: ", error);
            setFoodSuggestions([]);
          }
      }

      fetchSuggestion();
    }else{
      setFoodSuggestions([]);
    }
  }, [searchText])


 //fetch food for food list
 const handleFetchingFood = (suggestion) => {
    async function fetchFoodItems(){
      try{
        const food = await callSearch(suggestion);
        

        const foodNames = food.food.map((item) => ({
            food_id: item.food_id,
            food_name: item.food_name
        }));
      
        
        setFoodItems(foodNames);
        console.log(foodNames);

      }catch(error){
        console.error("Error fetching food: ", error);
        setFoodItems([]);
      }
    }

    fetchFoodItems();
  }

  //Search for clicked suggestion, clear suggestions
  const handleSuggestionClick = (suggestion) => {
    setSearchText(suggestion);
    setFoodSuggestions([]);
    handleFetchingFood(suggestion);
  }

  const handleAddFood = (item) => {
    if (!selectedItems.find((selected) => selected.food_id === item.food_id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveFood = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.food_id !== itemId));
  };

  



  return (
    <View style={[styles.container, {backgroundColor: darkModeEnabled ? "#1c1b1a" : "#fff"}]}>
      <Text style={[styles.header, {color: darkModeEnabled ? "#fff" : "#333"}]}>Add Food</Text>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchBar, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}, {color: darkModeEnabled ? "#fff" : "#333"}]}
        placeholder="Search food..."
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={(text) => 
          {
            setSearchText(text);
            setSuggesting(true);
          }
        }
      />
      {foodSuggestions.length > 0 && isSuggesting && (
        <FlatList
          data={foodSuggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {handleSuggestionClick(item); setSuggesting(false);}}>
              <Text style={[styles.suggestionItem, {color: darkModeEnabled ? "#fff" : "#333"}]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Food List */}
      {foodItems.length > 0 && foodItems[0]?.food_id != null && <FlatList
        data={foodItems}
        keyExtractor={(item) => item.food_id}
        renderItem={({ item }) => (
          <View style={[styles.foodItem, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}]}>
            <Text multiline={true} style={[styles.foodText, {color: darkModeEnabled ? "#fff" : "#333"}]}>{item.food_name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {handleAddFood(item);}}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            
          </View>
          
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No food items found.</Text>
        }
      />}

      {/* Selected Food Items */}
      <Text style={[styles.selectedHeader, {color: darkModeEnabled ? "#fff" : "#333"}]}>Selected Food</Text>
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.food_id}
        renderItem={({ item }) => (
          <View style={[styles.selectedItem, {backgroundColor: darkModeEnabled ? "#333" : "#fff"}]}>
            <Text multiline={true} maxLength={5} style={[styles.selected_text, {color: darkModeEnabled ? "#fff" : "#333"}]}>
              {item.food_name} - {item.calories} cal
            </Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveFood(item.food_id)}
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
  selected_text:{
    padding: 3,
    fontSize: 16,
    color: "#333",
    width: '70%'
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
    width: '80%',
    
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
    padding: 13,
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
  searchBar: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  suggestionItem: {
    padding: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomColor: "#ddd",
    borderRadius: 5,
  },
});
