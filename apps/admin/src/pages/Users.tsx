import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Input, Button, Modal } from '@techverse/ui';
import { Search, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Pass token if required by interceptor, assuming axios uses interceptors or cookie
      const res = await axios.get('/api/users');
      return res.data;
    }
  });

  const users = usersData?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newUser: any) => axios.post('/api/auth/register', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => axios.put(`/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const onSubmit = (data: any) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('role', user.role);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Users Management</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Users</CardTitle>
          <div className="w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search users..." 
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={5} className="text-center py-4 text-gray-500">Loading users...</td>
                </TableRow>
              ) : filteredUsers.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium dark:text-white">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'info' : user.role === 'vendor' ? 'warning' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-gray-400 hover:text-primary-600 transition-colors p-1"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Name</label>
            <input {...register('name')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Email</label>
            <input type="email" {...register('email')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
          </div>
          {!editingUser && (
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-white">Password</label>
              <input type="password" {...register('password')} required className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white" />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Role</label>
            <select {...register('role')} className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white">
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
