import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '@techverse/ui';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post('/api/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-600/50 relative transform transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div className="pt-8">
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Sign in to continue to TechVerse
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="group">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 group-hover:border-primary-400 focus:ring-primary-500"
              />
            </div>
            <div className="group">
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 group-hover:border-primary-400 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center group cursor-pointer">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-colors"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 transition-colors hover:underline underline-offset-4">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
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
