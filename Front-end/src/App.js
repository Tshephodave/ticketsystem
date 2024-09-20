import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import LoginForm from './components/Login';
import RegistrationForm from './components/Register';
import Home from './components/Home';
import Notification from './components/Notification';
import MainLayout from './components/Sidebar';
import Respond from './components/RespondTickets';
import TicketDisplay from './components/Ticketlist';
import Create from './components/createTicket';
import Loading from './components/Loading';
import Dashboard from './components/Dashboard';

const App = () => {
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { userId } = jwtDecode(token);
          const response = await axios.get(`http://localhost:4000/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div><Loading/></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/app/home" : "/login"} />} />
        {isAuthenticated && (
          <Route path="/app/*" element={<MainLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="notification" element={<Notification />} />
            <Route path="respond" element={<Respond />} />
            <Route path="ticketlist" element={<TicketDisplay />} />
            <Route path="create-ticket" element={<Create />} />
            <Route path="dashboard" element ={<Dashboard/>}/>
          </Route>
        )}
      </Routes>
    </Router>
  );
};

export default App;
