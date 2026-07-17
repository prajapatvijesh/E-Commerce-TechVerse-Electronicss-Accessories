import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCompare, clearCompare } from '../store/slices/compareSlice';
import { Button } from '@techverse/ui';
import { Trash2, ShoppingCart, Scale, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';

export const Compare: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.compare);
  const dispatch = useDispatch();

  // Extract all unique attribute names across all compared products
  const allAttributes = Array.from(new Set(
    items.flatMap(item => item.attributes.map(attr => attr.name))
  ));

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.thumbnail,
      qty: 1,
      vendor: product.vendor
    }));
    alert('Added to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-24 h-24 bg-gray-50 dark:bg-dark-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Scale size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-3xl font-extrabold dark:text-white tracking-tight mb-4 text-center">Your compare list is empty</h2>
        <p className="text-gray-500 text-center mb-8 max-w-md">Add products to your comparison list to see them side-by-side and find the perfect match for you.</p>
        <Link to="/shop">
          <Button variant="primary" size="lg" className="rounded-xl px-8 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white tracking-tight">Compare Products</h1>
          <p className="text-gray-500 mt-2">Compare up to 4 items side-by-side.</p>
        </div>
        <Button variant="outline" onClick={() => dispatch(clearCompare())} className="text-red-500 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 border-gray-200 dark:border-dark-700 rounded-xl">
          Clear All
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-3xl border border-gray-100 dark:border-dark-700/50 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-x-auto">
        <table className="w-full text-left min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-6 bg-gray-50 dark:bg-dark-900/50 border-b border-r border-gray-100 dark:border-dark-700/50 w-48 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 z-20">
                Product Specs
              </th>
              {items.map(item => (
                <th key={item._id} className="p-6 border-b border-gray-100 dark:border-dark-700/50 align-top relative min-w-[250px] w-1/4">
                  <button 
                    onClick={() => dispatch(removeFromCompare(item._id))}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 dark:bg-dark-900 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove from compare"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Link to={`/product/${item._id}`} className="block group">
                    <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-dark-900 mb-4 overflow-hidden relative border border-gray-100 dark:border-dark-700/50">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1 block">{item.brand}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">{item.name}</h3>
                  </Link>
                  <div className="mt-4">
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        ₹{(item.salePrice || item.price)?.toFixed(2)}
                      </span>
                      {item.salePrice && (
                        <span className="text-sm text-gray-400 line-through">₹{item.price?.toFixed(2)}</span>
                      )}
                    </div>
                    <Button variant="primary" className="w-full rounded-xl flex justify-center items-center space-x-2" onClick={() => handleAddToCart(item)}>
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </th>
              ))}
              {/* Fill remaining slots if less than 4 items */}
              {Array.from({ length: 4 - items.length }).map((_, i) => (
                <th key={`empty-${i}`} className="p-6 border-b border-gray-100 dark:border-dark-700/50 align-middle text-center w-1/4">
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-700 flex flex-col items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors cursor-pointer" onClick={() => window.location.href = '/shop'}>
                    <div className="text-4xl mb-2">+</div>
                    <span className="text-sm font-medium">Add Product</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
            <tr className="hover:bg-gray-50 dark:hover:bg-dark-900/30 transition-colors">
              <td className="p-4 px-6 bg-gray-50/50 dark:bg-dark-900/30 font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-dark-700/50 sticky left-0 z-10 backdrop-blur-sm">Rating</td>
              {items.map(item => (
                <td key={item._id} className="p-4 px-6 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center text-yellow-400">
                    <span className="font-bold text-gray-900 dark:text-white mr-1">{item.rating || 0}</span>
                    <Star size={16} fill="currentColor" />
                  </div>
                </td>
              ))}
              {Array.from({ length: 4 - items.length }).map((_, i) => <td key={`empty-rating-${i}`} className="p-4 px-6"></td>)}
            </tr>

            {allAttributes.map(attrName => (
              <tr key={attrName} className="hover:bg-gray-50 dark:hover:bg-dark-900/30 transition-colors">
                <td className="p-4 px-6 bg-gray-50/50 dark:bg-dark-900/30 font-semibold text-gray-700 dark:text-gray-300 border-r border-gray-100 dark:border-dark-700/50 sticky left-0 z-10 backdrop-blur-sm capitalize">{attrName}</td>
                {items.map(item => {
                  const attrValue = item.attributes.find(a => a.name.toLowerCase() === attrName.toLowerCase())?.value;
                  return (
                    <td key={item._id} className="p-4 px-6 text-gray-600 dark:text-gray-400">
                      {attrValue ? <span className="font-medium text-gray-900 dark:text-gray-200">{attrValue}</span> : <span className="text-gray-300 dark:text-gray-600">-</span>}
                    </td>
                  );
                })}
                {Array.from({ length: 4 - items.length }).map((_, i) => <td key={`empty-${attrName}-${i}`} className="p-4 px-6"></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
