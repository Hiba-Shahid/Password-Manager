import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';


const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  const authFlag = localStorage.getItem('isAuthenticated');
  return token && authFlag === 'true' && token.length > 0;
};

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      
      const currentPath = window.location.pathname;
      localStorage.setItem('redirectPath', currentPath);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? (
                <Navigate 
                  to={localStorage.getItem('redirectPath') || '/dashboard'} 
                  replace 
                />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated() ? (
                <Navigate 
                  to={localStorage.getItem('redirectPath') || '/dashboard'} 
                  replace 
                />
              ) : (
                <Register />
              )
            } 
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

