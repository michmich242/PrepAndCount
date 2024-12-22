import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function GroceryListScreen() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  const addItem = () => {
    if (text.trim() !== '') {
      setItems([
        ...items,
        { id: Date.now().toString(), name: text, completed: false },
      ]);
      setText('');
    }
  };

  const toggleComplete = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.header}>Grocery List</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a grocery item"
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Grocery List Section */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => toggleComplete(item.id)}
              style={styles.checkbox}
            >
              {item.completed && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.itemText,
                item.completed && styles.itemTextCompleted,
              ]}
            >
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteText}>✖</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>Your grocery list is empty.</Text>
        }
      />
    </KeyboardAvoidingView>
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
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007aff',
    padding: 15,
    marginLeft: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#007aff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: 'bold',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteText: {
    fontSize: 18,
    color: '#ff3b30',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
