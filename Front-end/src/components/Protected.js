import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Loading from './Loading';

const PrivateRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          await axios.get(`http://localhost:4000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token'); 
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div><Loading /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
