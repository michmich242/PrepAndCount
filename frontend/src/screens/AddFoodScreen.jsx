import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { callFindByID } from '../../api/callAPI.js';
import { DMContext } from '../../app/_layout'
import { useContext } from "react"
import { callAutoComplete } from '../../api/callAPI.js';
import { callSearch } from '../../api/callAPI.js';
import MacrosScreen from './MacrosScreen.jsx';
import { useNavigation } from '@react-navigation/native';


export default function AddFoodScreen() {
  const [pageNumber, setPageNumber] = useState(0);
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [maxResults, setMaxResults] = useState(0);
  const[foodItems, setFoodItems] = useState([]);

  const [darkModeEnabled, setDarkModeEnabled] = useContext(DMContext);
  const [isSuggesting, setSuggesting] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const navigation = useNavigation();

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
 const handleFetchingFood = (suggestion, pageNumber) => {
    async function fetchFoodItems(){
      try{
        const [food, new_max_results] = await callSearch(suggestion, pageNumber);

        if(new_max_results != maxResults){
          setMaxResults(new_max_results);
        }

        const foodNames = food.food.map((item) => ({
            food_id: item.food_id,
            food_name: item.food_name,
            brand_name: item.brand_name
        }));
      
        
        setFoodItems(foodNames);
      }catch(error){
        console.error("Error fetching food: ", error);
        setFoodItems([]);
      }
    }

    fetchFoodItems();
  }
  
  //Search for clicked suggestion, clear suggestions
  const handleSuggestionClick = (suggestion) => {
   if(pageNumber != 0) setPageNumber(0);
    setSearchText(suggestion);
    setFoodSuggestions([]);
    handleFetchingFood(suggestion, pageNumber);
  }

  const handleAddFood = (item) => {
    if (!selectedItems.find((selected) => selected.food_id === item.food_id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveFood = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.food_id !== itemId));
  };

  const handleNextClick = () => {
    setPageNumber(pageNumber + 1);
    handleFetchingFood(searchText, pageNumber + 1)
  }

  const handlePrevClick = () => {
    setPageNumber(pageNumber - 1);
    handleFetchingFood(searchText, pageNumber - 1);
  }
  
  //grab food info from API call for specific food id, go to macros screen and send info
  async function handleMacroNav(food_id) {
    try {
        const food_info = await callFindByID(food_id);

        // Validate food_info[2].serving
        if (food_info && Array.isArray(food_info[2]?.serving) && food_info[2].serving.length > 0) {
            navigation.navigate('Macros Screen', { 
              food_info, 
              protein: food_info[2]?.serving[0].protein, 
              fat: food_info[2]?.serving[0].fat, 
              carbohydrate: food_info[2]?.serving[0].carbohydrate , 
              fiber: food_info[2]?.serving[0].fiber,
              vitamin_c: food_info[2]?.serving[0].vitamin_c,
              iron: food_info[2]?.serving[0].iron,
              vitamin_a: food_info[2]?.serving[0].vitamin_a,
              calcium: food_info[2]?.serving[0].calcium,
              sodium: food_info[2]?.serving[0].sodium,
              potassium: food_info[2]?.serving[0].potassium,
            });
        } else {
            console.log('Invalid food_info, no serving found');
            alert('No valid serving data found for this food item.');
        }
    } catch (error) {
        console.error('Error navigating to Macros Screen:', error);
        alert('Failed to fetch food information. Please try again.');
    }
}



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
          keyExtractor={(index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {handleSuggestionClick(item); setSuggesting(false); setSearchText(item)}}>
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
            <Text multiline={true} style={[styles.foodText, {color: darkModeEnabled ? "#fff" : "#333"}]}>{item.food_name} ({(item.brand_name != null) ? item.brand_name : "Generic"})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleMacroNav(item.food_id)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            
          </View>
          
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No food items found.</Text>
        }
      />}

      {/* Next and Prev Buttons */}
      
          <View style={[styles.changePageButtonContainer,{ justifyContent: (pageNumber > 0 ) ? "space-between" : "flex-end"}]}>
            {pageNumber > 0 && 
            <TouchableOpacity
            onPress={() => handlePrevClick()}>
              <Text>Prev</Text>
            </TouchableOpacity>
            }
          {
          (pageNumber < (maxResults-5/5)) && 
          <TouchableOpacity
          onPress={() => handleNextClick()}>
            <Text>Next</Text>
          </TouchableOpacity>
          }
          </View>


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
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
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
    borderWidth: 1,
    borderColor: "#ccc",
  },
  suggestionItem: {
    padding: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomColor: "#ddd",
    borderRadius: 2,
  },
  changePageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 5,
  },
  changePageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '18%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  }
});
