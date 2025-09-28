import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../contexts/AuthContext';
import { AuthContext } from '../contexts/AuthContext.jsx';
// import Cards from '../cards/Cards';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  // Inline styles for enhanced banner appearance
  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '60vh'
  };

  const featureCardStyle = {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const handleFeatureHover = (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
  };

  const handleFeatureLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  };

  // Handle protected navigation - redirect to login if not authenticated
  const handleProtectedNavigation = (path) => {
    return (e) => {
      if (!isAuthenticated()) {
        e.preventDefault();
        navigate('/login');
      } else {
        navigate(path);
      }
    };
  };

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-banner text-white position-relative overflow-hidden" style={heroStyle}>
        <div className="container position-relative py-5">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold mb-3 text-white">
                  Welcome to BGS NAIK Store
                </h1>
                <p className="lead mb-4 text-white-50">
                  Discover amazing products at unbeatable prices. Shop the latest trends in electronics, fashion, and lifestyle products.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <button 
                    onClick={handleProtectedNavigation('/shop')}
                    className="btn btn-light btn-lg px-4 py-2"
                  >
                    <i className="bi bi-bag me-2"></i>
                    Shop Now
                  </button>
                  <button 
                    onClick={handleProtectedNavigation('/shop')}
                    className="btn btn-outline-light btn-lg px-4 py-2"
                  >
                    <i className="bi bi-grid me-2"></i>
                    Browse Categories
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                <img 
                  src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop&crop=center" 
                  alt="Shopping Experience" 
                  className="img-fluid rounded shadow-lg"
                  style={{maxHeight: '400px', objectFit: 'cover'}}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div 
                className="feature-card h-100 p-4 text-center bg-white rounded shadow-sm border"
                style={featureCardStyle}
                onMouseEnter={handleFeatureHover}
                onMouseLeave={handleFeatureLeave}
              >
                <div className="feature-icon mb-3">
                  <i className="bi bi-truck display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold">Fast Delivery</h5>
                <p className="text-muted">Free shipping on orders over $50. Get your products delivered quickly and safely.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div 
                className="feature-card h-100 p-4 text-center bg-white rounded shadow-sm border"
                style={featureCardStyle}
                onMouseEnter={handleFeatureHover}
                onMouseLeave={handleFeatureLeave}
              >
                <div className="feature-icon mb-3">
                  <i className="bi bi-shield-check display-4 text-success"></i>
                </div>
                <h5 className="fw-bold">Secure Shopping</h5>
                <p className="text-muted">Your data is protected with industry-standard encryption and security measures.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div 
                className="feature-card h-100 p-4 text-center bg-white rounded shadow-sm border"
                style={featureCardStyle}
                onMouseEnter={handleFeatureHover}
                onMouseLeave={handleFeatureLeave}
              >
                <div className="feature-icon mb-3">
                  <i className="bi bi-headset display-4 text-info"></i>
                </div>
                <h5 className="fw-bold">24/7 Support</h5>
                <p className="text-muted">Our customer service team is here to help you anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Carousel Section */}
      <section className="product-carousel py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="display-6 fw-bold mb-3">Featured Products</h2>
              <p className="lead text-muted">Check out our most popular items</p>
            </div>
          </div>
          
          <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner rounded">
              <div className="carousel-item active">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=500&fit=crop&crop=center"
                    className="d-block w-100"
                    alt="Electronics Collection"
                    style={{height: '500px', objectFit: 'cover'}}
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                    <h3 className="fw-bold">Latest Electronics</h3>
                    <p>Discover cutting-edge technology and gadgets</p>
                    <button onClick={handleProtectedNavigation('/products')} className="btn btn-primary">
                      Shop Electronics
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop&crop=center"
                    className="d-block w-100"
                    alt="Fashion Collection"
                    style={{height: '500px', objectFit: 'cover'}}
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                    <h3 className="fw-bold">Fashion Trends</h3>
                    <p>Stay stylish with our latest fashion collection</p>
                    <Link to="/products" className="btn btn-primary">Shop Fashion</Link>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=1200&h=500&fit=crop&crop=center"
                    className="d-block w-100"
                    alt="Home & Living"
                    style={{height: '500px', objectFit: 'cover'}}
                  />
                  <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                    <h3 className="fw-bold">Home & Living</h3>
                    <p>Transform your space with our home collection</p>
                    <Link to="/products" className="btn btn-primary">Shop Home</Link>
                  </div>
                </div>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Ready to Start Shopping?</h2>
              <p className="lead mb-0">Join thousands of satisfied customers and discover amazing deals today.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <button 
                onClick={handleProtectedNavigation('/shop')} 
                className="btn btn-primary btn-lg px-4 py-2"
              >
                <i className="bi bi-cart-plus me-2"></i>
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* <Cards /> */}
    </div>
  );
}

export default Home;
