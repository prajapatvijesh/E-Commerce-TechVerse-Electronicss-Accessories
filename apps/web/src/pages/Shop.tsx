import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@techverse/ui';
import { addToCart } from '../store/slices/cartSlice';
import { addToCompare } from '../store/slices/compareSlice';
import { Heart, ShoppingCart, SlidersHorizontal, Scale, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { RootState } from '../store/store';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export const Shop: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? initialCategory.split(',') : []);
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [keyword] = useState(initialKeyword);
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');

  const priceRanges = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under ₹10,000', min: '0', max: '10000' },
    { label: '₹10,000 - ₹50,000', min: '10000', max: '50000' },
    { label: '₹50,000 - ₹1,00,000', min: '50000', max: '100000' },
    { label: 'Over ₹1,00,000', min: '100000', max: '' }
  ];

  const handlePriceRangeChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    else params.delete('category');
    
    if (sort) params.set('sort', sort);
    else params.delete('sort');
    
    if (keyword) params.set('keyword', keyword);
    else params.delete('keyword');
    
    if (page > 1) params.set('page', page.toString());
    else params.delete('page');
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    if (minRating > 0) params.set('rating', minRating.toString());
    else params.delete('rating');
    
    if (inStockOnly) params.set('inStock', 'true');
    else params.delete('inStock');

    // Only update if the URL actually changed to prevent infinite loops
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [selectedCategories, sort, keyword, page, minPrice, maxPrice, minRating, inStockOnly, searchParams, setSearchParams]);

  // Sync state when URL params change externally (e.g. clicking footer links)
  useEffect(() => {
    const currentUrlCategory = searchParams.get('category');
    const currentSelected = selectedCategories.join(',');
    if (currentUrlCategory !== null && currentUrlCategory !== currentSelected) {
      setSelectedCategories(currentUrlCategory ? currentUrlCategory.split(',') : []);
    } else if (currentUrlCategory === null && selectedCategories.length > 0) {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  // Read Categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data.data;
    }
  });

  // Fetch Products based on filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategories, sort, keyword, page, minPrice, maxPrice, minRating, inStockOnly],
    queryFn: async () => {
      let url = `/api/products?page=${page}&limit=12&`;
      if (selectedCategories.length > 0) {
        const categoryIds = selectedCategories.join(','); 
        url += `category=${categoryIds}&`;
      }
      if (keyword) {
        url += `keyword=${encodeURIComponent(keyword)}&`;
      }
      const res = await axios.get(url);
      
      let products = res.data.data.products;
      
      // Client-side filtering for missing backend filters
      if (minPrice) products = products.filter((p: any) => (p.salePrice || p.price) >= Number(minPrice));
      if (maxPrice) products = products.filter((p: any) => (p.salePrice || p.price) <= Number(maxPrice));
      if (minRating > 0) products = products.filter((p: any) => (p.rating || 0) >= minRating);
      if (inStockOnly) products = products.filter((p: any) => p.stock > 0);
      
      // Client-side sorting
      if (sort === 'price_asc') {
        products = products.sort((a: any, b: any) => (a.salePrice || a.price) - (b.salePrice || b.price));
      } else if (sort === 'price_desc') {
        products = products.sort((a: any, b: any) => (b.salePrice || b.price) - (a.salePrice || a.price));
      } else if (sort === 'newest') {
        products = products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      return { products, totalPages: res.data.data.pages };
    }
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
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

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => axios.post('/api/wishlist/add', { productId }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Added to wishlist!');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any) => {
      if (!user) alert('Please login to add to wishlist');
      else alert(err.response?.data?.message || err.message);
    }
  });

  return (
    <div className="flex flex-col md:flex-row gap-10 mt-8">
      <Helmet>
        <title>Shop | TechVerse</title>
        <meta name="description" content="Browse our complete collection of electronics, gadgets, and accessories." />
      </Helmet>

      {/* Filters Sidebar */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700/50 sticky top-24">
          <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100 dark:border-dark-700/50">
            <SlidersHorizontal size={20} className="text-primary-600" />
            <h3 className="font-bold text-lg dark:text-white">Filters</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h4>
              <ul className="space-y-3">
                {categoriesData?.map((cat: any) => (
                   <li key={cat._id}>
                     <label className="flex items-center space-x-3 cursor-pointer group">
                       <div className="relative flex items-center justify-center">
                         <input 
                           type="checkbox" 
                           className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-primary-600 checked:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all cursor-pointer" 
                           checked={selectedCategories.includes(cat.slug || cat.name.toLowerCase())}
                           onChange={() => handleCategoryChange(cat.slug || cat.name.toLowerCase())}
                         />
                         <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                           <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
                       </div>
                       <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{cat.name}</span>
                     </label>
                   </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h4>
              <ul className="space-y-3">
                {priceRanges.map((range, idx) => (
                  <li key={idx}>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="priceRange"
                          className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all cursor-pointer" 
                          checked={minPrice === range.min && maxPrice === range.max}
                          onChange={() => handlePriceRangeChange(range.min, range.max)}
                        />
                        <div className="absolute w-2.5 h-2.5 bg-primary-600 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
                        {range.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex items-center space-x-2 mt-4">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-full bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-700 rounded-lg px-3 py-2 text-sm dark:text-white" />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Rating</h4>
              <ul className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <li key={rating}>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="rating"
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                      />
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i >= rating ? "text-gray-300" : ""} />)}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">& up</span>
                    </label>
                  </li>
                ))}
                <li>
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} className="w-4 h-4 text-primary-600 cursor-pointer" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Any Rating</span>
                  </label>
                </li>
              </ul>
            </div>

            {/* Stock Filter */}
            <div className="pt-4 border-t border-gray-100 dark:border-dark-700/50">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-primary-600 cursor-pointer" />
                <span className="text-gray-900 dark:text-white font-medium">In Stock Only</span>
              </label>
            </div>
            
            <Button variant="outline" className="w-full text-sm" onClick={() => {
              setSelectedCategories([]); setMinPrice(''); setMaxPrice(''); setMinRating(0); setInStockOnly(false); setPage(1);
            }}>Clear All Filters</Button>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Shop Products</h2>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-shadow cursor-pointer"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">Error loading products.</div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.products?.map((product: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  key={product._id} 
                  className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700/50 flex flex-col group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 h-full relative"
                >
                  <div className="absolute top-7 right-7 z-10 flex flex-col space-y-2">
                    <button 
                      onClick={(e) => { e.preventDefault(); addToWishlistMutation.mutate(product._id); }}
                      className="bg-white/90 backdrop-blur-sm dark:bg-dark-800/90 p-2.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-dark-700 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                      title="Add to Wishlist"
                    >
                      <Heart size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
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
                      className="bg-white/90 backdrop-blur-sm dark:bg-dark-800/90 p-2.5 rounded-full shadow-sm text-gray-400 hover:text-primary-600 hover:bg-white dark:hover:bg-dark-700 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 delay-75"
                      title="Compare"
                    >
                      <Scale size={18} />
                    </button>
                  </div>

                  <Link to={`/product/${product.slug}`} className="aspect-square bg-gray-50 dark:bg-dark-900 rounded-xl mb-5 overflow-hidden flex items-center justify-center relative">
                    <img 
                      src={product.thumbnail || FALLBACK_IMAGE} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
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
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={(e) => handleAddToCart(product, e)} 
                        disabled={product.stock === 0}
                        className="rounded-full w-10 h-10 p-0 flex items-center justify-center hover:scale-110 transition-transform shadow-md shadow-primary-500/20 disabled:hover:scale-100"
                      >
                        {product.stock === 0 ? <span className="text-xs px-2">Out</span> : <ShoppingCart size={18} />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {data?.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 pt-8">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-2 rounded-xl">
                  <ChevronLeft size={18} />
                </Button>
                {[...Array(data?.totalPages || 1)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-700 dark:text-gray-300 hover:border-primary-500'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button variant="outline" disabled={page === (data?.totalPages || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-2 rounded-xl">
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
