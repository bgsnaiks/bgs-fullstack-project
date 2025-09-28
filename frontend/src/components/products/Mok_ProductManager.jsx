import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', desc: '' });
  const [editProductData, setEditProductData] = useState({ index: null, name: '', desc: '' });

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, newProduct]);
    setNewProduct({ name: '', desc: '' });
  };

  const handleDeleteProduct = (index) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleEditProduct = (index) => {
    const product = products[index];
    setEditProductData({ index, name: product.name, desc: product.desc });
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = [...products];
    updated[editProductData.index] = {
      name: editProductData.name,
      desc: editProductData.desc,
    };
    setProducts(updated);
    const modal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Product Manager</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-4">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newProduct.desc}
              onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary w-100">Add Product</button>
          </div>
        </div>
      </form>

      {/* Product Cards */}
      <div className="row g-3">
        {products.map((product, index) => (
          <div className="col-md-4" key={index}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.desc}</p>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(index)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSaveEdit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Product Name"
                value={editProductData.name}
                onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                required
              />
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={editProductData.desc}
                onChange={(e) => setEditProductData({ ...editProductData, desc: e.target.value })}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductManager;
