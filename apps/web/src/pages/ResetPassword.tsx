import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@techverse/ui';
import { Lock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    
    setStatus('loading');
    
    try {
      const res = await axios.put(`/api/auth/resetpassword/${token}`, { password });
      setStatus('success');
      
      // Auto login the user with new token
      if (res.data && res.data.data) {
        dispatch(setCredentials(res.data.data));
      }
      
      // Redirect to home/dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Invalid or expired token');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-600/50 relative transform transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-teal-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <Lock className="w-10 h-10 text-white" />
        </div>

        <div className="pt-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Please enter your new password below.
          </p>
        </div>
        
        {status === 'success' ? (
          <div className="rounded-2xl bg-green-50/80 dark:bg-green-900/20 p-6 border border-green-200 dark:border-green-800 backdrop-blur-sm animate-pulse">
            <div className="flex flex-col items-center text-center">
              <Lock className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" aria-hidden="true" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Password Reset Successful!</h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-400 font-medium">Redirecting you to the home page...</p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-12 border border-gray-300 dark:border-dark-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 sm:text-sm shadow-sm"
                    placeholder="New password"
                    minLength={6}
                  />
                </div>
              </div>
              <div className="group">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-12 border border-gray-300 dark:border-dark-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 sm:text-sm shadow-sm"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800/50 font-medium animate-bounce">
                {message}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
