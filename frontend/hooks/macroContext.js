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
            // Ensure payload exists
            if (!action.payload) {
                console.warn('ADD_ITEM action missing payload');
                return state;
            }

            // Helper function to safely add values
            const safeAdd = (current, addition) => {
                if (addition?.value === undefined || addition?.value === null) {
                    return current;
                }
                return {
                    value: current.value + (Number(addition.value) || 0),
                    unit: current.unit
                };
            };

            // Return new state with safe additions
            return {
                ...state,
                calories: safeAdd(state.calories, action.payload.calories),
                protein: safeAdd(state.protein, action.payload.protein),
                fat: safeAdd(state.fat, action.payload.fat),
                carbohydrate: safeAdd(state.carbohydrate, action.payload.carbohydrate),
                saturated_fat: safeAdd(state.saturated_fat, action.payload.saturated_fat),
                unsaturated_fat: safeAdd(state.unsaturated_fat, action.payload.unsaturated_fat),
                trans_fat: safeAdd(state.trans_fat, action.payload.trans_fat),
                sugar: safeAdd(state.sugar, action.payload.sugar),
                fiber: safeAdd(state.fiber, action.payload.fiber),
                vitamin_c: safeAdd(state.vitamin_c, action.payload.vitamin_c),
                iron: safeAdd(state.iron, action.payload.iron),
                vitamin_a: safeAdd(state.vitamin_a, action.payload.vitamin_a),
                sodium: safeAdd(state.sodium, action.payload.sodium),
                calcium: safeAdd(state.calcium, action.payload.calcium),
                potassium: safeAdd(state.potassium, action.payload.potassium),
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