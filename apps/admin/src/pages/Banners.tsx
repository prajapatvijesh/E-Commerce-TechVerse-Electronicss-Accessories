import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Modal, Tooltip, ImageUpload } from '@techverse/ui';
import { Plus, Edit, Trash, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import toast from 'react-hot-toast';

export const Banners: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      position: 'hero',
      isActive: true,
      order: 0,
      title: '',
      link: '/',
      image: '',
    },
  });

  const bannerImage = watch('image');

  const { data: bannersData, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await axios.get('/api/banners');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newBanner: any) =>
      axios.post('/api/banners', newBanner, {
        headers: { Authorization: `Bearer ${user?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      closeModal();
      toast.success('Banner created successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create banner');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      axios.put(`/api/banners/${id}`, data, {
        headers: { Authorization: `Bearer ${user?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      closeModal();
      toast.success('Banner updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update banner');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/banners/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      toast.success('Banner deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete banner');
    },
  });

  const onSubmit = (data: any) => {
    if (!data.image) {
      return toast.error('Please upload a banner image');
    }

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setValue('title', banner.title);
    setValue('link', banner.link);
    setValue('image', banner.image);
    setValue('position', banner.position);
    setValue('isActive', banner.isActive);
    setValue('order', banner.order);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    reset({
      position: 'hero',
      isActive: true,
      order: 0,
      title: '',
      link: '/',
      image: '',
    });
  };

  const banners = bannersData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Banners</h1>
        <Button
          variant="primary"
          className="flex items-center space-x-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Image
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Title
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Position
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Order
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Loading banners...
                  </td>
                </tr>
              ) : (
                banners.map((banner: any) => (
                  <tr
                    key={banner._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-12 w-32 object-cover rounded shadow-sm border border-gray-200 dark:border-dark-600"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {banner.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {banner.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {banner.order}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full ${banner.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}
                      >
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2 flex justify-end">
                      <Tooltip content="Edit Banner" position="top">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="text-gray-400 hover:text-primary-600 transition-colors mt-2"
                        >
                          <Edit size={16} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete Banner" position="top">
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors mt-2 ml-2"
                        >
                          <Trash size={16} />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              )}
              {!isLoading && banners.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <ImageIcon
                        size={48}
                        className="text-gray-300 dark:text-dark-600 mb-2"
                      />
                      <p>No banners found. Add one to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">
              Banner Image
            </label>
            <ImageUpload
              defaultImage={bannerImage || undefined}
              onUpload={(url) => {
                setValue('image', url);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Title</label>
            <input
              {...register('title')}
              required
              className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">
              Target Link
            </label>
            <input
              {...register('link')}
              required
              placeholder="/products"
              className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">
                Position
              </label>
              <select
                {...register('position')}
                className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white"
              >
                <option value="hero">Hero Carousel</option>
                <option value="mid-section">Mid Section</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">
                Order
              </label>
              <input
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium dark:text-white"
            >
              Active (Visible on website)
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
