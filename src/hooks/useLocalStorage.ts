import React from 'react'

export const useLocalStorage = <T>(storageKey: string, fallbackState:T) => {
    const val = localStorage.getItem(storageKey);
    const [value, setValue] = React.useState(
      val ? JSON.parse(val) : fallbackState
    );
  
    React.useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);
  
    return [value, setValue];
  };