import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './Form';

const App = () => (
  <Router>
    <Routes>
      <Route path="/form" element={<Form />} />
    </Routes>
  </Router>
);

export default App;
