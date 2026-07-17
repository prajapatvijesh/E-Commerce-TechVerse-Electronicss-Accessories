import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@techverse/ui';
import { Package, Truck, CheckCircle, PackageOpen, ArrowLeft, Download } from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    enabled: !!user && !!id
  });

  const handleDownloadInvoice = async () => {
    try {
      const res = await axios.get(`/api/orders/${id}/invoice`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Failed to download invoice');
    }
  };

  const order = orderData?.data;

  if (isLoading) return <div className="flex justify-center p-20"><div className="animate-spin h-10 w-10 border-b-2 border-primary-500 rounded-full"></div></div>;
  if (!order) return <div className="p-20 text-center">Order not found</div>;

  const milestones = [
    { key: 'pending', label: 'Order Placed', icon: <Package size={24} /> },
    { key: 'processing', label: 'Processing', icon: <PackageOpen size={24} /> },
    { key: 'shipped', label: 'Shipped', icon: <Truck size={24} /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={24} /> }
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStatusIndex = getStatusIndex(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:underline flex items-center space-x-2">
          <ArrowLeft size={16} /> <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Order #{order._id.substring(order._id.length - 8)}</h1>
        <Button variant="outline" className="flex items-center space-x-2" onClick={handleDownloadInvoice}>
          <Download size={16} />
          <span>Download Invoice</span>
        </Button>
      </div>

      {/* Tracking Timeline */}
      <Card className="mb-8 overflow-visible">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold mb-8 dark:text-white">Order Tracking</h2>
          
          {(order.trackingNumber || order.courierName) && (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-dark-800 rounded-xl flex items-center space-x-6 border border-gray-200 dark:border-dark-700">
              <Truck size={32} className="text-primary-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shipped via</p>
                <p className="font-bold dark:text-white">{order.courierName || 'Standard Shipping'}</p>
              </div>
              <div className="border-l border-gray-300 dark:border-dark-600 h-10 mx-4"></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                <p className="font-bold dark:text-white font-mono tracking-wider">{order.trackingNumber || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Timeline Visual */}
          <div className="relative">
            <div className="absolute top-6 left-12 right-12 h-1 bg-gray-200 dark:bg-dark-700 rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-primary-600 rounded-full transition-all duration-1000"
                style={{ width: `${(currentStatusIndex / 3) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between relative z-10">
              {milestones.map((milestone, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                return (
                  <div key={milestone.key} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                      isCompleted ? 'bg-primary-600 border-primary-100 text-white' : 'bg-white dark:bg-dark-800 border-gray-200 dark:border-dark-700 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-primary-100 ring-opacity-50' : ''}`}>
                      {milestone.icon}
                    </div>
                    <p className={`mt-3 font-semibold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{milestone.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking History Log */}
          {order.trackingHistory && order.trackingHistory.length > 0 && (
            <div className="mt-12">
              <h3 className="font-bold mb-4 dark:text-white text-lg">Tracking History</h3>
              <div className="space-y-4">
                {[...order.trackingHistory].reverse().map((event: any, i: number) => (
                  <div key={i} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full mt-1.5"></div>
                      {i !== order.trackingHistory.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-dark-700 my-1"></div>}
                    </div>
                    <div>
                      <p className="font-semibold dark:text-white">{event.description}</p>
                      <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleString()} {event.location ? `- ${event.location}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map((item: any) => (
                <div key={item._id} className="flex items-center space-x-4 border-b border-gray-100 dark:border-dark-700 pb-4 last:border-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-bold dark:text-white">{item.name}</h4>
                    <p className="text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="font-bold dark:text-white">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>₹{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-dark-700 pt-4 flex justify-between font-bold text-lg dark:text-white">
              <span>Total</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
              <h4 className="font-bold mb-2 dark:text-white">Shipping Address</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingAddress.fullName}<br/>
                {order.shippingAddress.street}<br/>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br/>
                {order.shippingAddress.country}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
