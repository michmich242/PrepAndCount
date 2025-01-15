import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    calories: {value: 0, unit: "kCal"},
    protein: { value: 0, unit: "g" },
    fat: { value: 0, unit: "g" },
    carbohydrate: { value: 0, unit: "g" },
    saturated_fat: { value: 0, unit: "g" },
    unsaturated_fat: { value: 0, unit: "g" },
    trans_fat: { value: 0, unit: "g" },
    sugar: { value: 0, unit: "g" },
    fiber: { value: 0, unit: "g" },
    vitamin_c: { value: 0, unit: "mg" },
    iron: { value: 0, unit: "mg" },
    vitamin_a: { value: 0, unit: "IU" },
    sodium: { value: 0, unit: "mg" },
    calcium: { value: 0, unit: "mg" },
    potassium: { value: 0, unit: "mg" },
  };
  
  // Reducer Function
  const macroReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          calories: {
            value: state.calories + action.payload.calories,
            unit: state.calories.unit
          },
          protein: {
            value: state.protein.value + action.payload.protein.value,
            unit: state.protein.unit,
          },
          fat: {
            value: state.fat.value + action.payload.fat.value,
            unit: state.fat.unit,
          },
          carbohydrate: {
            value: state.carbohydrate.value + action.payload.carbohydrate.value,
            unit: state.carbohydrate.unit,
          },
          saturated_fat: {
            value: state.saturated_fat.value + action.payload.saturated_fat.value,
            unit: state.saturated_fat.unit,
          },
          unsaturated_fat: {
            value: state.unsaturated_fat.value + action.payload.unsaturated_fat.value,
            unit: state.unsaturated_fat.unit,
          },
          trans_fat: {
            value: state.trans_fat.value + action.payload.trans_fat.value,
            unit: state.trans_fat.unit,
          },
          sugar: {
            value: state.sugar.value + action.payload.sugar.value,
            unit: state.sugar.unit,
          },
          fiber: {
            value: state.fiber.value + action.payload.fiber.value,
            unit: state.fiber.unit,
          },
          vitamin_c: {
            value: state.vitamin_c.value + action.payload.vitamin_c.value,
            unit: state.vitamin_c.unit,
          },
          iron: {
            value: state.iron.value + action.payload.iron.value,
            unit: state.iron.unit,
          },
          vitamin_a: {
            value: state.vitamin_a.value + action.payload.vitamin_a.value,
            unit: state.vitamin_a.unit,
          },
          sodium: {
            value: state.sodium.value + action.payload.sodium.value,
            unit: state.sodium.unit,
          },
          calcium: {
            value: state.calcium.value + action.payload.calcium.value,
            unit: state.calcium.unit,
          },
          potassium: {
            value: state.potassium.value + action.payload.potassium.value,
            unit: state.potassium.unit,
          },
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }

  };
  
  // Create Context
  const MacroContext = createContext();
  
  // Provider Component
  export const MacroProvider = ({ children }) => {
    const [state, dispatch] = useReducer(macroReducer, initialState);
    return (
      <MacroContext.Provider value={{ state, dispatch }}>
        {children}
      </MacroContext.Provider>
    );
  };
  
  // Custom Hook to use Macro Context
  export const useMacros = () => useContext(MacroContext);