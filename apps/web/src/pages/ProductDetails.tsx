import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Badge } from '@techverse/ui';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Scale, MessageCircle, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToCompare } from '../store/slices/compareSlice';
import { openChat } from '../store/slices/chatSlice';
import { RootState } from '../store/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FALLBACK_IMAGE } from './Home';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteQty, setQuoteQty] = useState(1);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${slug}`);
      return res.data.data;
    },
    enabled: !!slug
  });

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist', user?._id],
    queryFn: async () => {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    enabled: !!user
  });

  const queryClient = useQueryClient();

  const toggleWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const isInWishlist = wishlistData?.data?.products?.some((p: any) => p._id === productId || p === productId);
      if (isInWishlist) {
        return axios.delete(`/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      } else {
        return axios.post('/api/wishlist/add', { productId }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any) => {
      if (!user) alert('Please login to manage wishlist');
      else alert(err.response?.data?.message || err.message);
    }
  });

  const submitEnquiryMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/enquiries', data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Quote request sent successfully!');
      setIsQuoteModalOpen(false);
      setQuoteMessage('');
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message)
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (error || !data) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-red-500 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 text-lg font-medium">Product not found.</div>
    </div>
  );

  const product = data;
  const isInWishlist = wishlistData?.data?.products?.some((p: any) => p._id === product._id || p === product._id);

  const handleAddToCart = () => {
    // Check if all variants are selected
    if (product.variants && product.variants.length > 0) {
      const missing = product.variants.filter((v: any) => !selectedVariants[v.name]);
      if (missing.length > 0) {
        alert(`Please select: ${missing.map((m: any) => m.name).join(', ')}`);
        return;
      }
    }

    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.thumbnail || product.images[0] || FALLBACK_IMAGE,
      qty,
      vendor: product.vendor?._id || product.vendor,
      variants: selectedVariants
    }));
    return true;
  };

  const onAddToCartClick = () => {
    if (handleAddToCart()) {
      alert('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      navigate('/checkout');
    }
  };


  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request a quote');
      return;
    }
    submitEnquiryMutation.mutate({
      product: product._id,
      vendor: product.vendor?._id || product.vendor,
      quantity: quoteQty,
      message: quoteMessage
    });
  };

  const handleVariantSelect = (variantName: string, optionName: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: optionName
    }));
  };

  return (
    <div className="space-y-16 mt-8">
      {product && (
        <Helmet>
          <title>{product.name} | TechVerse</title>
          <meta name="description" content={product.description?.substring(0, 160) || 'Buy ' + product.name + ' on TechVerse'} />
        </Helmet>
      )}
      {/* Product Top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-dark-800 aspect-square rounded-3xl overflow-hidden border border-gray-100 dark:border-dark-700/50 p-8 flex items-center justify-center shadow-xl shadow-gray-200/50 dark:shadow-none group relative">
            <img 
              src={product.thumbnail || FALLBACK_IMAGE} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
               {product.images.slice(0,4).map((img: string, idx: number) => (
                 <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 cursor-pointer hover:border-primary-500 transition-colors">
                   <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}/>
                 </div>
               ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Badge variant="info" className="uppercase tracking-wider">{product.brand?.name || 'Brand'}</Badge>
              {product.stock > 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">In Stock</span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Out of Stock</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white leading-tight tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={18} fill={star <= (product.rating || 0) ? "currentColor" : "none"} className={star <= (product.rating || 0) ? "" : "text-gray-300 dark:text-gray-600"} />
                ))}
              </div>
              <span className="text-sm font-medium text-primary-600 hover:underline cursor-pointer">{product.numReviews || 0} Reviews</span>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                ₹{(product.salePrice || product.price)?.toFixed(2)}
              </span>
              {product.salePrice && (
                <span className="text-xl text-gray-400 line-through">₹{product.price?.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-light">
            {product.description}
          </p>

          <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-dark-700/50">
            
            {/* Dynamic Variants */}
            {product.variants && product.variants.length > 0 && product.variants.map((variant: any) => (
              <div key={variant.name} className="space-y-3">
                <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{variant.name}</label>
                <div className="flex flex-wrap gap-3">
                  {variant.options.map((option: any) => (
                    <button
                      key={option.name}
                      onClick={() => handleVariantSelect(variant.name, option.name)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        selectedVariants[variant.name] === option.name
                          ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 ring-2 ring-primary-500/20'
                          : 'border-gray-200 dark:border-dark-600 hover:border-primary-500/50 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800'
                      }`}
                    >
                      {option.name} {option.price ? `(+₹${option.price})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center space-x-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Quantity</label>
                <div className="flex items-center border border-gray-200 dark:border-dark-600 rounded-xl bg-white dark:bg-dark-800 p-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-colors">-</button>
                  <span className="w-12 text-center font-semibold dark:text-white">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-300 transition-colors">+</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-1 flex justify-center items-center space-x-2 h-14 text-lg rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow" 
                onClick={onAddToCartClick} 
                disabled={product.stock === 0}
              >
                <ShoppingCart size={22} />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 flex justify-center items-center h-14 text-lg rounded-xl border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all" 
                onClick={handleBuyNow} 
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <div className="flex space-x-4 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 sm:flex-none sm:w-16 h-14 rounded-xl border-gray-200 dark:border-dark-600 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group justify-center"
                  onClick={() => toggleWishlistMutation.mutate(product._id)} 
                  disabled={toggleWishlistMutation.isPending}
                  title="Toggle Wishlist"
                >
                  <Heart size={22} className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500 transition-colors'} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 sm:flex-none sm:w-16 h-14 rounded-xl border-gray-200 dark:border-dark-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group justify-center"
                  title="Compare Product"
                  onClick={() => {
                     dispatch(addToCompare({
                       _id: product._id,
                       name: product.name,
                       price: product.price,
                       salePrice: product.salePrice,
                       thumbnail: product.thumbnail || FALLBACK_IMAGE,
                       brand: product.brand?.name || 'Unknown',
                       attributes: product.attributes || [],
                       rating: product.rating || 0
                     }));
                  }}
                >
                  <Scale size={22} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Button>
              </div>
            </div>
            
            <div className="pt-2 space-y-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-xl"
                onClick={() => {
                  if (!user) alert('Please login first');
                  else setIsQuoteModalOpen(true);
                }}
              >
                Request Bulk Quote / Enquiry
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-gray-200 dark:border-dark-600 hover:border-primary-500 hover:text-primary-600 text-gray-700 dark:text-gray-300 rounded-xl flex items-center justify-center space-x-2"
                onClick={() => {
                  if (!user) {
                    alert('Please login first');
                  } else if (product.vendor) {
                    dispatch(openChat({ 
                      receiverId: typeof product.vendor === 'object' ? product.vendor._id : product.vendor,
                      receiverName: typeof product.vendor === 'object' ? product.vendor.storeName : 'Vendor'
                    }));
                  }
                }}
              >
                <MessageCircle size={20} />
                <span>Chat with Vendor</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-dark-700/50">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
              <Truck size={24} className="text-primary-600 mb-2" />
              <span className="text-sm font-medium dark:text-white">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
              <RotateCcw size={24} className="text-primary-600 mb-2" />
              <span className="text-sm font-medium dark:text-white">30 Days Return</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-800/50 rounded-2xl">
              <ShieldCheck size={24} className="text-primary-600 mb-2" />
              <span className="text-sm font-medium dark:text-white">1 Year Warranty</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="pt-16">
        <h2 className="text-3xl font-extrabold dark:text-white mb-8 tracking-tight">Customer Reviews & Q&A</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reviews Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold dark:text-white flex items-center space-x-2">
              <Star className="text-yellow-400" fill="currentColor"/> 
              <span>Reviews</span>
            </h3>
            
            {/* Add Review Form */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
              <h4 className="font-bold text-lg dark:text-white mb-6">Write a Review</h4>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const rating = (form.elements.namedItem('rating') as HTMLSelectElement).value;
                  const comment = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;
                  axios.post('/api/reviews', { product: product._id, rating, comment }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : ''}` }
                  }).then(() => {
                    alert('Review submitted!');
                    window.location.reload();
                  }).catch(err => alert(err.response?.data?.message || err.message));
                }}
              >
                <select name="rating" className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow cursor-pointer" required>
                  <option value="">Select Rating</option>
                  <option value="5">5 - Excellent 🌟</option>
                  <option value="4">4 - Good ⭐</option>
                  <option value="3">3 - Fair 😐</option>
                  <option value="2">2 - Poor 👎</option>
                  <option value="1">1 - Terrible 🚫</option>
                </select>
                <textarea name="comment" className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow h-32 resize-none" placeholder="Share your thoughts about this product..." required></textarea>
                <Button variant="primary" type="submit" className="rounded-xl px-8">Submit Review</Button>
              </form>
            </div>

            {/* List Reviews */}
            <div className="space-y-6">
              <ReviewsList productId={product._id} />
            </div>
          </div>

          {/* Q&A Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold dark:text-white flex items-center space-x-2">
              <span className="text-primary-500">?</span>
              <span>Questions & Answers</span>
            </h3>
            
            {/* Ask Question Form */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
              <h4 className="font-bold text-lg dark:text-white mb-6">Ask a Question</h4>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const question = (form.elements.namedItem('question') as HTMLTextAreaElement).value;
                  axios.post('/api/qa', { product: product._id, question }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : ''}` }
                  }).then(() => {
                    alert('Question submitted!');
                    window.location.reload();
                  }).catch(err => alert(err.response?.data?.message || err.message));
                }}
              >
                <textarea name="question" className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-shadow h-32 resize-none" placeholder="What would you like to know?" required></textarea>
                <Button variant="outline" type="submit" className="rounded-xl px-8 border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700">Ask Question</Button>
              </form>
            </div>

            {/* List QA */}
            <div className="space-y-6">
              <QAList productId={product._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.category && (
        <div className="pt-8 border-t border-gray-100 dark:border-dark-700/50">
          <RelatedProducts categoryId={product.category._id || product.category} currentProductId={product._id} />
        </div>
      )}

      {/* Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold dark:text-white mb-6">Request Quote</h3>
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">Quantity Required</label>
                <input 
                  type="number" 
                  min="1" 
                  value={quoteQty}
                  onChange={(e) => setQuoteQty(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl p-3 dark:text-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white mb-2">Message / Requirements</label>
                <textarea 
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-xl p-3 dark:text-white outline-none h-32 resize-none"
                  placeholder="Describe your bulk requirements, target price, etc..."
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={submitEnquiryMutation.isPending}>
                {submitEnquiryMutation.isPending ? 'Sending...' : 'Send Enquiry'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for Reviews and QA
const ReviewsList = ({ productId }: { productId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await axios.get(`/api/reviews/${productId}`);
      return res.data.data;
    }
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string; product: string }) => {
      const res = await axios.post('/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      setRating(5);
      setComment('');
      setSubmitError('');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      alert('Review submitted successfully!');
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    submitReviewMutation.mutate({ rating, comment, product: productId });
  };

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      {/* Submit Review Form */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
        <h3 className="text-lg font-bold dark:text-white mb-4">Write a Review</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star size={24} fill={star <= rating ? "#FBBF24" : "none"} className={star <= rating ? "text-yellow-400" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300 mb-1">Review</label>
              <textarea 
                required 
                rows={3} 
                className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white resize-none"
                placeholder="What did you like or dislike?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" disabled={submitReviewMutation.isPending}>
              {submitReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Please <Link to="/login" className="text-primary-600 font-semibold hover:underline">log in</Link> to write a review.
          </div>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {(!data || data.length === 0) ? (
          <div className="text-gray-500 bg-gray-50 dark:bg-dark-800/50 p-6 rounded-2xl text-center">No reviews yet. Be the first!</div>
        ) : (
          data.map((r: any) => (
        <div key={r._id} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="font-bold dark:text-white text-sm">{r.user?.name || 'Anonymous'}</div>
              <div className="flex text-yellow-400 mt-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= r.rating ? "currentColor" : "none"} className={s <= r.rating ? "" : "text-gray-300"} />)}
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{r.comment}</p>
        </div>
      )))}
      </div>
    </div>
  );
};

const QAList = ({ productId }: { productId: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [question, setQuestion] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['qa', productId],
    queryFn: async () => {
      const res = await axios.get(`/api/qa/${productId}`);
      return res.data.data;
    }
  });

  const submitQAMutation = useMutation({
    mutationFn: async (qaData: { question: string; product: string }) => {
      const res = await axios.post('/api/qa', qaData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    onSuccess: () => {
      setQuestion('');
      setSubmitError('');
      queryClient.invalidateQueries({ queryKey: ['qa', productId] });
      alert('Question submitted successfully!');
    },
    onError: (err: any) => {
      setSubmitError(err.response?.data?.message || 'Failed to submit question');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    submitQAMutation.mutate({ question, product: productId });
  };

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading Q&A...</div>;

  return (
    <div className="space-y-8">
      {/* Submit Question Form */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
        <h3 className="text-lg font-bold dark:text-white mb-4">Ask a Question</h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && <div className="text-red-500 text-sm">{submitError}</div>}
            <div>
              <textarea 
                required 
                rows={2} 
                className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary-500/50 dark:text-white resize-none"
                placeholder="Have a question about this product?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" disabled={submitQAMutation.isPending}>
              {submitQAMutation.isPending ? 'Submitting...' : 'Ask Question'}
            </Button>
          </form>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Please <Link to="/login" className="text-primary-600 font-semibold hover:underline">log in</Link> to ask a question.
          </div>
        )}
      </div>

      {/* QA List */}
      <div className="space-y-4">
        {(!data || data.length === 0) ? (
          <div className="text-gray-500 bg-gray-50 dark:bg-dark-800/50 p-6 rounded-2xl text-center">No questions yet.</div>
        ) : (
          data.map((q: any) => (
        <div key={q._id} className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <p className="font-bold dark:text-white text-sm mb-3 flex items-start">
            <span className="text-primary-500 mr-2">Q:</span>
            <span>{q.question}</span>
          </p>
          <div className="pl-6 border-l-2 border-gray-100 dark:border-dark-700">
            {q.answer ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm flex items-start">
                <span className="font-bold text-gray-900 dark:text-gray-400 mr-2">A:</span>
                <span>{q.answer}</span>
              </p>
            ) : (
              <p className="text-gray-400 text-sm italic">Pending answer from vendor...</p>
            )}
          </div>
        </div>
      )))}
      </div>
    </div>
  );
};

const RelatedProducts = ({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', categoryId],
    queryFn: async () => {
      const res = await axios.get(`/api/products?category=${categoryId}&limit=5`);
      return res.data.data.products.filter((p: any) => p._id !== currentProductId).slice(0, 4);
    }
  });

  if (isLoading || !data || data.length === 0) return null;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {data.map((product: any, i: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            key={product._id} 
            className="bg-white dark:bg-dark-800 rounded-2xl p-4 border border-gray-100 dark:border-dark-700/50 flex flex-col group hover:shadow-xl transition-all"
          >
            <Link to={`/product/${product.slug}`} className="aspect-square bg-gray-50 dark:bg-dark-900 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
              <img 
                src={product.thumbnail || FALLBACK_IMAGE} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
            <div className="flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 text-sm group-hover:text-primary-600 transition-colors">
                <Link to={`/product/${product.slug}`}>{product.name}</Link>
              </h3>
              <div className="mt-auto pt-2 flex justify-between items-center">
                <span className="font-extrabold text-gray-900 dark:text-white">
                  ₹{(product.salePrice || product.price)?.toFixed(2)}
                </span>
                <Link to={`/product/${product.slug}`}>
                  <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0 flex items-center justify-center">
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
