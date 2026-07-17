import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Modal } from '@techverse/ui';
import { Plus, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const Coupons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset } = useForm();

  // Fetch coupons
  const { data: couponsData, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await axios.get('/api/coupons', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    }
  });

  const coupons = couponsData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newCoupon: any) => axios.post('/api/coupons', newCoupon, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Failed to create coupon');
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate({
      ...data,
      discountValue: Number(data.discountValue),
      minPurchase: Number(data.minPurchase),
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const filteredCoupons = coupons.filter((c: any) => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Coupons</h1>
        <Button variant="primary" className="flex items-center space-x-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Coupon</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search coupons..." 
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Code</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Discount</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Min Purchase</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Expiry Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">Loading coupons...</td>
                </tr>
              ) : filteredCoupons.map((coupon: any) => (
                <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">₹{coupon.minPurchase}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Coupon">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Coupon Code</label>
            <input {...register('code')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Discount Type</label>
              <select {...register('discountType')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Discount Value</label>
              <input type="number" {...register('discountValue')} required min="1" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Min Purchase (₹)</label>
              <input type="number" {...register('minPurchase')} required min="0" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Usage Limit (Optional)</label>
              <input type="number" {...register('usageLimit')} min="1" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Expiry Date</label>
            <input type="date" {...register('expiryDate')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
