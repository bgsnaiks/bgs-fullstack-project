import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import upiLogo from '../../upi.png';
import './upi.css';

function Payment() {
  const [method, setMethod] = useState('');
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleMethodChange = e => {
    setMethod(e.target.value);
    setDetails({});
  };

  const handleInputChange = e => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment processed!');
      clearCart(); // Clear the cart after payment
      setMethod('');
      setDetails({});
      setLoading(false);
      navigate('/cart'); // Redirect to cart page
    }, 1500);
  };

  return (
    <div className="container py-4">
      <h2>Payment Options</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Payment Method</label>
          <div className="d-flex gap-3">
            <label>
              <input type="radio" name="method" value="credit" checked={method === 'credit'} onChange={handleMethodChange} />
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" style={{width:32}} /> Credit Card
            </label>
            <label>
              <input type="radio" name="method" value="debit" checked={method === 'debit'} onChange={handleMethodChange} />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" style={{width:32}} /> Debit Card
            </label>
            <label>
              <input type="radio" name="method" value="upi" checked={method === 'upi'} onChange={handleMethodChange} />
              <img className='upiLogo' src={upiLogo} alt="UPI" style={{width:32}} />
            </label>
            <label>
              <input type="radio" name="method" value="netbanking" checked={method === 'netbanking'} onChange={handleMethodChange} />
              <img src="https://img.icons8.com/color/48/000000/bank-building.png" alt="Bank" style={{width:32}} /> Net Banking
            </label>
          </div>
        </div>

        {/* Payment Details */}
        {method === 'credit' || method === 'debit' ? (
          <div>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input type="text" name="cardNumber" className="form-control" onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Expiry</label>
              <input type="text" name="expiry" className="form-control" placeholder="MM/YY" onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">CVV</label>
              <input type="password" name="cvv" className="form-control" onChange={handleInputChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Name on Card</label>
              <input type="text" name="name" className="form-control" onChange={handleInputChange} required />
            </div>
          </div>
        ) : null}

        {method === 'upi' ? (
          <div className="mb-3">
            <label className="form-label">UPI ID</label>
            <input type="text" name="upiId" className="form-control" onChange={handleInputChange} required />
          </div>
        ) : null}

        {method === 'netbanking' ? (
          <div className="mb-3">
            <label className="form-label">Select Bank</label>
            <select name="bank" className="form-select" onChange={handleInputChange} required>
              <option value="">Choose...</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="ICICI">ICICI</option>
              <option value="Axis">Axis</option>
            </select>
          </div>
        ) : null}

        <button type="submit" className="btn btn-success" disabled={loading || !method}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default Payment;

