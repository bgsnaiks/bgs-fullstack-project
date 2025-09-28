import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { useSavedItems } from '../contexts/SavedItemsContext.jsx';
import logo from '../../logo_new.png';
import './Header.css';
console.log('logo.......', logo);
function Header({ menu }) {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { cartCount } = useCart();
  const { savedCount } = useSavedItems();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand fw-bold" to="/">
        {/* <i className="bi bi-shop me-2"></i> */}
        <img 
                  src={logo} 
                  alt="logo" 
                  className="store_logo-img"
                />
        BGS NAIK STORE
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {menu.map(item => (
            <li className="nav-item dropdown" key={item.label}>
              {item.children ? (
                <>
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    {item.label}
                  </a>
                  <ul className="dropdown-menu">
                    {item.children.map(child => (
                      <li key={child.label}>
                        <Link className="dropdown-item" to={child.path}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link className="nav-link" to={item.path}>{item.label}</Link>
              )}
            </li>
          ))}
        </ul>
        
        {/* Cart and Authentication buttons */}
        <ul className="navbar-nav">
          {isAuthenticated() && (
            <>
              <li className="nav-item">
                <Link className="nav-link position-relative me-3" to="/cart">
                  <i className="bi bi-cart3"></i>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link position-relative me-3" to="/saved-items">
                  <i className="bi bi-heart"></i>
                  {savedCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                      {savedCount}
                      <span className="visually-hidden">saved items</span>
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}
          {isAuthenticated() ? (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>
                Welcome, {user?.firstName || 'User'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>Profile
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary btn-sm ms-2" to="/signup">
                  <i className="bi bi-person-plus me-1"></i>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
