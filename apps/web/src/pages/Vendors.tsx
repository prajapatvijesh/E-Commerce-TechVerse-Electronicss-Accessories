import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const mockVendors = [
  { id: '1', name: 'TechNova Global', rating: 4.9, sales: '10k+', image: 'https://ui-avatars.com/api/?name=TechNova+Global&background=0D8ABC&color=fff&size=256', location: 'Rajasthan, Jodhpur', description: 'Welcome to TechNova Global! We specialize in premium electronics, smart home devices, and high-end accessories. Our mission is to provide the best quality products with exceptional customer service. All our products come with a minimum 1-year warranty.' },
  { id: '2', name: 'ElectroMart', rating: 4.8, sales: '8k+', image: 'https://ui-avatars.com/api/?name=Electro+Mart&background=f97316&color=fff&size=256', location: 'Mumbai, Maharashtra', description: 'ElectroMart is your one-stop shop for everything electrical. From components to consumer appliances, we deliver quality at unbeatable prices.' },
  { id: '3', name: 'GadgetHub Pro', rating: 4.7, sales: '5k+', image: 'https://ui-avatars.com/api/?name=GadgetHub+Pro&background=10b981&color=fff&size=256', location: 'Bangalore, Karnataka', description: 'At GadgetHub Pro, we curate the most innovative gadgets and productivity tools for professionals and enthusiasts alike.' },
  { id: '4', name: 'AudioPhile Elite', rating: 5.0, sales: '2k+', image: 'https://ui-avatars.com/api/?name=AudioPhile+Elite&background=8b5cf6&color=fff&size=256', location: 'New Delhi, Delhi', description: 'Experience sound like never before. AudioPhile Elite brings you the finest selection of headphones, DACs, and speakers from top brands.' }
];

export const Vendors: React.FC = () => {
  const vendors = mockVendors;

  return (
    <div className="space-y-12">
      <Helmet>
        <title>Our Vendors | TechVerse</title>
        <meta name="description" content="Discover premium electronics from our verified top-rated vendors." />
      </Helmet>
      
      <div className="text-center max-w-2xl mx-auto pt-8">
        <h1 className="text-4xl font-extrabold dark:text-white tracking-tight mb-4">Our Premium Vendors</h1>
        <p className="text-lg text-gray-500">Shop directly from top-rated sellers worldwide. All our vendors are verified for quality and reliability.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {vendors.map((vendor, i) => (
          <motion.div 
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-gray-100 dark:border-dark-700/50 hover:shadow-xl transition-shadow text-center group flex flex-col h-full"
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-50 dark:border-dark-900 group-hover:border-primary-100 dark:group-hover:border-primary-900/30 transition-colors">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-lg dark:text-white group-hover:text-primary-600 transition-colors">{vendor.name}</h3>
            <div className="flex items-center justify-center space-x-1 mt-2 mb-3">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium dark:text-gray-300">{vendor.rating} Rating</span>
            </div>
            <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 dark:bg-dark-900 py-1.5 px-3 rounded-full mx-auto w-fit mb-6">
              <Award size={14} className="mr-1 text-primary-500" /> {vendor.sales} Sales
            </div>
            <div className="mt-auto">
              <Link to={`/vendor/${vendor.id}`} className="inline-flex items-center justify-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                <span>Visit Store</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
