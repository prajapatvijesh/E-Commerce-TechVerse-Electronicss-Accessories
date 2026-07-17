import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Modal } from '@techverse/ui';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  
  
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const thumbnailPreview = watch('thumbnail');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`
        }
      });
      setValue('thumbnail', res.data.data.url);
      alert('Image uploaded successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('/api/products');
      return res.data;
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    }
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res = await axios.get('/api/brands');
      return res.data;
    }
  });

  const products = productsData?.data?.products || [];
  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newProduct: any) => axios.post('/api/products', newProduct, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Failed to create product');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => axios.put(`/api/products/${id}`, data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Failed to update product');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/products/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message || 'Failed to delete product');
    }
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.countInStock),
      variants: variants
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setValue('name', product.name);
    setValue('brand', product.brand?._id || product.brand);
    setValue('category', product.category?._id || product.category);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('countInStock', product.stock);
    setValue('sku', product.sku);
    setValue('thumbnail', product.thumbnail);
    setVariants(product.variants || []);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setVariants([]);
    reset();
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Products</h1>
        <Button variant="primary" className="flex items-center space-x-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
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
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">Loading products...</td>
                </tr>
              ) : filteredProducts.map((product: any) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.category?.name || product.category || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Product Name</label>
            <input {...register('name')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Brand</label>
              <select {...register('brand')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white">
                <option value="">Select a brand</option>
                {brands.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Category</label>
              <select {...register('category')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white">
                <option value="">Select a category</option>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Description</label>
            <textarea {...register('description')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" rows={3}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Price (₹)</label>
              <input type="number" step="0.01" {...register('price')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Stock</label>
              <input type="number" {...register('countInStock')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">SKU</label>
            <input {...register('sku')} required placeholder="e.g. TECH-PHONE-123" className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Thumbnail Image</label>
            <div className="flex space-x-2 items-center">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
              <input type="hidden" {...register('thumbnail')} required />
            </div>
            {uploadingImage && <p className="text-sm text-primary-500 font-medium mt-1">Uploading...</p>}
            {thumbnailPreview && !uploadingImage && (
              <div className="mt-2">
                <img src={thumbnailPreview} alt="Preview" className="h-20 w-20 object-cover rounded-md border border-gray-200 dark:border-dark-600" />
              </div>
            )}
          </div>
          <div className="space-y-4 border-t border-gray-200 dark:border-dark-700 pt-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold dark:text-white">Product Variants</label>
              <Button type="button" variant="outline" onClick={() => setVariants([...variants, { name: 'New Variant', options: [] }])} className="text-xs py-1 px-2 h-auto">
                <Plus size={14} className="mr-1" /> Add Variant Group
              </Button>
            </div>
            
            {variants.map((variantGroup, vgIndex) => (
              <div key={vgIndex} className="bg-gray-50 dark:bg-dark-900 p-4 rounded-lg border border-gray-200 dark:border-dark-600 space-y-4">
                <div className="flex justify-between items-center">
                  <input 
                    value={variantGroup.name} 
                    onChange={(e) => {
                      const newV = [...variants];
                      newV[vgIndex].name = e.target.value;
                      setVariants(newV);
                    }}
                    placeholder="e.g. Color, Size" 
                    className="px-2 py-1 border rounded text-sm font-bold dark:bg-dark-700 dark:text-white dark:border-dark-600 w-48"
                  />
                  <button type="button" onClick={() => {
                    const newV = [...variants];
                    newV.splice(vgIndex, 1);
                    setVariants(newV);
                  }} className="text-red-500 hover:text-red-700">
                    <Trash size={16} />
                  </button>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-dark-700">
                  {variantGroup.options.map((opt: any, optIndex: number) => (
                    <div key={optIndex} className="flex space-x-2 items-center">
                      <input 
                        placeholder="Option name (e.g. Red)" 
                        value={opt.name}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[vgIndex].options[optIndex].name = e.target.value;
                          setVariants(newV);
                        }}
                        className="flex-1 px-2 py-1 text-sm border rounded dark:bg-dark-700 dark:text-white dark:border-dark-600"
                      />
                      <input 
                        type="number"
                        placeholder="Price Diff" 
                        value={opt.price}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[vgIndex].options[optIndex].price = Number(e.target.value);
                          setVariants(newV);
                        }}
                        className="w-24 px-2 py-1 text-sm border rounded dark:bg-dark-700 dark:text-white dark:border-dark-600"
                      />
                      <input 
                        type="number"
                        placeholder="Stock" 
                        value={opt.stock}
                        onChange={(e) => {
                          const newV = [...variants];
                          newV[vgIndex].options[optIndex].stock = Number(e.target.value);
                          setVariants(newV);
                        }}
                        className="w-20 px-2 py-1 text-sm border rounded dark:bg-dark-700 dark:text-white dark:border-dark-600"
                      />
                      <button type="button" onClick={() => {
                        const newV = [...variants];
                        newV[vgIndex].options.splice(optIndex, 1);
                        setVariants(newV);
                      }} className="text-red-400 hover:text-red-600">
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => {
                    const newV = [...variants];
                    newV[vgIndex].options.push({ name: '', price: 0, stock: 10 });
                    setVariants(newV);
                  }} className="text-xs py-1 px-2 h-auto text-primary-600">
                    + Add Option
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
