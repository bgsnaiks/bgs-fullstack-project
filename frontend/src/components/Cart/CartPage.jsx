import React from 'react';
import { Link } from 'react-router-dom';
// import { useCart } from '../../contexts/CartContext';
import { useCart } from '../contexts/CartContext.jsx';
// import { useSavedItems } from '../../contexts/SavedItemsContext';  
import { useSavedItems } from '../contexts/SavedItemsContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function CartPage() {
  const { 
    cartItems, 
    cartCount, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const { addToSaved } = useSavedItems();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleRemoveItem = (productId, productTitle) => {
    if (window.confirm(`Are you sure you want to remove "${productTitle}" from your cart?`)) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleSaveForLater = (item) => {
    addToSaved(item);
    removeFromCart(item.id);
    
    // Show success message
    const notification = document.createElement('div');
    notification.className = 'alert alert-success alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
    notification.innerHTML = `
      <i class="bi bi-heart-fill me-2"></i>
      "${item.title.substring(0, 30)}..." saved for later!
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    // Auto remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-5">
                <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                <h2 className="h4 mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/shop" className="btn btn-primary">
                    <i className="bi bi-shop me-2"></i>
                    Start Shopping
                  </Link>
                  <Link to="/" className="btn btn-outline-secondary">
                    <i className="bi bi-house me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h2 mb-0">
              <i className="bi bi-cart me-2"></i>
              Shopping Cart
              <span className="badge bg-primary ms-2">{cartCount}</span>
            </h1>
            <div className="d-flex gap-2">
              <Link to="/shop" className="btn btn-outline-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Continue Shopping
              </Link>
              <Link to="/" className="btn btn-outline-secondary">
                <i className="bi bi-house me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
          <p className="text-muted">Review your items and proceed to checkout</p>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cart Items</h5>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleClearCart}
              >
                <i className="bi bi-trash me-2"></i>
                Clear Cart
              </button>
            </div>
            <div className="card-body p-0">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-3 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{
                          height: '80px',
                          width: '80px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                        }}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">{item.category}</small>
                      <br />
                      <Link 
                        to={`/product/${item.id}`} 
                        className="text-decoration-none small"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
                    </div>
                    
                    <div className="col-md-2">
                      <label className="form-label small">Quantity</label>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          min="1"
                          max="99"
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-2 text-center">
                      <div className="small text-muted">Price</div>
                      <div className="fw-bold">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</div>
                    </div>
                    
                    <div className="col-md-2 text-center">
                      <div className="small text-muted">Total</div>
                      <div className="fw-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="mt-1">
                        <button
                          className="btn btn-link btn-sm text-warning p-0 me-2"
                          onClick={() => handleSaveForLater(item)}
                          title="Save for Later"
                        >
                          <i className="bi bi-heart"></i>
                        </button>
                        <button
                          className="btn btn-link btn-sm text-danger p-0"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          title="Remove from Cart"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cartCount}):</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">
                  ${(getCartTotal() + (getCartTotal() * 0.08)).toFixed(2)}
                </strong>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg">
                  <i className="bi bi-credit-card me-2"></i>
                  Proceed to Checkout
                </button>
                <Link to="/saved-items" className="btn btn-outline-secondary">
                  <i className="bi bi-heart me-2"></i>
                  View Saved Items
                </Link>
              </div>
              
              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Secure checkout guaranteed
                </small>
              </div>
            </div>
          </div>
          
          {/* Promo Code */}
          <div className="card border-0 shadow-sm mt-3">
            <div className="card-body">
              <h6 className="card-title">Have a promo code?</h6>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter promo code"
                />
                <button className="btn btn-outline-primary" type="button">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
