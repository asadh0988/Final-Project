// Main App component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import toast, { Toaster } from 'react-hot-toast';

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
