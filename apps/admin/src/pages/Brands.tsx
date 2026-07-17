import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Input, Button, Modal } from '@techverse/ui';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useForm } from 'react-hook-form';

export const Brands: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: brandsData, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await axios.get('/api/brands');
      return res.data;
    }
  });

  const brands = brandsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (newBrand: any) => axios.post('/api/brands', newBrand, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => axios.put(`/api/brands/${id}`, data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/brands/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    }
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      isActive: data.isActive === 'true' || data.isActive === true
    };
    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setValue('name', brand.name);
    setValue('slug', brand.slug);
    setValue('isActive', brand.isActive ? 'true' : 'false');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    reset();
  };

  const filteredBrands = brands.filter((b: any) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Brands Management</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Brand</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Brands</CardTitle>
          <div className="w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search brands..." 
              className="pl-9 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">Loading brands...</TableCell>
                </TableRow>
              ) : filteredBrands.map((brand: any) => (
                <TableRow key={brand._id}>
                  <TableCell className="font-medium dark:text-white">{brand.name}</TableCell>
                  <TableCell className="text-gray-500">{brand.slug}</TableCell>
                  <TableCell>
                    <Badge variant={brand.isActive ? 'success' : 'error'}>
                      {brand.isActive ? 'active' : 'inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button onClick={() => handleEdit(brand)} className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(brand._id)} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBrand ? "Edit Brand" : "Add New Brand"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Brand Name" placeholder="e.g. Apple" {...register('name')} required />
          <Input label="Slug" placeholder="e.g. apple" {...register('slug')} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select {...register('isActive')} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:border-dark-700 dark:text-gray-100">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={closeModal} type="button">Cancel</Button>
            <Button variant="primary" type="submit">{editingBrand ? "Update Brand" : "Save Brand"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
