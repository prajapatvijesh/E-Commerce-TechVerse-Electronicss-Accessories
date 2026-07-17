import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@techverse/ui';

export const VendorProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch Vendor Profile
  const { data, isLoading, error } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: async () => {
      const res = await axios.get('/api/vendors/profile', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  useEffect(() => {
    if (data) {
      setValue('storeName', data.storeName);
      setValue('businessDetails', data.businessAddress?.street || data.businessDetails);
      setValue('gstNumber', data.gstNumber);
      setValue('logo', data.logo);
      setValue('banner', data.banner);
    }
  }, [data, setValue]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => axios.put('/api/vendors/profile', updatedData, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['vendorProfile'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Update failed');
    }
  });

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="dark:text-white">Loading profile...</div>;
  if (error) return (
    <div className="text-red-500">
      Failed to load profile. Reason: {(error as any)?.response?.data?.message || (error as any)?.message || 'Unknown error'}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Store Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Store Name</label>
              <input {...register('storeName')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Business Details / Address</label>
              <textarea {...register('businessDetails')} rows={3} className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">GST Number (Optional)</label>
              <input {...register('gstNumber')} type="text" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" placeholder="e.g. 22AAAAA0000A1Z5" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Logo URL</label>
              <input {...register('logo')} type="url" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Banner URL</label>
              <input {...register('banner')} type="url" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>

            <Button type="submit" variant="primary" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
