import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Star, MessageCircle, MapPin, Package, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button, Badge } from '@techverse/ui';
import { motion } from 'framer-motion';
import { FALLBACK_IMAGE } from './Home';
import { mockVendors } from './Vendors';
import { useDispatch, useSelector } from 'react-redux';
import { openChat } from '../store/slices/chatSlice';
import { RootState } from '../store/store';

export const VendorStore: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // In a real app, you'd fetch the specific vendor's public profile and products.
  // For this prototype, we'll fetch products and filter them if we can, or just mock the vendor details.
  const { data: vendorProducts, isLoading } = useQuery({
    queryKey: ['vendor-products', id],
    queryFn: async () => {
      // Mocking fetch all products and filter by vendor if needed, or just showing generic products
      // since backend doesn't have a specific public vendor details endpoint yet.
      const res = await axios.get('/api/products?limit=12');
      return res.data.data.products;
    }
  });

  const vendor = mockVendors.find(v => v.id === id) || mockVendors[0];

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{vendor.name} - Vendor Storefront | TechVerse</title>
        <meta name="description" content={`Shop products from ${vendor.name}, our top-rated vendor.`} />
      </Helmet>

      {/* Vendor Banner & Profile */}
      <div className="relative bg-white dark:bg-dark-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-700">
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-primary-600 to-blue-500 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 relative z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-800 bg-white dark:bg-dark-900 overflow-hidden shadow-lg">
              <img src={vendor.image} alt="Vendor Logo" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-2 pb-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-extrabold dark:text-white">{vendor.name}</h1>
                <Badge variant="success" className="rounded-full">Verified Seller</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{vendor.rating} Rating</span>
                  <span>(1.2k Reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package size={16} />
                  <span>{vendor.sales} Orders Delivered</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pb-2">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 rounded-xl"
                onClick={() => {
                  if (!user) {
                    alert('Please login first to contact the vendor');
                  } else {
                    dispatch(openChat({ 
                      receiverId: id || 'vendor',
                      receiverName: vendor.name 
                    }));
                  }
                }}
              >
                <MessageCircle size={18} />
                <span>Contact Vendor</span>
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-700 max-w-3xl">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">About Store</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {vendor.description}
            </p>
          </div>
        </div>
      </div>

      {/* Store Assurances */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <ShieldCheck size={24} />, title: "Authentic Products", desc: "100% Genuine Guarantee" },
          { icon: <Star size={24} />, title: "Top Rated", desc: "Consistently high ratings" },
          { icon: <RotateCcw size={24} />, title: "Easy Returns", desc: "14-day return policy" },
          { icon: <MessageCircle size={24} />, title: "Quick Support", desc: "Usually responds in 1 hour" }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center mb-3">
              {item.icon}
            </div>
            <h4 className="font-bold text-sm dark:text-white mb-1">{item.title}</h4>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Products Tab */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold dark:text-white">Store Products</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 rounded-xl px-4 py-2 text-sm outline-none dark:text-white">
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendorProducts?.map((product: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={product._id} 
              className="bg-white dark:bg-dark-800 rounded-2xl p-4 border border-gray-100 dark:border-dark-700/50 flex flex-col group hover:shadow-xl transition-all h-full"
            >
              <Link to={`/product/${product.slug}`} className="aspect-square bg-gray-50 dark:bg-dark-900 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                <img 
                  src={product.thumbnail || FALLBACK_IMAGE} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-medium text-primary-600 mb-1 uppercase tracking-wider">{product.brand?.name || 'Brand'}</span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm group-hover:text-primary-600 transition-colors">
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <div className="mt-auto pt-3 border-t border-gray-50 dark:border-dark-700/50 flex justify-between items-center">
                  <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                    ₹{(product.salePrice || product.price)?.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
