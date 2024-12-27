import React, { createContext, useState } from 'react';

// Create the context
export const MealTimesContext = createContext();

// Create a provider component
export function MealTimesProvider({ children }) {
  const [breakfastTime, setBreakfastTime] = useState("08:00 AM");
  const [lunchTime, setLunchTime] = useState("12:00 PM");
  const [dinnerTime, setDinnerTime] = useState("06:00 PM");

  return (
    <MealTimesContext.Provider value={{ breakfastTime, setBreakfastTime, lunchTime, setLunchTime, dinnerTime, setDinnerTime }}>
      {children}
    </MealTimesContext.Provider>
  );
}
