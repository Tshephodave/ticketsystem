import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faUserTag, faLock } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import { tsParticles } from "https://cdn.jsdelivr.net/npm/@tsparticles/engine@3.0.3/+esm";
import { loadAll } from "https://cdn.jsdelivr.net/npm/@tsparticles/all@3.0.3/+esm";

library.add(faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faUserTag, faLock);

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
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
              value: "#191970"
            },
            links: {
              color: "#191970"
            }
          }
        }
      });
    })();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    department: 'finance',
    location: '',
    role: 'user',
    password: '',
    passwordConfirm: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /\d{3}-\d{3}-\d{4}/;
    return regex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Invalid email format - must be in this format usr@gmail.com'
      });
    }

    if (name === 'phone') {
      setErrors({
        ...errors,
        phone: validatePhone(value) ? '' : 'Invalid phone format - must be in this format 071-343-0009'
      });
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.email || errors.phone) {
      alert('Please fix the errors in the form');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/user/register', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-green-100 to-indigo-100 flex items-center justify-center p-8">
      {/* Particles Background */}
      <div id="particles-background" className="absolute inset-0 z-0"></div>

      {/* Registration Form */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="user" className="text-gray-500" />
              <label className="block text-gray-700">Name</label>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="user" className="text-gray-500" />
              <label className="block text-gray-700">Surname</label>
            </div>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="phone" className="text-gray-500" />
              <label className="block text-gray-700">Phone</label>
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
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
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="building" className="text-gray-500" />
              <label className="block text-gray-700">Department</label>
            </div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            >
              <option value="finance">Finance</option>
              <option value="ict">ICT</option>
              <option value="customercareservice">Customer Care Service</option>
            </select>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="map-marker-alt" className="text-gray-500" />
              <label className="block text-gray-700">Location</label>
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="user-tag" className="text-gray-500" />
              <label className="block text-gray-700">Role</label>
            </div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
          <div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon="lock" className="text-gray-500" />
              <label className="block text-gray-700">Confirm Password</label>
            </div>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded mt-4 hover:bg-green-700"
          >
            Register
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an Account{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
