import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Link } from 'react-router-dom';
import { Button } from '@techverse/ui';
import { Trash2, ShoppingCart } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';

export const Wishlist: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: wishlistData, isLoading, error } = useQuery({
    queryKey: ['wishlist', user?._id],
    queryFn: async () => {
      const { data } = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to remove product from wishlist');
    }
  });

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      vendor: product.vendor?._id || product.vendor,
      image: product.thumbnail || product.images?.[0],
      price: product.salePrice || product.price,
      qty: 1,
    }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Please log in to view your wishlist</h2>
        <Link to="/login?redirect=/wishlist">
          <Button variant="primary">Login</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) return <div className="py-20 text-center dark:text-white">Loading wishlist...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error loading wishlist.</div>;

  const products = wishlistData?.data?.products || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold dark:text-white mb-8">My Wishlist</h1>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
          <h3 className="text-xl font-medium dark:text-gray-300 mb-4">Your wishlist is empty</h3>
          <Link to="/shop">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-dark-700 group flex flex-col">
              <Link to={`/product/${product._id}`} className="block relative overflow-hidden aspect-square bg-gray-100 dark:bg-dark-900">
                <img 
                  src={product.thumbnail || 'https://via.placeholder.com/400'} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="text-lg font-semibold dark:text-white hover:text-primary-600 line-clamp-1 mb-2">
                  {product.name}
                </Link>
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  ₹{product.salePrice || product.price}
                </div>
                <div className="mt-auto flex gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-1 flex items-center justify-center space-x-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-3 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => removeMutation.mutate(product._id)}
                    disabled={removeMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
