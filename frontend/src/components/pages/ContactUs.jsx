import React, { useState } from 'react';

function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // You can send this data to your backend API here
    setSubmitted(true);
  };

  return (
    <div className="container py-4">
      <h2>Contact Us</h2>
      {submitted ? (
        <div className="alert alert-success">Thank you for contacting us!</div>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label className="form-label">Message</label>
            <textarea name="message" className="form-control" value={form.message} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ContactUs;