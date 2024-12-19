import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', date: '', description: '', amount: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/expenses', formData, { withCredentials: true });
      alert('Expense added successfully!');
    } catch (err) {
      alert('Error adding expense!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="date" type="date" value={formData.date} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="amount" type="number" step="0.01" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
