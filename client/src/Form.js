import React, { useState } from 'react';
import UIkit from 'uikit';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', date: '', description: '', amount: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the form data to the back-end
    try {
      const response = await fetch("http://localhost:3001/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        UIkit.notification({message: 'Expense added successfully!', status: 'success'});
        setFormData({
          date: "",
          amount: "",
          category: "",
          description: "",
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      UIkit.notification({message: error.message, status: 'danger'});
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
