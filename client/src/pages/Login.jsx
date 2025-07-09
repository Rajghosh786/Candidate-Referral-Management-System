import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [loginUser, setLoginUser] = useState({ email: '', password: '' });
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const login = await axios.post('http://localhost:1305/user/login', loginUser);
      if (login.data.msg === 'Login successful') {
        localStorage.setItem('token', login.data.token);
        localStorage.setItem('user', JSON.stringify({
          firstName: login.data.firstName,
          lastName: login.data.lastName,
          email: login.data.email,
          phone: login.data.phone,
        }));
        setLoginUser({ email: '', password: '' });
        setIsLoggedIn(true);
        setUserData({
          firstName: login.data.firstName,
          lastName: login.data.lastName,
          email: login.data.email,
          phone: login.data.phone,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem('userData');
      if (savedUser) setUserData(JSON.parse(savedUser));
      navigate('/dashboard');
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Login to ReferMe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              value={loginUser.email}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              id="password"
              name="password"
              value={loginUser.password}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
