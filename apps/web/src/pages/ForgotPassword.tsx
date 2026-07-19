import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@techverse/ui';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await axios.post('/api/auth/forgotpassword', { email });
      setStatus('success');
      setMessage(res.data.message || 'Email sent');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-orange-400/20 dark:bg-orange-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-600/50 relative transform transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-orange-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <Mail className="w-10 h-10 text-white" />
        </div>

        <div className="pt-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {status === 'success' ? (
          <div className="rounded-2xl bg-green-50/80 dark:bg-green-900/20 p-6 border border-green-200 dark:border-green-800 backdrop-blur-sm animate-pulse">
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" aria-hidden="true" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">Email Sent Successfully</h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-400 font-medium">
                <p>Check your inbox for a password reset link. It expires in 10 minutes.</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 pl-12 border border-gray-300 dark:border-dark-600 placeholder-gray-400 text-gray-900 dark:text-white bg-white/50 dark:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 sm:text-sm shadow-sm"
                  placeholder="Email address"
                />
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
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600/50 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
