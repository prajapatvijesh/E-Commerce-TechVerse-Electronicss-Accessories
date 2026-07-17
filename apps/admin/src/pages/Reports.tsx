import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, CardContent, CardHeader, CardTitle, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@techverse/ui';
import { Download, FileText, ShoppingBag, Users as UsersIcon, Store } from 'lucide-react';

export const Reports: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('sales');

  const { data: productsData } = useQuery({ queryKey: ['products'], queryFn: () => axios.get('/api/products').then(res => res.data.data) });
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: () => axios.get('/api/users', { headers: { Authorization: `Bearer ${user?.token}` } }).then(res => res.data.data), enabled: user?.role === 'admin' || user?.role === 'superadmin' });
  const { data: vendorsData } = useQuery({ queryKey: ['vendors'], queryFn: () => axios.get('/api/vendors').then(res => res.data.data) });
  useQuery({ queryKey: ['enquiries'], queryFn: () => axios.get('/api/enquiries', { headers: { Authorization: `Bearer ${user?.token}` } }).then(res => res.data.data) });

  const exportCSV = (filename: string, headers: string[], data: any[]) => {
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(csvUrl);
  };

  const handleExportProducts = () => {
    if (!productsData) return;
    const data = productsData.products.map((p: any) => ({
      ID: p._id,
      Name: p.name,
      Price: p.price,
      Stock: p.countInStock,
      Status: p.status,
      Brand: p.brand
    }));
    exportCSV('products_report', ['ID', 'Name', 'Price', 'Stock', 'Status', 'Brand'], data);
  };

  const handleExportUsers = () => {
    if (!usersData) return;
    const data = usersData.map((u: any) => ({
      ID: u._id,
      Name: u.name,
      Email: u.email,
      Role: u.role,
      JoinedAt: new Date(u.createdAt).toLocaleDateString()
    }));
    exportCSV('customers_report', ['ID', 'Name', 'Email', 'Role', 'JoinedAt'], data);
  };

  const handleExportVendors = () => {
    if (!vendorsData) return;
    const data = vendorsData.map((v: any) => ({
      ID: v._id,
      StoreName: v.storeName,
      OwnerName: v.user?.name || '',
      Status: v.status,
      Rating: v.rating
    }));
    exportCSV('vendors_report', ['ID', 'StoreName', 'OwnerName', 'Status', 'Rating'], data);
  };

  const tabs = [
    { id: 'sales', label: 'Sales Overview', icon: FileText },
    { id: 'products', label: 'Products', icon: ShoppingBag, onExport: handleExportProducts },
    { id: 'customers', label: 'Customers', icon: UsersIcon, onExport: handleExportUsers, adminOnly: true },
    { id: 'vendors', label: 'Vendors', icon: Store, onExport: handleExportVendors, adminOnly: true },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Reports & Export</h1>
      
      <div className="flex border-b border-gray-200 dark:border-dark-700 space-x-8">
        {tabs.filter(t => !t.adminOnly || isAdmin).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 flex items-center space-x-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="capitalize">{activeTab} Report</CardTitle>
          {activeTab !== 'sales' && (
            <Button variant="outline" onClick={tabs.find(t => t.id === activeTab)?.onExport} className="flex items-center space-x-2">
              <Download size={16} />
              <span>Export CSV</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {activeTab === 'sales' && (
            <div className="text-center py-12 space-y-4">
              <FileText size={48} className="mx-auto text-gray-400" />
              <h3 className="text-lg font-medium dark:text-white">Sales PDF Report</h3>
              <p className="text-gray-500 max-w-md mx-auto">Generate and download a comprehensive sales report in PDF format containing all revenue metrics and trends.</p>
              <Button variant="primary" onClick={() => window.open('/api/reports/sales/pdf', '_blank')}>
                Download Sales PDF
              </Button>
            </div>
          )}
          {activeTab === 'products' && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData?.products?.slice(0, 5).map((p: any) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium dark:text-white">{p.name}</TableCell>
                    <TableCell className="dark:text-white">₹{p.price}</TableCell>
                    <TableCell>{p.countInStock}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 text-sm py-4">
                    Showing top 5 preview. Click Export CSV for full report.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
          {activeTab === 'customers' && usersData && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.slice(0, 5).map((u: any) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium dark:text-white">{u.name}</TableCell>
                    <TableCell className="text-gray-500">{u.email}</TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 text-sm py-4">
                    Showing top 5 preview. Click Export CSV for full report.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
          {activeTab === 'vendors' && vendorsData && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorsData.slice(0, 5).map((v: any) => (
                  <TableRow key={v._id}>
                    <TableCell className="font-medium dark:text-white">{v.storeName}</TableCell>
                    <TableCell className="text-gray-500">{v.user?.name}</TableCell>
                    <TableCell>{v.status}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 text-sm py-4">
                    Showing top 5 preview. Click Export CSV for full report.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
