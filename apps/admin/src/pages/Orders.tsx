import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input } from '@techverse/ui';
import { Search, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    }
  });

  const orders = ordersData?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => axios.put(`/api/orders/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const updateTrackingMutation = useMutation({
    mutationFn: ({ id, trackingNumber, courierName }: { id: string, trackingNumber: string, courierName: string }) => 
      axios.put(`/api/orders/${id}/tracking`, { trackingNumber, courierName }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleTrackingUpdate = (id: string, trackingNumber: string, courierName: string) => {
    updateTrackingMutation.mutate({ id, trackingNumber, courierName });
  };

  const filteredOrders = orders.filter((order: any) => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-dark-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Orders Management</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <div className="w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search by ID or customer..." 
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking & Courier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">Loading orders...</TableCell>
                </TableRow>
              ) : filteredOrders.map((order: any) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium dark:text-white">
                    <span title={order._id}>{order._id.substring(order._id.length - 8)}</span>
                  </TableCell>
                  <TableCell>{order.user?.name || 'Unknown'}</TableCell>
                  <TableCell>₹{order.totalPrice?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1 border rounded-full outline-none cursor-pointer text-center appearance-none ${getStatusColor(order.status)}`}
                      style={{ textAlignLast: 'center' }}
                    >
                      <option value="pending" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">Pending</option>
                      <option value="processing" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">Processing</option>
                      <option value="shipped" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">Shipped</option>
                      <option value="delivered" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">Delivered</option>
                      <option value="cancelled" className="bg-white dark:bg-dark-800 text-gray-900 dark:text-white">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <input 
                        type="text" 
                        placeholder="Tracking No."
                        defaultValue={order.trackingNumber || ''}
                        onBlur={(e) => {
                          if (e.target.value !== order.trackingNumber) {
                            handleTrackingUpdate(order._id, e.target.value, order.courierName || '');
                          }
                        }}
                        className="text-xs border border-gray-300 dark:border-dark-600 rounded px-2 py-1 bg-transparent dark:text-white w-32"
                      />
                      <input 
                        type="text" 
                        placeholder="Courier Name"
                        defaultValue={order.courierName || ''}
                        onBlur={(e) => {
                          if (e.target.value !== order.courierName) {
                            handleTrackingUpdate(order._id, order.trackingNumber || '', e.target.value);
                          }
                        }}
                        className="text-xs border border-gray-300 dark:border-dark-600 rounded px-2 py-1 bg-transparent dark:text-white w-32"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => window.open(`/api/orders/${order._id}/invoice?token=${user?.token}`, '_blank')}
                      className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                      title="Download Invoice"
                    >
                      <FileText size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
