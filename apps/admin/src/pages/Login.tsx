import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { Button } from '@techverse/ui';
import axios from 'axios';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      
      const loggedInUser = res.data.data;
      
      // Admin dashboard requires vendor, admin, or superadmin role
      if (loggedInUser.role !== 'admin' && loggedInUser.role !== 'vendor' && loggedInUser.role !== 'superadmin') {
        throw new Error('Unauthorized access');
      }
      
      dispatch(setCredentials(loggedInUser));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-600/50 relative transform transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <div className="pt-8">
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            TechVerse Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Sign in to your dashboard
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/50 font-medium animate-bounce">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="group">
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 dark:border-dark-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 sm:text-sm shadow-sm group-hover:border-primary-400"
                placeholder="admin@techverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 dark:border-dark-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 sm:text-sm shadow-sm group-hover:border-primary-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign in to Dashboard
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600/50 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
          <Link to="/register" className="font-bold text-primary-600 hover:text-primary-500 transition-colors hover:underline underline-offset-4">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
