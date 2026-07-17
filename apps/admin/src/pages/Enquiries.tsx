import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input, Button } from '@techverse/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const Enquiries: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();

  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [quotedPrice, setQuotedPrice] = useState<number | ''>('');

  const { data: enquiriesData, isLoading } = useQuery({
    queryKey: ['enquiries'],
    queryFn: async () => {
      const res = await axios.get('/api/enquiries', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply, quotedPrice }: any) => axios.put(`/api/enquiries/${id}/reply`, { reply, quotedPrice }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      alert('Reply sent successfully!');
      setSelectedEnquiry(null);
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
    onError: (err: any) => alert(err.response?.data?.message || err.message)
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: any) => axios.put(`/api/enquiries/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    replyMutation.mutate({
      id: selectedEnquiry._id,
      reply: replyMessage,
      adminNote,
      quotedPrice: Number(quotedPrice)
    });
  };

  const openReplyModal = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setReplyMessage(enquiry.reply || '');
    setAdminNote(enquiry.adminNote || '');
    setQuotedPrice(enquiry.quotedPrice || '');
  };

  if (isLoading) return <div className="p-8 dark:text-white">Loading Enquiries...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Quotations & Enquiries</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiriesData?.map((enquiry: any) => (
                <TableRow key={enquiry._id}>
                  <TableCell>
                    <div className="font-semibold dark:text-white">{enquiry.user?.name}</div>
                    <div className="text-xs text-gray-500">{enquiry.user?.email}</div>
                  </TableCell>
                  <TableCell>{enquiry.product?.name || 'N/A'}</TableCell>
                  <TableCell>{enquiry.quantity}</TableCell>
                  <TableCell className="max-w-xs truncate">{enquiry.message}</TableCell>
                  <TableCell>
                    <select 
                      value={enquiry.status} 
                      onChange={(e) => statusMutation.mutate({ id: enquiry._id, status: e.target.value })}
                      className="bg-transparent text-sm border border-gray-200 dark:border-dark-700 rounded px-2 py-1 dark:text-white outline-none"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="converted">Converted to Order</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openReplyModal(enquiry)}>View / Reply</Button>
                  </TableCell>
                </TableRow>
              ))}
              {enquiriesData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No enquiries found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setSelectedEnquiry(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">✕</button>
            <h3 className="text-xl font-bold dark:text-white mb-4">Reply to Enquiry</h3>
            
            <div className="bg-gray-50 dark:bg-dark-900 p-4 rounded-xl mb-6">
              <p className="text-sm font-semibold dark:text-white mb-1">Customer's Message:</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm italic">"{selectedEnquiry.message}"</p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-white mb-1">Quoted Price (per unit)</label>
                <Input 
                  type="number" 
                  value={quotedPrice} 
                  onChange={(e) => setQuotedPrice(e.target.value ? Number(e.target.value) : '')} 
                  placeholder="e.g. 150" 
                  required
                />
              </div>
              {(user?.role === 'admin' || user?.role === 'superadmin') && (
                <div>
                  <label className="block text-sm font-medium dark:text-white mb-1">Admin Notes (Internal)</label>
                  <textarea 
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full border border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none h-20"
                    placeholder="Add internal notes..."
                  ></textarea>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium dark:text-white mb-1">Reply Message</label>
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 resize-none h-32"
                  placeholder="Type your response here..."
                  required
                ></textarea>
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={replyMutation.isPending}>
                {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
