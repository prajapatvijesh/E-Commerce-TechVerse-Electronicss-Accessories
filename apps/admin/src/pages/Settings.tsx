import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@techverse/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useForm } from 'react-hook-form';

export const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, setValue } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get('/api/settings');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (data) {
      setValue('siteName', data.siteName);
      setValue('contactEmail', data.contactEmail);
      setValue('contactPhone', data.contactPhone);
      setValue('currency', data.currency);
      setValue('taxRate', data.taxRate);
      setValue('flatShippingRate', data.flatShippingRate);
      setValue('facebook', data.socialLinks?.facebook);
      setValue('twitter', data.socialLinks?.twitter);
      setValue('instagram', data.socialLinks?.instagram);
      setValue('favicon', data.favicon);
      setValue('maintenanceMode', data.maintenanceMode);
      setValue('adminCommission', data.adminCommission);
    }
  }, [data, setValue]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => axios.put('/api/settings', updatedData, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Update failed');
    }
  });

  const onSubmit = (formData: any) => {
    const payload = {
      ...formData,
      socialLinks: {
        facebook: formData.facebook,
        twitter: formData.twitter,
        instagram: formData.instagram,
      }
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) return <div className="dark:text-white">Loading settings...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Store Settings</h1>
        <Button variant="primary" type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Store Name" {...register('siteName')} />
            <Input label="Favicon URL" {...register('favicon')} />
            <Input label="Support Email" {...register('contactEmail')} />
            <Input label="Phone Number" {...register('contactPhone')} />
            <div className="flex items-center space-x-2 mt-4">
              <input type="checkbox" id="maintenanceMode" {...register('maintenanceMode')} className="w-4 h-4 text-primary-600 rounded" />
              <label htmlFor="maintenanceMode" className="dark:text-white font-medium">Enable Maintenance Mode</label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Currency" {...register('currency')} />
            <Input label="Tax Rate (%)" type="number" step="0.01" {...register('taxRate')} />
            <Input label="Flat Shipping Rate" type="number" step="0.01" {...register('flatShippingRate')} />
            <Input label="Admin Commission (%)" type="number" step="0.01" {...register('adminCommission')} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Facebook URL" {...register('facebook')} />
            <Input label="Twitter URL" {...register('twitter')} />
            <Input label="Instagram URL" {...register('instagram')} />
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
