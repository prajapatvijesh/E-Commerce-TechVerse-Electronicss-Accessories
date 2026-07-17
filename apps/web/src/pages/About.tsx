import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Truck, Users, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 py-8 max-w-4xl mx-auto px-4">
      <Helmet>
        <title>About Us | TechVerse</title>
        <meta name="description" content="Learn more about TechVerse, our mission, and our values." />
      </Helmet>

      {/* Hero */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white tracking-tight">About TechVerse</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          We are the world's leading marketplace for premium electronics, connecting top-rated global vendors with tech enthusiasts everywhere.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 dark:border-dark-700">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-primary-600 mb-2">1M+</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-primary-600 mb-2">50k+</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Premium Vendors</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-primary-600 mb-2">99%</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Satisfaction</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-primary-600 mb-2">24/7</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Support</div>
        </div>
      </div>

      {/* Mission */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold dark:text-white">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          At TechVerse, our mission is to democratize access to high-quality electronics by providing a secure, transparent, and seamless platform for buyers and sellers. We believe in technology's power to connect and improve lives, and we strive to make it accessible to everyone, everywhere.
        </p>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold dark:text-white">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Secure Transactions</h3>
              <p className="text-gray-500 dark:text-gray-400">Every purchase on our platform is protected by bank-level encryption and our buyer protection guarantee.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Fast Global Shipping</h3>
              <p className="text-gray-500 dark:text-gray-400">We partner with top logistics providers to ensure your orders arrive quickly and safely, wherever you are.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Verified Sellers</h3>
              <p className="text-gray-500 dark:text-gray-400">Our rigorous vetting process means you only buy from trusted, highly-rated vendors.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Community Driven</h3>
              <p className="text-gray-500 dark:text-gray-400">Honest reviews and a robust Q&A system ensure you have all the information you need before buying.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
