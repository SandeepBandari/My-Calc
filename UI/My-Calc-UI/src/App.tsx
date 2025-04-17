import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Calculator from './Calc';
import DBHistory from './DBHistory';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './LandingPage';
import Sidebar from './Sidebar';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes - backend will handle actual protection */}
      <Route element={<Layout />}>
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/db-history" element={<DBHistory />} />
      </Route>
    </Routes>
  );
}

export default App;