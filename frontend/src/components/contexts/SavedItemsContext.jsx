import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the SavedItems Context
export const SavedItemsContext = createContext();

// SavedItems Provider component to wrap the app
export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  // Load saved items from localStorage on component mount
  useEffect(() => {
    try {
      const savedItemsFromStorage = localStorage.getItem('savedItems');
      if (savedItemsFromStorage) {
        const parsedSavedItems = JSON.parse(savedItemsFromStorage);
        setSavedItems(parsedSavedItems);
        updateSavedCount(parsedSavedItems);
      }
    } catch (error) {
      console.error('Error loading saved items from localStorage:', error);
    }
  }, []);

  // Save items to localStorage whenever saved items change
  useEffect(() => {
    try {
      localStorage.setItem('savedItems', JSON.stringify(savedItems));
      updateSavedCount(savedItems);
    } catch (error) {
      console.error('Error saving items to localStorage:', error);
    }
  }, [savedItems]);

  // Update saved count
  const updateSavedCount = (items) => {
    setSavedCount(items.length);
  };

  // Add item to saved items
  const addToSaved = (product) => {
    setSavedItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (!existingItem) {
        // If item doesn't exist, add to saved items
        return [...prevItems, { ...product, savedAt: new Date().toISOString() }];
      }
      
      // If item already exists, don't add duplicate
      return prevItems;
    });
  };

  // Remove item from saved items
  const removeFromSaved = (productId) => {
    setSavedItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear all saved items
  const clearSavedItems = () => {
    setSavedItems([]);
  };

  // Check if item is saved
  const isSaved = (productId) => {
    return savedItems.some(item => item.id === productId);
  };

  // Toggle save status
  const toggleSave = (product) => {
    if (isSaved(product.id)) {
      removeFromSaved(product.id);
    } else {
      addToSaved(product);
    }
  };

  // Get saved item by ID
  const getSavedItem = (productId) => {
    return savedItems.find(item => item.id === productId);
  };

  // Move item from saved to cart (requires cart context)
  const moveToCart = (productId, addToCartFunction) => {
    const savedItem = getSavedItem(productId);
    if (savedItem && addToCartFunction) {
      addToCartFunction(savedItem, 1);
      removeFromSaved(productId);
      return true;
    }
    return false;
  };

  const value = {
    savedItems,
    savedCount,
    addToSaved,
    removeFromSaved,
    clearSavedItems,
    isSaved,
    toggleSave,
    getSavedItem,
    moveToCart
  };

  return (
    <SavedItemsContext.Provider value={value}>
      {children}
    </SavedItemsContext.Provider>
  );
};

// Custom hook to use saved items context
export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};
