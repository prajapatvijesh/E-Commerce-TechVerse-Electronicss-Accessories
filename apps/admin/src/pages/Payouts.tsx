import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Input, Button, Modal } from '@techverse/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DollarSign, Wallet, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Payouts: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const { data: balanceData } = useQuery({
    queryKey: ['payout-balance'],
    queryFn: async () => {
      const res = await axios.get('/api/payouts/balance', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: user?.role === 'vendor'
  });

  const { data: payoutsData, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['payouts'],
    queryFn: async () => {
      const res = await axios.get('/api/payouts', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  const requestMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/payouts', data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
      queryClient.invalidateQueries({ queryKey: ['payout-balance'] });
      setIsModalOpen(false);
      reset();
      alert('Payout requested successfully!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Error requesting payout')
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => axios.put(`/api/payouts/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] });
    }
  });

  const onSubmit = (data: any) => {
    requestMutation.mutate({
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      accountDetails: data.accountDetails
    });
  };

  const payouts = payoutsData || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Payouts & Earnings</h1>
        {user?.role === 'vendor' && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Request Payout
          </Button>
        )}
      </div>

      {user?.role === 'vendor' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Net Earnings (After Comm.)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="text-green-500" size={20} />
                <span className="text-2xl font-bold dark:text-white">
                  ₹{balanceData?.netEarnings?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Paid Out</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CreditCard className="text-blue-500" size={20} />
                <span className="text-2xl font-bold dark:text-white">
                  ₹{balanceData?.totalPayouts?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Wallet className="text-primary-500" size={20} />
                <span className="text-2xl font-bold dark:text-white">
                  ₹{balanceData?.availableBalance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{(user?.role === 'admin' || user?.role === 'superadmin') ? 'All Payout Requests' : 'Payout History'}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {(user?.role === 'admin' || user?.role === 'superadmin') && <TableHead>Vendor</TableHead>}
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                {(user?.role === 'admin' || user?.role === 'superadmin') && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPayouts ? (
                <TableRow>
                  <TableCell colSpan={(user?.role === 'admin' || user?.role === 'superadmin') ? 7 : 5} className="text-center py-4">Loading...</TableCell>
                </TableRow>
              ) : payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(user?.role === 'admin' || user?.role === 'superadmin') ? 7 : 5} className="text-center py-4">No payouts found</TableCell>
                </TableRow>
              ) : payouts.map((payout: any) => (
                <TableRow key={payout._id}>
                  <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                  {(user?.role === 'admin' || user?.role === 'superadmin') && <TableCell>{payout.vendor?.name}</TableCell>}
                  <TableCell className="font-bold text-green-600">₹{payout.amount.toFixed(2)}</TableCell>
                  <TableCell>{payout.paymentMethod}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{payout.accountDetails}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'paid' ? 'success' : payout.status === 'pending' ? 'warning' : payout.status === 'rejected' ? 'error' : 'default'}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  {(user?.role === 'admin' || user?.role === 'superadmin') && (
                    <TableCell>
                      <select 
                        value={payout.status} 
                        onChange={(e) => updateStatusMutation.mutate({ id: payout._id, status: e.target.value })}
                        className="bg-transparent text-sm border-gray-300 dark:border-dark-600 rounded"
                        disabled={payout.status === 'paid' || payout.status === 'rejected'}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Payout">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Amount (₹)" 
            type="number" 
            step="0.01" 
            max={balanceData?.availableBalance || 0}
            placeholder="0.00" 
            {...register('amount')} 
            required 
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
            <select {...register('paymentMethod')} className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-dark-700 dark:text-gray-100">
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
          <Input 
            label="Account Details (Email or IBAN)" 
            placeholder="e.g. vendor@paypal.com" 
            {...register('accountDetails')} 
            required 
          />
          <p className="text-xs text-gray-500">Max available: ${balanceData?.availableBalance?.toFixed(2) || '0.00'}</p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={requestMutation.isPending || (balanceData?.availableBalance || 0) <= 0}>
              {requestMutation.isPending ? 'Requesting...' : 'Request Payout'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
