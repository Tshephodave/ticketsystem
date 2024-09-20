import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { jwtDecode } from 'jwt-decode';  
import { tsParticles } from "https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.0.3/+esm";
import { loadAll } from "https://cdn.jsdelivr.net/npm/@tsparticles/all@3.0.3/+esm";

library.add(faEnvelope, faLock);

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',  
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await loadAll(tsParticles);

        await tsParticles.addPreset("lightdark", {
          fullScreen: {
            enable: false
          },
          particles: {
            links: {
              enable: true
            },
            move: {
              enable: true
            },
            number: {
              value: 50
            },
            opacity: {
              value: { min: 0.3, max: 1 }
            },
            shape: {
              type: ["circle", "square", "triangle", "polygon"],
              options: {
                polygon: [
                  {
                    sides: 5
                  },
                  {
                    sides: 6
                  },
                  {
                    sides: 8
                  }
                ]
              }
            },
            size: {
              value: { min: 1, max: 3 }
            }
          }
        });

        await tsParticles.load({
          id: "particles-background",
          options: {
            preset: "lightdark",
            particles: {
              color: {
                value: "#4D2BA9"
              },
              links: {
                color: "#4D2BA9"
              }
            }
          }
        });
      } catch (error) {
        console.error('Error initializing particles:', error);
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    try {
      const response = await axios.post('http://localhost:4000/user/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const { userId } = jwtDecode(token);  
      const userResponse = await axios.get(`http://localhost:4000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(userResponse.data);
      navigate('/');  
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-green-100 to-indigo-100 flex items-center justify-center p-8">
      {/* Particles Background */}
      <div id="particles-background" className="absolute inset-0 z-0"></div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="envelope" className="text-gray-500" />
              <label className="block text-gray-700">Email</label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="lock" className="text-gray-500" />
              <label className="block text-gray-700">Password</label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition duration-200">
            Login
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
