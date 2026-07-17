import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, CardContent, CardHeader, CardTitle, Input, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '@techverse/ui';
import { Plus, Edit, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const LegalCMS: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: pagesData, isLoading } = useQuery({
    queryKey: ['cms-pages'],
    queryFn: async () => {
      const res = await axios.get('/api/settings/cms');
      return res.data.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/settings/cms', data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      setIsEditing(false);
      reset();
    }
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const handleEdit = (page: any) => {
    setValue('title', page.title);
    setValue('slug', page.slug);
    setValue('content', page.content);
    setValue('metaTitle', page.metaTitle);
    setValue('metaDescription', page.metaDescription);
    setValue('isActive', page.isActive);
    setIsEditing(true);
  };

  const pages = pagesData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">CMS Pages</h1>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            <Plus size={16} className="mr-2" /> Add Page
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Page</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Page Title" {...register('title', { required: true })} />
                <Input label="Slug (e.g., about-us)" {...register('slug', { required: true })} />
                <Input label="Meta Title" {...register('metaTitle')} />
                <Input label="Meta Description" {...register('metaDescription')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown/HTML supported)</label>
                <textarea 
                  className="w-full min-h-[200px] p-3 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  {...register('content', { required: true })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4" defaultChecked />
                <label htmlFor="isActive" className="dark:text-white">Active (Visible to public)</label>
              </div>
              <div className="flex space-x-4 pt-4">
                <Button variant="primary" type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : 'Save Page'}
                </Button>
                <Button variant="outline" type="button" onClick={() => { setIsEditing(false); reset(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
                ) : pages.map((page: any) => (
                  <TableRow key={page._id}>
                    <TableCell className="font-medium dark:text-white flex items-center space-x-2">
                      <FileText size={16} className="text-gray-400" />
                      <span>{page.title}</span>
                    </TableCell>
                    <TableCell className="text-gray-500 font-mono text-sm">/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant={page.isActive ? 'success' : 'error'}>
                        {page.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {pages.length === 0 && !isLoading && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No CMS pages found. Create one above.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
