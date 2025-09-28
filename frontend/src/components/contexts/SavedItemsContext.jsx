import React, { createContext, useState, useEffect, useContext } from 'react';

export const SavedItemsContext = createContext();

export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedCount, setSavedCount] = useState(savedItems.length);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    setSavedCount(savedItems.length);
  }, [savedItems]);

  // Add item to saved items
  const addToSaved = (product) => {
    setSavedItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (!existingItem) {
        return [...prevItems, { ...product, savedAt: new Date().toISOString() }];
      }
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

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};
