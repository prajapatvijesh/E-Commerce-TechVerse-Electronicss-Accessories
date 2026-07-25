import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@techverse/ui';
import { Tag, CreditCard, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

export const Offers: React.FC = () => {
  return (
    <div className="space-y-12 py-10">
      <Helmet>
        <title>Special Offers | TechVerse</title>
        <meta name="description" content="View all active deals and discounts on TechVerse." />
      </Helmet>
      
      <div className="text-center max-w-3xl mx-auto pt-8 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white tracking-tight mb-4">Exclusive Deals & Offers</h1>
        <p className="text-lg text-gray-500">Discover handpicked deals, seasonal sales, and special bank discounts crafted just for you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Summer Sale */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary-600 to-blue-500 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <Laptop size={48} className="mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-3 relative z-10">Summer Sale</h2>
          <p className="text-primary-100 text-lg mb-8 relative z-10">Up to 40% off on premium laptops, accessories, and smart devices. Limited time offer!</p>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-block relative z-10">
            <span className="text-sm font-medium uppercase tracking-wider text-primary-50 block mb-1">Use Code</span>
            <span className="text-2xl font-black tracking-widest">SUMMER40</span>
          </div>
          <div className="mt-8 relative z-10">
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="rounded-xl px-8 bg-white text-primary-600 hover:bg-gray-50">Shop Sale</Button>
            </Link>
          </div>
        </motion.div>

        {/* Bank Offers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-y-1/4 translate-x-1/4"></div>
          <CreditCard size={48} className="mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-3 relative z-10">Bank Offers</h2>
          <p className="text-purple-100 text-lg mb-8 relative z-10">Get an extra 10% instant cashback on selected Credit Cards and EMI transactions.</p>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-block relative z-10">
            <span className="text-sm font-medium uppercase tracking-wider text-purple-50 block mb-1">Min. Purchase</span>
            <span className="text-2xl font-black">₹5,000</span>
          </div>
          <div className="mt-8 relative z-10">
            <Link to="/shop">
              <Button variant="secondary" size="lg" className="rounded-xl px-8 bg-white text-purple-600 hover:bg-gray-50">View Eligible Products</Button>
            </Link>
          </div>
        </motion.div>

        {/* First Order */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-dark-900 dark:bg-dark-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between border border-gray-800"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-primary-600/20 to-purple-600/20 blur-3xl"></div>
          <div className="relative z-10 mb-6 md:mb-0 md:mr-8 text-center md:text-left">
            <Tag size={40} className="mb-4 mx-auto md:mx-0 text-primary-400" />
            <h2 className="text-2xl font-bold mb-2">Welcome to TechVerse!</h2>
            <p className="text-gray-400">Get 20% off your entire first order across the site.</p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
             <div className="bg-dark-800 dark:bg-dark-900 border border-gray-700 rounded-2xl p-4 text-center">
              <span className="text-sm font-medium text-gray-400 block mb-1">Promo Code</span>
              <span className="text-xl font-bold text-primary-400 tracking-widest">TECH20</span>
            </div>
            <Link to="/shop">
              <Button variant="primary" size="lg" className="rounded-xl px-8 h-[74px]">Apply & Shop</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
