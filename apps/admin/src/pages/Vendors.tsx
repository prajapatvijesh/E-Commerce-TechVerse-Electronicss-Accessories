import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Input, Button } from '@techverse/ui';
import { Search } from 'lucide-react';

export const Vendors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch vendors
  const { data: vendorsData, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const res = await axios.get('/api/vendors');
      return res.data;
    }
  });

  const vendors = vendorsData?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => axios.put(`/api/vendors/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    }
  });

  const handleStatusChange = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
    if (window.confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'approve'} this vendor?`)) {
      updateStatusMutation.mutate({ id, status: newStatus });
    }
  };

  const filteredVendors = vendors.filter((v: any) => 
    v.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Vendors Management</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Vendors</CardTitle>
          <div className="w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search vendors..." 
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
                <TableHead>Store Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <td colSpan={6} className="text-center py-4 text-gray-500">Loading vendors...</td>
                </TableRow>
              ) : filteredVendors.map((vendor: any) => (
                <TableRow key={vendor._id}>
                  <TableCell className="font-medium dark:text-white">
                    <div className="flex items-center space-x-3">
                      {vendor.logo ? (
                        <img src={vendor.logo} alt="Logo" className="w-8 h-8 rounded object-cover bg-gray-100" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500">
                          {vendor.storeName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{vendor.storeName || 'Unnamed Store'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="dark:text-white">{vendor.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{vendor.user?.email || 'N/A'}</div>
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{vendor.contactNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-yellow-500">
                      ★ <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{vendor.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'approved' ? 'success' : vendor.status === 'suspended' ? 'error' : 'warning'}>
                      {vendor.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleStatusChange(vendor._id, vendor.status)}
                    >
                      {vendor.status === 'approved' ? 'Suspend' : 'Approve'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVendors.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No vendors found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
