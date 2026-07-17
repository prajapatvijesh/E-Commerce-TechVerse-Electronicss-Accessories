import React, { useState } from 'react';
import axios from 'axios';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/contact', { name, email, message });
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        We're here to help! If you have any questions, concerns, or need assistance, please reach out to us using the form below.
      </p>
      
      <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 font-medium flex items-center space-x-2">
            <span>✓ Message sent successfully! Our team will get back to you soon.</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 font-medium flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Name</label>
            <input name="name" required type="text" className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Email</label>
            <input name="email" required type="email" className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Message</label>
            <textarea name="message" required rows={5} className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white resize-none"></textarea>
          </div>
          <button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
        <div className="p-6 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
          <h3 className="font-bold dark:text-white mb-2">Customer Support</h3>
          <p className="text-gray-500 dark:text-gray-400">Email: support@techverse.com</p>
          <p className="text-gray-500 dark:text-gray-400">Phone: 1-800-TECH-123</p>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
          <h3 className="font-bold dark:text-white mb-2">Business Hours</h3>
          <p className="text-gray-500 dark:text-gray-400">Monday - Friday: 9am - 6pm EST</p>
          <p className="text-gray-500 dark:text-gray-400">Saturday - Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};
