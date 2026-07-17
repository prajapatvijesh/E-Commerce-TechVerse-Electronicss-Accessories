import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RootState } from '../store/store';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, Download, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@techverse/ui';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await axios.get('/api/analytics', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  if (isLoading) return <div className="dark:text-white flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (error) return <div className="text-red-500 p-4 bg-red-50 rounded-xl">Failed to load analytics</div>;

  const handleDownloadReport = async () => {
    try {
      const res = await axios.get('/api/reports/sales/pdf', {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Error downloading report');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}!</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <Button variant="primary" className="flex items-center space-x-2" onClick={handleDownloadReport}>
            <Download size={18} />
            <span>Download Report</span>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">₹{data?.totalRevenue?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Orders</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{data?.totalOrders || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Products</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{data?.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Package className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <>
            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Customers</h3>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{data?.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <Users className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Vendors</h3>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{data?.totalVendors || 0}</p>
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                  <Users className="text-indigo-600 dark:indigo-400" size={24} />
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Enquiries</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">{data?.pendingEnquiries || 0}</p>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              <MessageCircle className="text-teal-600 dark:text-teal-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Low Stock Alerts</h3>
              <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mt-2">{data?.lowStock || 0}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700">
        <h2 className="text-xl font-bold dark:text-white mb-6">Revenue Overview (Last 6 Months)</h2>
        <div className="h-80 w-full">
          {data?.salesData && data.salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dx={-10} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa' }}
                  formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No sales data available for this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
