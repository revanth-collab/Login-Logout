import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const PublicRoute = () => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    return <Navigate to='/' replace />
  }
  return <Outlet />;
}

const ProtectedRoute = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}

function App() {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
