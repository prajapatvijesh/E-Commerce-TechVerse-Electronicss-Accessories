import React, { useState, useEffect } from 'react';
import { Button, Input, Badge } from '@techverse/ui';
import { Package, Heart, User, FileText, Trash2, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCredentials } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Fetch Orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await axios.get('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: activeTab === 'orders' && !!user,
  });

  // Fetch Enquiries
  const { data: enquiriesData, isLoading: enquiriesLoading } = useQuery({
    queryKey: ['myEnquiries'],
    queryFn: async () => {
      const res = await axios.get('/api/enquiries/my-enquiries', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: activeTab === 'enquiries' && !!user,
  });

  // Fetch Wishlist
  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data?.products || [];
    },
    enabled: activeTab === 'wishlist' && !!user,
  });

  const removeWishlistMutation = useMutation({
    mutationFn: (productId: string) => axios.delete(`/api/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => axios.put('/api/users/profile', data, {
      headers: { Authorization: `Bearer ${user?.token}` }
    }),
    onSuccess: (res) => {
      dispatch(setCredentials({ ...res.data.data, token: user?.token }));
      alert('Profile updated successfully!');
      setPassword('');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { name, email };
    if (password) payload.password = password;
    updateProfileMutation.mutate(payload);
  };

  if (!user) return <div className="dark:text-white p-8">Please login to view dashboard.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
        >
          <Package size={20} />
          <span>My Orders</span>
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
        >
          <Heart size={20} />
          <span>Wishlist</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
        >
          <User size={20} />
          <span>Profile Settings</span>
        </button>
        <button 
          onClick={() => setActiveTab('enquiries')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'enquiries' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
        >
          <MessageSquare size={20} />
          <span>My Enquiries</span>
        </button>
        <button 
          onClick={() => {
             dispatch(setCredentials(null as any));
             localStorage.removeItem('user');
             window.location.href = '/login';
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-auto border border-red-100 dark:border-red-900/30"
        >
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white mb-6">Order History</h2>
            {ordersLoading ? (
              <div className="dark:text-gray-400">Loading orders...</div>
            ) : ordersData?.length === 0 ? (
              <div className="dark:text-gray-400">You have no orders yet.</div>
            ) : ordersData?.map((order: any) => (
              <div key={order._id} className="bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-dark-900 p-4 border-b border-gray-100 dark:border-dark-700 flex flex-wrap justify-between items-center text-sm gap-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Order Placed</p>
                    <p className="font-semibold dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total</p>
                    <p className="font-semibold dark:text-white">₹{order.totalPrice?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Order #</p>
                    <p className="font-semibold dark:text-white">{order._id.substring(order._id.length - 8)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link to={`/orders/${order._id}`}>
                      <Button variant="primary" size="sm" className="flex items-center space-x-2">
                        <Package size={16} />
                        <span>Track Order</span>
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={() => window.open(`/api/orders/${order._id}/invoice?token=${user.token}`, '_blank')}>
                      <FileText size={16} />
                      <span>Invoice</span>
                    </Button>
                  </div>
                </div>
                <div className="p-6 divide-y divide-gray-100 dark:divide-dark-700">
                  {order.orderItems.map((item: any, i: number) => (
                    <div key={i} className="flex items-center space-x-6 py-4 first:pt-0 last:pb-0">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-dark-700 rounded-md overflow-hidden flex items-center justify-center">
                         {item.image ? (
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         ) : <span className="text-xs text-gray-400">No Img</span>}
                      </div>
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="font-semibold text-primary-600 hover:underline">{item.name}</Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold dark:text-white mb-6">My Wishlist</h2>
            {wishlistLoading ? (
              <div className="dark:text-gray-400">Loading wishlist...</div>
            ) : wishlistData?.length === 0 ? (
              <div className="dark:text-gray-400">Your wishlist is empty.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistData?.map((item: any) => (
                  <div key={item._id} className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-100 dark:border-dark-700 flex flex-col group">
                    <Link to={`/product/${item.slug}`} className="aspect-square bg-gray-100 dark:bg-dark-700 rounded-lg mb-4 overflow-hidden">
                      {item.thumbnail ? (
                         <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : null}
                    </Link>
                    <div className="mt-auto">
                      <Link to={`/product/${item.slug}`} className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600">{item.name}</Link>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                        <button onClick={() => removeWishlistMutation.mutate(item._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white dark:bg-dark-800 p-8 rounded-xl border border-gray-100 dark:border-dark-700">
            <h2 className="text-2xl font-bold dark:text-white mb-6">Profile Settings</h2>
            <form className="space-y-6" onSubmit={handleProfileUpdate}>
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Email Address" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
              <div className="pt-4 border-t border-gray-100 dark:border-dark-700">
                <h3 className="text-lg font-medium dark:text-white mb-4">Change Password (Optional)</h3>
                <div className="space-y-4">
                  <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep same" />
                </div>
              </div>
              <Button variant="primary" type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold dark:text-white mb-6">My Enquiries</h2>
            {enquiriesLoading ? (
               <div className="dark:text-gray-400">Loading enquiries...</div>
            ) : enquiriesData?.length === 0 ? (
               <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 p-8 text-center text-gray-500">
                 <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                 <p>You have not submitted any enquiries yet.</p>
               </div>
            ) : (
               <div className="space-y-4">
                 {enquiriesData?.map((enq: any) => (
                   <div key={enq._id} className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-100 dark:border-dark-700">
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className="font-semibold text-gray-900 dark:text-white">{enq.product?.name || 'General Enquiry'}</span>
                         <p className="text-xs text-gray-500">To: {enq.vendor?.name}</p>
                       </div>
                       <Badge variant={enq.status === 'replied' || enq.status === 'converted' ? 'success' : 'warning'}>{enq.status}</Badge>
                     </div>
                     <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-dark-900 p-3 rounded-lg mb-2">{enq.message}</p>
                     {enq.reply && (
                       <div className="mt-2 pl-4 border-l-2 border-primary-500">
                         <p className="text-xs font-semibold text-primary-600 mb-1">Vendor Reply:</p>
                         <p className="text-sm text-gray-700 dark:text-gray-300">{enq.reply}</p>
                         {enq.quotedPrice && <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">Quoted Price: ₹{enq.quotedPrice}</p>}
                       </div>
                     )}
                     <div className="text-[10px] text-gray-400 mt-2">{new Date(enq.createdAt).toLocaleString()}</div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
