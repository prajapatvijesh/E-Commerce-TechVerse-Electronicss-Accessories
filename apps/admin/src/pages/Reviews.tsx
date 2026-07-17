import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Trash2, Star } from 'lucide-react';
import { Button } from '@techverse/ui';

export const Reviews: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      const { data } = await axios.get('/api/reviews/admin', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
    },
    onSuccess: () => {
      alert('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4"></div></div></div>;
  if (error) return <div className="text-red-500">Error loading reviews.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Reviews Management</h1>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
              {reviews?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No reviews found.
                  </td>
                </tr>
              )}
              {reviews?.map((review: any) => (
                <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-dark-900 overflow-hidden">
                        <img src={review.product?.thumbnail || 'https://via.placeholder.com/150'} alt={review.product?.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{review.product?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {review.user?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "" : "text-gray-300"} />)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xs truncate" title={review.comment}>
                      {review.comment}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      className="p-2 text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this review?')) {
                          deleteMutation.mutate(review._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
