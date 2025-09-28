import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    description: '', 
    price: '', 
    category: '', 
    image: '',
    brand: '',
    stock: ''
  });
  const [editProductData, setEditProductData] = useState({ 
    id: null, 
    title: '', 
    description: '', 
    price: '', 
    category: '', 
    image: '',
    brand: '',
    stock: ''
  });
  const [nextId, setNextId] = useState(1000); // Start with ID 1000 for new products
  const [showEditModal, setShowEditModal] = useState(false); // React state for modal visibility
  const [showAddModal, setShowAddModal] = useState(false); // React state for add product modal

  // Predefined categories for dropdown
  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Toys',
    'Beauty',
    'Automotive',
    'Food',
    'Custom'
  ];

  // Fetch products on mount
  useEffect(() => {
    console.log('Fetching products...');
    axios.get('/api/products')
      .then(res => {
        console.log('Products fetched:', res.data);
        // Set the next ID to be higher than the highest existing ID
        const maxId = Math.max(...res.data.map(p => p.id || 0));
        setNextId(maxId + 1);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        console.error('Error details:', err.response?.data || err.message);
      });
  }, []);

  // Check Bootstrap availability on mount
  useEffect(() => {
    console.log('Checking Bootstrap availability...');
    console.log('window.bootstrap:', window.bootstrap);
    console.log('window.bootstrap.Modal:', window.bootstrap?.Modal);
    
    // Wait a bit for Bootstrap to load if not immediately available
    if (!window.bootstrap) {
      setTimeout(() => {
        console.log('After timeout - window.bootstrap:', window.bootstrap);
        console.log('After timeout - window.bootstrap.Modal:', window.bootstrap?.Modal);
      }, 1000);
    }
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    console.log('Adding product:', newProduct);
    
    // Create a new product with a unique ID
    const productToAdd = {
      id: nextId,
      title: newProduct.title,
      description: newProduct.description,
      price: parseFloat(newProduct.price) || 0,
      category: newProduct.category || 'Custom',
      image: newProduct.image || 'https://via.placeholder.com/300x200?text=No+Image',
      brand: newProduct.brand || 'Generic',
      stock: parseInt(newProduct.stock) || 0,
      createdAt: new Date().toISOString(),
      rating: { rate: 0, count: 0 } // Initialize rating
    };
    
    try {
      // Try to add to server (though FakeStoreAPI won't persist it)
      const res = await axios.post('/api/products', productToAdd);
      console.log('Server response:', res.data);
      
      // Add to local state (this will work regardless of server response)
      setProducts([...products, productToAdd]);
      setNextId(nextId + 1);
      setNewProduct({ 
        title: '', 
        description: '', 
        price: '', 
        category: '', 
        image: '',
        brand: '',
        stock: ''
      });
      // Close the add modal
      setShowAddModal(false);
      console.log('Product added locally:', productToAdd);
    } catch (err) {
      console.error('Add Error:', err);
      // Even if server fails, add locally
      setProducts([...products, productToAdd]);
      setNextId(nextId + 1);
      setNewProduct({ 
        title: '', 
        description: '', 
        price: '', 
        category: '', 
        image: '',
        brand: '',
        stock: ''
      });
      // Close the add modal
      setShowAddModal(false);
      console.log('Product added locally after server error:', productToAdd);
    }
  };

  const handleDeleteProduct = async (id) => {
    console.log('Deleting product with ID:', id);
    try {
      // Try to delete from server
      await axios.delete(`/api/products/${id}`);
      console.log('Server delete successful');
      
      // Remove from local state
      setProducts(products.filter(p => p.id !== id));
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Delete Error:', err);
      // Even if server fails, remove locally
      setProducts(products.filter(p => p.id !== id));
      console.log('Product deleted locally after server error');
    }
  };

  const handleEditProduct = (product) => {
    console.log('Edit button clicked for product:', product);
    
    // Set the edit data
    setEditProductData({ 
      id: product.id, 
      title: product.title || '', 
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      image: product.image || '',
      brand: product.brand || '',
      stock: product.stock || ''
    });
    
    console.log('Edit data set:', { id: product.id, title: product.title, description: product.description });
    
    // Show modal using React state
    setShowEditModal(true);
    console.log('Modal shown using React state');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    console.log('Updating product:', editProductData);
    
    const updatedProduct = {
      ...products.find(p => p.id === editProductData.id), // Keep existing fields
      id: editProductData.id,
      title: editProductData.title,
      description: editProductData.description,
      price: parseFloat(editProductData.price) || 0,
      category: editProductData.category,
      image: editProductData.image,
      brand: editProductData.brand,
      stock: parseInt(editProductData.stock) || 0,
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Try to update on server
      const res = await axios.put(`/api/products/${editProductData.id}`, {
        title: editProductData.title,
        description: editProductData.description
      });
      console.log('Server update response:', res.data);
      
      // Update local state (this ensures UI is updated)
      setProducts(products.map(p => p.id === editProductData.id ? updatedProduct : p));
      
      // Close modal using React state
      setShowEditModal(false);
      console.log('Product updated successfully');
    } catch (err) {
      console.error('Update Error:', err);
      // Even if server fails, update locally
      setProducts(products.map(p => p.id === editProductData.id ? updatedProduct : p));
      
      // Close modal using React state
      setShowEditModal(false);
      console.log('Product updated locally after server error');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Product Manager</h2>
        <div className="d-flex gap-2">
          <span className="badge bg-secondary">Total: {products.length}</span>
          <span className="badge bg-success">
            In Stock: {products.filter(p => (p.stock || 0) > 0).length}
          </span>
        </div>
      </div>
      
      {/* Sample Images for Testing */}
      <div className="alert alert-info mb-4">
        <h6>📸 Sample Test Images (Copy & Paste):</h6>
        <div className="row g-2 text-small">
          <div className="col-md-6">
            <small>Electronics: <code>https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300</code></small>
          </div>
          <div className="col-md-6">
            <small>Clothing: <code>https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300</code></small>
          </div>
          <div className="col-md-6">
            <small>Books: <code>https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300</code></small>
          </div>
          <div className="col-md-6">
            <small>Sports: <code>https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300</code></small>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <button 
          className="btn btn-primary" 
          onClick={() => {
            console.log('Add New Product button clicked');
            setShowAddModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Add New Product
        </button>
        
        <button 
          className="btn btn-success" 
          onClick={() => {
            // Add a sample product for testing
            const sampleProduct = {
              id: Date.now(),
              title: 'Sample Wireless Headphones',
              description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
              price: 99.99,
              category: 'Electronics',
              image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300',
              brand: 'AudioTech',
              stock: 15,
              createdAt: new Date().toISOString(),
              rating: { rate: 4.5, count: 128 }
            };
            setProducts([...products, sampleProduct]);
            console.log('Sample product added:', sampleProduct);
          }}
        >
          <i className="bi bi-magic me-2"></i>Add Sample Product
        </button>
        
        <button 
          className="btn btn-info" 
          onClick={() => {
            console.log('Test modal button clicked');
            setEditProductData({ 
              id: 999, 
              title: 'Test Product', 
              description: 'Test Description for debugging modal functionality',
              price: '29.99',
              category: 'Electronics',
              image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300',
              brand: 'TestBrand',
              stock: '10'
            });
            setShowEditModal(true);
            console.log('Test modal opened using React state');
          }}
        >
          <i className="bi bi-tools me-2"></i>Test Edit Modal
        </button>
      </div>


      {/* Product Cards */}
      <div className="row g-3">
        {products.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info">
              <h5>No products found</h5>
              <p>Start by adding your first product using the form above!</p>
            </div>
          </div>
        ) : (
          products.map((product) => (
            <div className="col-lg-4 col-md-6" key={product.id}>
              <div className="card h-100 shadow-sm">
                {/* Product Image */}
                <div className="position-relative">
                  <img 
                    src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    className="card-img-top" 
                    alt={product.title}
                    style={{height: '200px', objectFit: 'cover'}}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                    }}
                  />
                  {/* Price Badge */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-success fs-6">${product.price || '0.00'}</span>
                  </div>
                  {/* Stock Badge */}
                  {product.stock !== undefined && (
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className={`badge ${product.stock > 0 ? 'bg-primary' : 'bg-danger'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="card-body d-flex flex-column">
                  {/* Title and Brand */}
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0 flex-grow-1">{product.title}</h5>
                    {product.brand && (
                      <small className="text-muted ms-2">{product.brand}</small>
                    )}
                  </div>
                  
                  {/* Category */}
                  {product.category && (
                    <div className="mb-2">
                      <span className="badge bg-secondary">{product.category}</span>
                    </div>
                  )}
                  
                  {/* Description */}
                  <p className="card-text flex-grow-1 text-muted">
                    {product.description?.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </p>
                  
                  {/* Rating (if available) */}
                  {product.rating && (
                    <div className="mb-2">
                      <small className="text-muted">
                        ⭐ {product.rating.rate || 0}/5 ({product.rating.count || 0} reviews)
                      </small>
                    </div>
                  )}
                  
                  {/* Timestamps */}
                  <div className="mb-2">
                    {product.createdAt && (
                      <small className="text-muted d-block">
                        Added: {new Date(product.createdAt).toLocaleDateString()}
                      </small>
                    )}
                    {product.updatedAt && (
                      <small className="text-muted d-block">
                        Updated: {new Date(product.updatedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-auto d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm flex-fill" 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Edit button clicked - event:', e);
                        handleEditProduct(product);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm flex-fill" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
                          handleDeleteProduct(product.id);
                        }
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleSaveEdit}>
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Row 1 */}
                  <div className="col-md-6">
                    <label className="form-label">Product Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Product Title"
                      value={editProductData.title}
                      onChange={(e) => setEditProductData({ ...editProductData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Brand Name"
                      value={editProductData.brand}
                      onChange={(e) => setEditProductData({ ...editProductData, brand: e.target.value })}
                    />
                  </div>
                  
                  {/* Row 2 */}
                  <div className="col-md-4">
                    <label className="form-label">Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        placeholder="0.00"
                        value={editProductData.price}
                        onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={editProductData.category}
                      onChange={(e) => setEditProductData({ ...editProductData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="0"
                      value={editProductData.stock}
                      onChange={(e) => setEditProductData({ ...editProductData, stock: e.target.value })}
                    />
                  </div>
                  
                  {/* Row 3 */}
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Product Description"
                      value={editProductData.description}
                      onChange={(e) => setEditProductData({ ...editProductData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  
                  {/* Row 4 */}
                  <div className="col-12">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={editProductData.image}
                      onChange={(e) => setEditProductData({ ...editProductData, image: e.target.value })}
                    />
                    {editProductData.image && (
                      <div className="mt-2">
                        <img 
                          src={editProductData.image} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{maxHeight: '100px', maxWidth: '100px'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle me-1"></i>Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleAddProduct}>
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>Add New Product
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {/* Row 1 */}
                  <div className="col-md-6">
                    <label className="form-label">Product Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product title"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter brand name"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                  </div>
                  
                  {/* Row 2 */}
                  <div className="col-md-4">
                    <label className="form-label">Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                  
                  {/* Row 3 */}
                  <div className="col-12">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter detailed product description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  
                  {/* Row 4 */}
                  <div className="col-12">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/image.jpg"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                    <div className="form-text">Enter a valid image URL or leave blank for placeholder</div>
                    {newProduct.image && (
                      <div className="mt-2">
                        <img 
                          src={newProduct.image} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{maxHeight: '100px', maxWidth: '100px'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-1"></i>Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;


// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// function ProductManager() {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({ name: '', desc: '' });
//   const [editProductData, setEditProductData] = useState({ index: null, name: '', desc: '' });

//   const handleAddProduct = (e) => {
//     e.preventDefault();
//     setProducts([...products, newProduct]);
//     setNewProduct({ name: '', desc: '' });
//   };

//   const handleDeleteProduct = (index) => {
//     const updated = [...products];
//     updated.splice(index, 1);
//     setProducts(updated);
//   };

//   const handleEditProduct = (index) => {
//     const product = products[index];
//     setEditProductData({ index, name: product.name, desc: product.desc });
//     const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
//     modal.show();
//   };

//   const handleSaveEdit = (e) => {
//     e.preventDefault();
//     const updated = [...products];
//     updated[editProductData.index] = {
//       name: editProductData.name,
//       desc: editProductData.desc,
//     };
//     setProducts(updated);
//     const modal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
//     modal.hide();
//   };

//   return (
//     <div className="container py-4">
//       <h2 className="mb-4">Product Manager</h2>

//       {/* Add Product Form */}
//       <form onSubmit={handleAddProduct} className="mb-4">
//         <div className="row g-2">
//           <div className="col-md-4">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Product Name"
//               value={newProduct.name}
//               onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Description"
//               value={newProduct.desc}
//               onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
//               required
//             />
//           </div>
//           <div className="col-md-4">
//             <button type="submit" className="btn btn-primary w-100">Add Product</button>
//           </div>
//         </div>
//       </form>

//       {/* Product Cards */}
//       <div className="row g-3">
//         {products.map((product, index) => (
//           <div className="col-md-4" key={index}>
//             <div className="card h-100">
//               <div className="card-body">
//                 <h5 className="card-title">{product.name}</h5>
//                 <p className="card-text">{product.desc}</p>
//                 <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(index)}>Edit</button>
//                 <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(index)}>Delete</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit Modal */}
//       <div className="modal fade" id="editModal" tabIndex="-1">
//         <div className="modal-dialog">
//           <form className="modal-content" onSubmit={handleSaveEdit}>
//             <div className="modal-header">
//               <h5 className="modal-title">Edit Product</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//             </div>
//             <div className="modal-body">
//               <input
//                 type="text"
//                 className="form-control mb-2"
//                 placeholder="Product Name"
//                 value={editProductData.name}
//                 onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
//                 required
//               />
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Description"
//                 value={editProductData.desc}
//                 onChange={(e) => setEditProductData({ ...editProductData, desc: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="modal-footer">
//               <button type="submit" className="btn btn-success">Save Changes</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductManager;
