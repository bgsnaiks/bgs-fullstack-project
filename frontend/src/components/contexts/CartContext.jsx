import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const isInCart = (id) => {
    return cartItems.some(item => item.id === id);
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      isInCart,
      getItemQuantity,
      setCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);






// // 
// import React, { createContext, useState, useEffect, useContext } from 'react';

// // Create the Cart Context
// export const CartContext = createContext();

// // Cart Provider component to wrap the app
// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     try {
//       const savedCart = localStorage.getItem('cart');
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         setCartItems(parsedCart);
//         updateCartCount(parsedCart);
//       }
//     } catch (error) {
//       console.error('Error loading cart from localStorage:', error);
//     }
//   }, []);

//   // Save cart to localStorage whenever cart items change
//   useEffect(() => {
//     try {
//       localStorage.setItem('cart', JSON.stringify(cartItems));
//       updateCartCount(cartItems);
//     } catch (error) {
//       console.error('Error saving cart to localStorage:', error);
//     }
//   }, [cartItems]);

//   // Update cart count
//   const updateCartCount = (items) => {
//     const count = items.reduce((total, item) => total + item.quantity, 0);
//     setCartCount(count);
//   };

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.id === product.id);
      
//       if (existingItem) {
//         // If item already exists, increase quantity
//         return prevItems.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // If new item, add to cart
//         return [...prevItems, { ...product, quantity }];
//       }
//     });
//   };

//   // Remove item from cart
//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//   };

//   // Update item quantity
//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.id === productId
//           ? { ...item, quantity: newQuantity }
//           : item
//       )
//     );
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Get cart total
//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   // Check if item is in cart
//   const isInCart = (productId) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   // Get item quantity in cart
//   const getItemQuantity = (productId) => {
//     const item = cartItems.find(item => item.id === productId);
//     return item ? item.quantity : 0;
//   };

//   const value = {
//     cartItems,
//     cartCount,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     isInCart,
//     getItemQuantity
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// // Custom hook to use cart context
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
