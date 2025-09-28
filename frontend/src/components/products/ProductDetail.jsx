import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext.jsx';
import { useSavedItems } from '../contexts/SavedItemsContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleSave, isSaved } = useSavedItems();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      const foundProduct = response.data.find(p => p.id.toString() === id.toString());
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Show success notification
      const button = document.getElementById('add-to-cart-btn');
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Added to Cart!';
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove('btn-success');
          button.classList.add('btn-primary');
        }, 2000);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error || 'Product not found'}
              <br />
              <div className="mt-3">
                <Link to="/shop" className="btn btn-primary me-2">
                  <i className="bi bi-shop me-2"></i>Browse Products
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="bi bi-house me-2"></i>Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create image gallery (for demo, we'll use the same image multiple times)
  const images = [
    product.image,
    product.image,
    product.image
  ];

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/shop" className="text-decoration-none">Shop</Link>
          </li>
          <li className="breadcrumb-item">
            <span className="text-capitalize">{product.category}</span>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title.substring(0, 30)}...
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-2">
              {/* Main Image */}
              <div className="mb-3">
                <img
                  src={images[activeImageIndex]}
                  alt={product.title}
                  className="img-fluid rounded"
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                  }}
                />
              </div>
              
              {/* Image Thumbnails */}
              <div className="d-flex gap-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className={`img-thumbnail cursor-pointer ${activeImageIndex === index ? 'border-primary' : ''}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveImageIndex(index)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=Img';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              {/* Product Title and Category */}
              <div className="mb-3">
                <span className="badge bg-primary mb-2 text-capitalize">{product.category}</span>
                <h1 className="h3 mb-0">{product.title}</h1>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="text-warning me-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`bi ${i < Math.floor(product.rating.rate) ? 'bi-star-fill' : 'bi-star'}`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-muted">
                      {product.rating.rate} ({product.rating.count} reviews)
                    </span>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="h2 text-primary mb-0">
                  ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                </span>
                <span className="text-muted ms-2">
                  <del>${(product.price * 1.2).toFixed(2)}</del>
                </span>
                <span className="badge bg-success ms-2">Save 20%</span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5>Description</h5>
                <p className="text-muted">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="form-label fw-bold">Quantity</label>
                <div className="input-group" style={{ maxWidth: '150px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={quantity}
                    min="1"
                    max="10"
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <small className="text-muted">Maximum 10 items per order</small>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 mb-4">
                <button
                  id="add-to-cart-btn"
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {isInCart(product.id) 
                    ? `Update Cart (${getItemQuantity(product.id)} in cart)` 
                    : 'Add to Cart'
                  }
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleBuyNow}
                >
                  <i className="bi bi-lightning me-2"></i>
                  Buy Now
                </button>
                <div className="row">
                  <div className="col-6">
                    <button 
                      className={`btn w-100 ${isSaved(product.id) ? 'btn-warning' : 'btn-outline-secondary'}`}
                      onClick={() => toggleSave(product)}
                    >
                      <i className={`bi ${isSaved(product.id) ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                      {isSaved(product.id) ? 'Saved' : 'Save for Later'}
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100">
                      <i className="bi bi-share me-2"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-top pt-3">
                <div className="row text-center">
                  <div className="col-4">
                    <i className="bi bi-truck text-success h5"></i>
                    <div className="small">Free Shipping</div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-arrow-return-left text-info h5"></i>
                    <div className="small">Easy Returns</div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-shield-check text-warning h5"></i>
                    <div className="small">Warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <Link to="/shop" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Shop
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              <i className="bi bi-house me-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
