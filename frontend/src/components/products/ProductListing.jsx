import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import { useSavedItems } from '../contexts/SavedItemsContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleSave, isSaved } = useSavedItems();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Show success message
    const button = document.getElementById(`cart-btn-${product.id}`);
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Added!';
      button.classList.remove('btn-primary');
      button.classList.add('btn-success');
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
      }, 1500);
    }
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading amazing products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
          <br />
          <button className="btn btn-primary mt-3" onClick={fetchProducts}>
            <i className="bi bi-arrow-clockwise me-2"></i>Try Again
          </button>
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
              <i className="bi bi-shop me-2"></i>
              Shop All Products
            </h1>
            <Link to="/" className="btn btn-outline-secondary">
              <i className="bi bi-house me-2"></i>
              Back to Home
            </Link>
          </div>
          <p className="text-muted">Discover our amazing collection of products</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Count */}
      <div className="row mb-3">
        <div className="col-12">
          <p className="text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-search display-1 text-muted"></i>
          <h3 className="mt-3">No products found</h3>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    style={{
                      height: '250px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x250?text=Product+Image';
                    }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate" title={product.title}>
                    {product.title}
                  </h5>
                  <p className="card-text text-muted small flex-grow-1">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="h5 text-primary mb-0">
                      ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                    </span>
                    {product.rating && (
                      <div className="text-warning">
                        <i className="bi bi-star-fill"></i>
                        <small className="text-muted ms-1">
                          {product.rating.rate} ({product.rating.count})
                        </small>
                      </div>
                    )}
                  </div>
                  
                  <div className="d-grid gap-2">
                    <div className="btn-group">
                      <Link 
                        to={`/product/${product.id}`} 
                        className="btn btn-outline-primary"
                      >
                        <i className="bi bi-eye me-2"></i>
                        View Details
                      </Link>
                      <button
                        className={`btn ${isSaved(product.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
                        onClick={() => toggleSave(product)}
                        title={isSaved(product.id) ? 'Remove from Saved' : 'Save for Later'}
                      >
                        <i className={`bi ${isSaved(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      </button>
                    </div>
                    <button
                      id={`cart-btn-${product.id}`}
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {isInCart(product.id) ? `In Cart (${getItemQuantity(product.id)})` : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductListing;
