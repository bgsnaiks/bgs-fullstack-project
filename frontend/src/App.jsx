import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/headermenu/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './components/home/Home.jsx';
import Cards from './components/cards/Cards.jsx';
import Shop from './components/Shop/Shop.jsx';
import Profile from './components/Profile/Profile.jsx';
import UserProfile from './components/Profile/UserProfile.jsx';
import Cart from './components/Cart/Cart.jsx';
import CartPage from './components/Cart/CartPage.jsx';
// import Sample from './components/Sample/Sample.jsx';
import ProductManager from './components/products/ProductManager.jsx';
import ProductListing from './components/products/ProductListing.jsx';
import ProductDetail from './components/products/ProductDetail.jsx';
import SavedItemsPage from './components/SavedItems/SavedItemsPage.jsx';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import { AuthProvider } from './components/contexts/AuthContext.jsx';
import { CartProvider } from './components/contexts/CartContext.jsx';
import { SavedItemsProvider } from './components/contexts/SavedItemsContext.jsx';
import Shipping from './components/Payment/Shipping.jsx';
import Payment from './components/Payment/Payment.jsx';
import ContactUs from './components/pages/ContactUs.jsx';
import AboutUs from './components/pages/AboutUs.jsx';

function App() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/menu')
      .then(res => res.json())
      .then(setMenu)
      .catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <SavedItemsProvider>
          <Router>
          <Header menu={menu} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/cards" element={
              <ProtectedRoute>
                <Cards />
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute>
                <ProductListing />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <ProductManager />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            {/* <Route path="/sample" element={
              <ProtectedRoute>
                <Sample />
              </ProtectedRoute>
            } /> */}
            
            <Route path="/saved-items" element={
              <ProtectedRoute>
                <SavedItemsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
        </SavedItemsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
