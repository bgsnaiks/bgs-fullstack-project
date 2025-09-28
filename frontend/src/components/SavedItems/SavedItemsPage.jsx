import React from 'react';
import { Link } from 'react-router-dom';
// import { useSavedItems } from '../../contexts/SavedItemsContext';
import { useSavedItems } from '../contexts/SavedItemsContext.jsx';
// import { useCart } from '../../contexts/CartContext';
import { useCart } from '../contexts/CartContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function SavedItemsPage() {
  const { 
    savedItems, 
    savedCount, 
    removeFromSaved, 
    clearSavedItems, 
    moveToCart 
  } = useSavedItems();
  
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    const success = moveToCart(item.id, addToCart);
    if (success) {
      // Show success message
      const button = document.getElementById(`move-btn-${item.id}`);
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Moved to Cart!';
        button.classList.remove('btn-success');
        button.classList.add('btn-info');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('btn-info');
          button.classList.add('btn-success');
        }, 2000);
      }
    }
  };

  const handleRemoveItem = (itemId, itemTitle) => {
    if (window.confirm(`Are you sure you want to remove "${itemTitle}" from your saved items?`)) {
      removeFromSaved(itemId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved items?')) {
      clearSavedItems();
    }
  };

  if (savedItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-5">
                <i className="bi bi-heart display-1 text-muted mb-3"></i>
                <h2 className="h4 mb-3">No Saved Items</h2>
                <p className="text-muted mb-4">
                  You haven't saved any products yet. Browse our collection and save items you love!
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/shop" className="btn btn-primary">
                    <i className="bi bi-shop me-2"></i>
                    Browse Products
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
              <i className="bi bi-heart me-2"></i>
              Saved for Later
              <span className="badge bg-secondary ms-2">{savedCount}</span>
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
          <p className="text-muted">Items you've saved for future purchase</p>
        </div>
      </div>

      {/* Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-muted">
                {savedCount} item{savedCount !== 1 ? 's' : ''} saved
              </span>
            </div>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleClearAll}
            >
              <i className="bi bi-trash me-2"></i>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Saved Items Grid */}
      <div className="row">
        {savedItems.map((item) => (
          <div key={item.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="position-relative">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.title}
                  style={{
                    height: '250px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x250?text=Product+Image';
                  }}
                />
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-primary text-capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="position-absolute top-0 start-0 p-2">
                  <small className="badge bg-success">
                    <i className="bi bi-heart-fill me-1"></i>
                    Saved
                  </small>
                </div>
              </div>
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate" title={item.title}>
                  {item.title}
                </h5>
                <p className="card-text text-muted small flex-grow-1">
                  {item.description.length > 100 
                    ? `${item.description.substring(0, 100)}...` 
                    : item.description
                  }
                </p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="h5 text-primary mb-0">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </span>
                  {item.rating && (
                    <div className="text-warning">
                      <i className="bi bi-star-fill"></i>
                      <small className="text-muted ms-1">
                        {item.rating.rate}
                      </small>
                    </div>
                  )}
                </div>

                {/* Saved date */}
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </small>
                </div>
                
                <div className="d-grid gap-2">
                  <button
                    id={`move-btn-${item.id}`}
                    className="btn btn-success"
                    onClick={() => handleMoveToCart(item)}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Move to Cart
                  </button>
                  
                  <div className="btn-group">
                    <Link 
                      to={`/product/${item.id}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Details
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleRemoveItem(item.id, item.title)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-2">Move All to Cart</h5>
                  <p className="text-muted mb-0">
                    Quickly add all your saved items to your shopping cart.
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      savedItems.forEach(item => handleMoveToCart(item));
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Move All to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <Link to="/shop" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
            <Link to="/cart" className="btn btn-outline-success">
              <i className="bi bi-cart me-2"></i>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedItemsPage;
