import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Button, Badge } from '@techverse/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, Star, Award, Mail, ArrowRight, Quote, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: async () => {
      const res = await axios.get('/api/products?limit=4');
      return res.data.data;
    }
  });

  const { data: cmsData } = useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/homepage-settings');
      return res.data.data;
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data.data;
    }
  });

  const getCategoryIcon = (slug: string) => {
    const icons: Record<string, string> = {
      'mobiles': '📱', 'smartphones': '📱', 'laptops': '💻', 'audio': '🎧', 'headphones': '🎧',
      'smart-watches': '⌚', 'smart-devices': '⌚', 'gaming-accessories': '🎮', 'chargers': '🔋'
    };
    return icons[slug] || '🛍️';
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.thumbnail || product.images[0] || FALLBACK_IMAGE,
      qty: 1,
      vendor: typeof product.vendor === 'object' ? product.vendor._id : product.vendor
    }));
    alert('Added to cart!');
  };

  return (
    <div className="space-y-24">
      <Helmet>
        <title>TechVerse | Premium Electronics Marketplace</title>
        <meta name="description" content="Shop the latest smartphones, laptops, and gadgets from top vendors on TechVerse." />
      </Helmet>

      {/* Premium Hero Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-black text-white min-h-[650px] flex items-center shadow-2xl border border-white/10 group">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/40 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute inset-0 z-0">
          <img 
            src={cmsData?.heroBanners?.[0]?.image || "https://images.unsplash.com/photo-1618424181497-157f25b6ce53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40 scale-100 transform group-hover:scale-105 transition-transform duration-[20s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-8 md:px-16 max-w-5xl mx-auto md:mx-0">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 leading-[1.1]"
          >
            {cmsData?.heroBanners?.[0]?.title || 'Welcome'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl font-light leading-relaxed"
          >
            {cmsData?.heroBanners?.[0]?.subtitle || 'Experience the next generation of premium electronics.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to={cmsData?.heroBanners?.[0]?.link || "/shop"}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold text-lg px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(var(--color-primary-500),0.4)] hover:shadow-[0_0_60px_rgba(var(--color-primary-500),0.6)] transition-all">
                Shop Collection
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-lg px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-white transition-all hover:border-white/30">
                Compare Specs
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories (Glassmorphism) */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Find exactly what you're looking for.</p>
          </div>
          <Link to="/shop" className="text-primary-600 hover:text-primary-500 hover:underline font-medium flex items-center space-x-1">
            <span>View All</span>
            <span>&rarr;</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {(categoriesData?.slice(0, 4) || []).map((category: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={i} 
            >
              <Link to={`/shop?category=${category.slug}`} className="group block h-full">
                <div className="h-full bg-white/80 backdrop-blur-sm dark:bg-dark-800/90 rounded-[2rem] p-8 border border-gray-100/50 dark:border-dark-700/30 text-center hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-center items-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="h-24 w-24 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-700 dark:to-dark-800 rounded-[2rem] mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 flex items-center justify-center shadow-inner relative z-10 group-hover:shadow-primary-500/20">
                    <span className="text-4xl filter drop-shadow-sm">{getCategoryIcon(category.slug)}</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors relative z-10">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Trending Products</h2>
            <p className="text-gray-500 mt-2">The most loved tech this week.</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-xl">Error loading products. Please try again.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {data?.products?.map((product: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 100 }}
                key={product._id} 
              >
                <div className="bg-white/80 backdrop-blur-md dark:bg-dark-800/90 rounded-[2rem] p-5 border border-gray-100/50 dark:border-dark-700/30 flex flex-col group hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 h-full relative">
                  <Link to={`/product/${product.slug}`} className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-950 rounded-2xl mb-5 overflow-hidden flex items-center justify-center relative">
                    <img 
                      src={product.thumbnail || FALLBACK_IMAGE} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </Link>
                  <div className="mt-auto flex flex-col flex-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">{product.brand?.name || 'Brand'}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 text-lg leading-tight group-hover:text-primary-600 transition-colors">
                      <Link to={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{product.rating ? product.rating.toFixed(1) : 'No reviews'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-dark-700/50">
                      <div className="flex flex-col">
                        {product.salePrice && <span className="text-xs text-gray-400 line-through">₹{product.price?.toFixed(2)}</span>}
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                          ₹{(product.salePrice || product.price)?.toFixed(2)}
                        </span>
                      </div>
                      <Button variant="primary" size="sm" onClick={(e) => handleAddToCart(product, e)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center hover:scale-110 transition-transform shadow-md shadow-primary-500/20">
                        <ShoppingCart size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Offers Section */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-primary-900 to-black text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl border border-primary-500/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <Badge variant="info" className="mb-4 bg-primary-500 text-white border-transparent">Limited Time Offer</Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Get 20% Off Your First Tech Purchase!</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of tech enthusiasts and experience premium quality with TechVerse. Use code <span className="font-bold text-white bg-white/20 px-2 py-1 rounded">TECH20</span> at checkout.</p>
          <Link to="/shop">
            <Button size="lg" variant="primary" className="font-bold rounded-2xl px-8 shadow-lg shadow-primary-500/30">Shop Now</Button>
          </Link>
        </div>
        <div className="relative z-10 mt-10 md:mt-0">
          <div className="w-64 h-64 bg-gradient-to-tr from-primary-500 to-blue-400 rounded-full blur-3xl opacity-50 absolute -inset-10"></div>
          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Offer Promo" className="relative z-10 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500" />
        </div>
      </section>

      {/* Top Vendors */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Top Rated Vendors</h2>
            <p className="text-gray-500 mt-2">Discover premium products from our best sellers.</p>
          </div>
          <Link to="/vendors" className="text-primary-600 hover:text-primary-500 hover:underline font-medium flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'TechNova Global', rating: 4.9, sales: '10k+', image: 'https://ui-avatars.com/api/?name=TechNova+Global&background=0D8ABC&color=fff&size=256' },
            { name: 'ElectroMart', rating: 4.8, sales: '8k+', image: 'https://ui-avatars.com/api/?name=Electro+Mart&background=f97316&color=fff&size=256' },
            { name: 'GadgetHub Pro', rating: 4.7, sales: '5k+', image: 'https://ui-avatars.com/api/?name=GadgetHub+Pro&background=10b981&color=fff&size=256' },
            { name: 'AudioPhile Elite', rating: 5.0, sales: '2k+', image: 'https://ui-avatars.com/api/?name=AudioPhile+Elite&background=8b5cf6&color=fff&size=256' }
          ].map((vendor, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-3xl p-6 border border-gray-100 dark:border-dark-700/50 hover:shadow-xl transition-shadow text-center group"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-50 dark:border-dark-900 group-hover:border-primary-100 dark:group-hover:border-primary-900/30 transition-colors">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg dark:text-white group-hover:text-primary-600 transition-colors">{vendor.name}</h3>
              <div className="flex items-center justify-center space-x-1 mt-2 mb-3">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium dark:text-gray-300">{vendor.rating} Rating</span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500 bg-gray-50 dark:bg-dark-900 py-1.5 px-3 rounded-full mx-auto w-fit">
                <Award size={14} className="mr-1 text-primary-500" /> {vendor.sales} Sales
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-50 dark:bg-primary-900/10 rounded-3xl p-10 md:p-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">What Our Customers Say</h2>
          <p className="text-gray-500 mt-2">Don't just take our word for it.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { text: "The delivery was incredibly fast and the MacBook Pro arrived in perfect condition. TechVerse is my go-to for all things tech now!", author: "Sarah Jenkins", role: "Software Engineer" },
            { text: "I couldn't find this specific camera lens anywhere else. The vendor communication was top-notch and the price was unbeatable.", author: "Michael Chen", role: "Photographer" },
            { text: "Outstanding customer service! I had an issue with my smartwatch and the return process was seamless and completely hassle-free.", author: "Emma Watson", role: "Fitness Coach" }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-sm relative">
              <Quote size={40} className="text-primary-100 dark:text-primary-900/30 absolute top-6 left-6" />
              <div className="relative z-10 pt-4">
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-bold dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic FAQs Section */}
      {cmsData?.faqs?.length > 0 && (
        <section className="bg-white dark:bg-dark-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-dark-700/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {cmsData.faqs.map((faq: any, idx: number) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gray-50 dark:bg-dark-900 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-6 h-6 text-primary-500 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-dark-700/50 pt-4 mt-2 mx-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-white dark:bg-dark-800 rounded-3xl p-10 md:p-16 border border-gray-100 dark:border-dark-700/50 flex flex-col md:flex-row items-center justify-between text-center md:text-left shadow-sm">
        <div className="mb-6 md:mb-0 max-w-xl">
          <h2 className="text-3xl font-extrabold dark:text-white tracking-tight mb-2">Subscribe to our Newsletter</h2>
          <p className="text-gray-500">Get the latest updates on new products and upcoming sales.</p>
        </div>
        <form className="w-full md:w-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
          <div className="relative flex-1 sm:w-80">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" placeholder="Enter your email address" required className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
          </div>
          <Button type="submit" variant="primary" size="lg" className="rounded-2xl px-8 h-14">Subscribe</Button>
        </form>
      </section>
    </div>
  );
};
