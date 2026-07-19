import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Heart, Send, MapPin, ArrowLeft, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@techverse/ui';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AIChatbot } from '../components/AIChatbot';
import { useLanguage } from '../context/LanguageContext';
import { NotificationDropdown } from '../components/NotificationDropdown';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const user = useSelector((state: RootState) => state.auth.user);
  const { t, language, setLanguage } = useLanguage();

  const { data: cmsData } = useQuery({
    queryKey: ['homepage-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/homepage-settings');
      return res.data.data;
    }
  });

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist', user?._id],
    queryFn: async () => {
      const { data } = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user,
  });

  const wishlistItemsCount = wishlistData?.data?.products?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors">
      {/* Top Bar for Location */}
      <div className="bg-primary-900 text-white py-1.5 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-primary-100">
            <MapPin size={14} />
            <span>Delivering to <strong className="text-white">Jodhpur, Rajasthan 342001</strong></span>
          </div>
          <div className="hidden sm:flex space-x-4 text-primary-200">
            <span>Free Shipping on orders over ₹1000</span>
            <span className="border-l border-primary-700 pl-4">Support: support@techverse.com</span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border-b border-gray-100 dark:border-dark-700/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo & Main Nav */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-1 sm:hidden text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => window.scrollTo(0, 0)}>
                <span className="text-2xl font-bold text-primary-600 tracking-tighter">TechVerse</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Link to="/" className="hover:text-primary-600 transition-colors" onClick={() => window.scrollTo(0, 0)}>{t('home')}</Link>
                <Link to="/shop" className="hover:text-primary-600 transition-colors">{t('shop')}</Link>
                <Link to="/vendors" className="hover:text-primary-600 transition-colors">{t('vendors')}</Link>
                <Link to="/offers" className="hover:text-primary-600 transition-colors">Offers</Link>
                <Link to="/about" className="hover:text-primary-600 transition-colors">About</Link>
                <Link to="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
              <form 
                className="relative w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const keyword = (form.elements.namedItem('search') as HTMLInputElement).value;
                  if (keyword.trim()) {
                    window.location.href = `/shop?keyword=${encodeURIComponent(keyword.trim())}`;
                  }
                }}
              >
                <input
                  type="text"
                  name="search"
                  placeholder={t('search_placeholder')}
                  className="w-full bg-gray-100 dark:bg-dark-700 border-transparent focus:bg-white dark:focus:bg-dark-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-lg pl-10 pr-4 py-2 text-sm dark:text-white"
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500">
                  <Search size={18} />
                </button>
              </form>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center space-x-4">

              {user && <NotificationDropdown />}

              <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors hidden sm:block">
                <Heart size={24} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="hidden sm:flex items-center space-x-2">
                      <User size={20} />
                      <span>{user.name}</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="hidden sm:flex text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      localStorage.removeItem('user');
                      navigate('/login');
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" className="hidden sm:flex items-center space-x-2">
                    <User size={20} />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
              <button 
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white dark:bg-dark-800 shadow-2xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-primary-600 tracking-tighter">TechVerse</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <form 
              className="relative w-full mb-8"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const keyword = (form.elements.namedItem('search') as HTMLInputElement).value;
                if (keyword.trim()) {
                  window.location.href = `/shop?keyword=${encodeURIComponent(keyword.trim())}`;
                }
              }}
            >
              <input
                type="text"
                name="search"
                placeholder="Search..."
                className="w-full bg-gray-100 dark:bg-dark-700 border-transparent focus:bg-white dark:focus:bg-dark-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-lg pl-10 pr-4 py-3 text-sm dark:text-white"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            <nav className="flex flex-col space-y-4 mb-8">
              <Link to="/" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">Categories</Link>
              <Link to="/vendors" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">Vendors</Link>
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">Offers</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600">Contact</Link>
            </nav>
            
            <div className="mt-auto space-y-4">
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <Heart size={20} />
                <span className="font-medium">My Wishlist ({wishlistItemsCount})</span>
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center flex items-center space-x-2">
                      <User size={20} />
                      <span>{user.name}</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-red-500 border-red-200"
                    onClick={() => {
                      localStorage.removeItem('user');
                      navigate('/login');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center flex items-center space-x-2">
                    <User size={20} />
                    <span>Sign In / Register</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative bg-white dark:bg-dark-900 overflow-hidden mt-auto">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            <div className="lg:col-span-4 pr-4">
              <Link to="/" className="inline-block" onClick={() => window.scrollTo(0,0)}>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 tracking-tighter">TechVerse</span>
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                The ultimate destination for premium electronics and accessories. Experience the future of technology with our curated collection of gadgets.
              </p>
              <div className="mt-6 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <p className="flex items-start space-x-3 group cursor-pointer">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                    <MapPin size={16} className="text-primary-500" />
                  </div>
                  <span className="mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">TechVerse HQ, Jodhpur<br/>Rajasthan 342001, India</span>
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Language</h3>
                <div className="inline-flex bg-gray-100 dark:bg-dark-800 p-1 rounded-xl shadow-inner border border-gray-200/50 dark:border-dark-700/50">
                  <button onClick={() => setLanguage('en')} className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${language === 'en' ? 'bg-white dark:bg-dark-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>English</button>
                  <button onClick={() => setLanguage('hi')} className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${language === 'hi' ? 'bg-white dark:bg-dark-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>हिंदी</button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Shop</h3>
              <ul className="mt-6 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/shop?category=mobiles" onClick={() => window.scrollTo(0,0)} className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Smartphones</Link></li>
                <li><Link to="/shop?category=laptops" onClick={() => window.scrollTo(0,0)} className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Laptops & PCs</Link></li>
                <li><Link to="/shop?category=gaming-accessories" onClick={() => window.scrollTo(0,0)} className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Gaming Gear</Link></li>
                <li><Link to="/shop" onClick={() => window.scrollTo(0,0)} className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">View All</Link></li>
              </ul>
            </div>
            
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
              <ul className="mt-6 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Help Center (FAQ)</Link></li>
                <li><Link to="/returns" className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform">Returns Policy</Link></li>
                <li><a href="http://localhost:3001" className="hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1 inline-block transition-transform flex items-center space-x-1"><span>Vendor Portal</span> <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-1.5 py-0.5 rounded-full ml-1">Beta</span></a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Join our Newsletter</h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Get the latest updates on new products and upcoming sales.</p>
              <form 
                className="mt-5 relative group" 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.target as any).email.value;
                  try {
                    await axios.post('/api/newsletter/subscribe', { email });
                    alert('Subscribed successfully!');
                    (e.target as any).reset();
                  } catch (err) {
                    alert('Subscription failed');
                  }
                }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
                <div className="relative flex items-center bg-white dark:bg-dark-800 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/50">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email address" 
                    required 
                    className="w-full px-4 py-3 text-sm bg-transparent dark:text-white focus:outline-none placeholder-gray-400" 
                  />
                  <button type="submit" className="bg-primary-600 text-white px-5 py-3 hover:bg-primary-700 transition-colors flex items-center justify-center font-medium text-sm">
                    Subscribe
                    <Send size={14} className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-200/60 dark:border-dark-800/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{cmsData?.footerText || '© 2026 TechVerse Marketplace. All rights reserved.'}</p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all duration-200">
                <span className="sr-only">Facebook</span>
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all duration-200">
                <span className="sr-only">Twitter</span>
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all duration-200">
                <span className="sr-only">Instagram</span>
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-all duration-200">
                <span className="sr-only">LinkedIn</span>
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Global AI Chatbot */}
      <AIChatbot />
    </div>
  );
};
