import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Shipping() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/shipping', {
        // const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to save shipping info: ${errorText}`);
      }
      navigate('/payment');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2>Shipping Information</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label className="form-label">Address</label>
          <input name="address" className="form-control" value={form.address} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">City</label>
          <input name="city" className="form-control" value={form.city} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">State</label>
          <input name="state" className="form-control" value={form.state} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">ZIP</label>
          <input name="zip" className="form-control" value={form.zip} onChange={handleChange} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Shipping;