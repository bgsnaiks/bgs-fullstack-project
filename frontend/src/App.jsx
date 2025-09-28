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
import Sample from './components/Sample/Sample.jsx';
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

// ... import other components

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
            <Route path="/sample" element={
              <ProtectedRoute>
                <Sample />
              </ProtectedRoute>
            } />
            
            <Route path="/saved-items" element={
              <ProtectedRoute>
                <SavedItemsPage />
              </ProtectedRoute>
            } />
            
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






// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/headermenu/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Cards from './components/cards/Cards';

// function Page({ title }) {
//   return (
//     <div className="container mt-4">
//       <h2>{title}</h2>
//       <Cards />
//     </div>
//   );
// }

// function App() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/menu')
//       .then(res => res.json())
//       .then(setMenu)
//       .catch(console.error);
//   }, []);

//   const renderRoutes = (items) => {
//     return items.flatMap(item => [
//       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
//       ...(item.children ? renderRoutes(item.children) : [])
//     ]);
//   };

//   return (
//     <Router>
//       <Header menu={menu} />
//       <Routes>
//         {/* Default Home Route */}
//         <Route path="/" element={<Page title="Home" />} />

//         {/* Dynamic Routes from Menu */}
//         {renderRoutes(menu)}

//         {/* Optional: Redirect unknown paths to Home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/headermenu/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Cards from './components/cards/Cards';

// function Page({ title }) {
//   return (
//     <div className="container mt-4">
//       <h2>{title}</h2>
//       {/* <Cards /> */}
//     </div>
//   );
// }

// function App() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/menu')
//       .then(res => res.json())
//       .then(setMenu)
//       .catch(console.error);
//   }, []);

//   const renderRoutes = (items) => {
//     return items.flatMap(item => [
//       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
//       ...(item.children ? renderRoutes(item.children) : [])
//     ]);
//   };

//   return (
//     <Router>
//       <Header menu={menu} />
//       <Routes>
//         {/* Default Home Route */}
//         <Route path="/" element={<Page title="Home" />} />
// <Route path="/cards" element={<Page title="Cards" />} />
//         {/* Dynamic Routes from Menu */}
//         {renderRoutes(menu)}

//         {/* Optional: Redirect unknown paths to Home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// ============================================ working 
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/headermenu/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Cards from './components/cards/Cards';

// function Page({ title }) {
//   return <div className="container mt-4"><h2>{title}</h2>
//   <Cards></Cards>
//   </div>;
// }

// function App() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/menu')
//       .then(res => res.json())
//       .then(setMenu)
//       .catch(console.error);
//   }, []);

//   const renderRoutes = (items) => {
//     return items.flatMap(item => [
//       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
//       ...(item.children ? renderRoutes(item.children) : [])
//     ]);
//   };

//   return (
//     <>
//     <Router>
//       <Header menu={menu} />
//       <Routes>
//         {renderRoutes(menu)}
//       </Routes>
//     </Router>
//     {/* <Cards></Cards> */}
//     </>
//   );
// }

// export default App;




// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Header from './components/headermenu/Header';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import Home from './components/home/Home';
// import Cards from './components/cards/Cards';
// import Shop from './components/Shop/Shop';
// import Profile from './components/Profile/Profile';
// import Cart from './components/Cart/Cart';
// import Sample from './components/Sample/Sample';

// // ... import other components

// function App() {
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:3001/api/menu')
//       .then(res => res.json())
//       .then(setMenu)
//       .catch(console.error);
//   }, []);

//   return (
//     <Router>
//       <Header menu={menu} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/cards" element={<Cards />} />
//         <Route path="/shop" element={<Shop />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/sample" element={<Sample />} />
//         {/* Add more routes as needed */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// // import React, { useEffect, useState } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import Header from './components/headermenu/Header';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Cards from './components/cards/Cards';

// // function Page({ title }) {
// //   return (
// //     <div className="container mt-4">
// //       <h2>{title}</h2>
// //       <Cards />
// //     </div>
// //   );
// // }

// // function App() {
// //   const [menu, setMenu] = useState([]);

// //   useEffect(() => {
// //     fetch('http://localhost:3001/api/menu')
// //       .then(res => res.json())
// //       .then(setMenu)
// //       .catch(console.error);
// //   }, []);

// //   const renderRoutes = (items) => {
// //     return items.flatMap(item => [
// //       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
// //       ...(item.children ? renderRoutes(item.children) : [])
// //     ]);
// //   };

// //   return (
// //     <Router>
// //       <Header menu={menu} />
// //       <Routes>
// //         {/* Default Home Route */}
// //         <Route path="/" element={<Page title="Home" />} />

// //         {/* Dynamic Routes from Menu */}
// //         {renderRoutes(menu)}

// //         {/* Optional: Redirect unknown paths to Home */}
// //         <Route path="*" element={<Navigate to="/" />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;

// // import React, { useEffect, useState } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import Header from './components/headermenu/Header';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Cards from './components/cards/Cards';

// // function Page({ title }) {
// //   return (
// //     <div className="container mt-4">
// //       <h2>{title}</h2>
// //       {/* <Cards /> */}
// //     </div>
// //   );
// // }

// // function App() {
// //   const [menu, setMenu] = useState([]);

// //   useEffect(() => {
// //     fetch('http://localhost:3001/api/menu')
// //       .then(res => res.json())
// //       .then(setMenu)
// //       .catch(console.error);
// //   }, []);

// //   const renderRoutes = (items) => {
// //     return items.flatMap(item => [
// //       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
// //       ...(item.children ? renderRoutes(item.children) : [])
// //     ]);
// //   };

// //   return (
// //     <Router>
// //       <Header menu={menu} />
// //       <Routes>
// //         {/* Default Home Route */}
// //         <Route path="/" element={<Page title="Home" />} />
// // <Route path="/cards" element={<Page title="Cards" />} />
// //         {/* Dynamic Routes from Menu */}
// //         {renderRoutes(menu)}

// //         {/* Optional: Redirect unknown paths to Home */}
// //         <Route path="*" element={<Navigate to="/" />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;


// // ============================================ working 
// // import React, { useEffect, useState } from 'react';
// // import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import Header from './components/headermenu/Header';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import Cards from './components/cards/Cards';

// // function Page({ title }) {
// //   return <div className="container mt-4"><h2>{title}</h2>
// //   <Cards></Cards>
// //   </div>;
// // }

// // function App() {
// //   const [menu, setMenu] = useState([]);

// //   useEffect(() => {
// //     fetch('http://localhost:3001/api/menu')
// //       .then(res => res.json())
// //       .then(setMenu)
// //       .catch(console.error);
// //   }, []);

// //   const renderRoutes = (items) => {
// //     return items.flatMap(item => [
// //       <Route key={item.path} path={item.path} element={<Page title={item.label} />} />,
// //       ...(item.children ? renderRoutes(item.children) : [])
// //     ]);
// //   };

// //   return (
// //     <>
// //     <Router>
// //       <Header menu={menu} />
// //       <Routes>
// //         {renderRoutes(menu)}
// //       </Routes>
// //     </Router>
// //     {/* <Cards></Cards> */}
// //     </>
// //   );
// // }

// // export default App;



// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
