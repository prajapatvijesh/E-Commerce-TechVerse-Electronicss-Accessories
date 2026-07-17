import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, RootState } from './store/store';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Users } from './pages/Users';
import { Categories } from './pages/Categories';
import { Brands } from './pages/Brands';
import { Orders } from './pages/Orders';
import { Settings } from './pages/Settings';
import { VendorProfile } from './pages/VendorProfile';
import { Coupons } from './pages/Coupons';
import { Reviews } from './pages/Reviews';
import { Payouts } from './pages/Payouts';
import { Chat } from './pages/Chat';
import { HomepageCMS } from './pages/HomepageCMS';
import { Enquiries } from './pages/Enquiries';
import { ActivityLogs } from './pages/ActivityLogs';
import { Vendors } from './pages/Vendors';
import { LegalCMS } from './pages/LegalCMS';
import { Reports } from './pages/Reports';
import { Newsletter } from './pages/Newsletter';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Products /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Orders /></ProtectedRoute>} />
              <Route path="enquiries" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Enquiries /></ProtectedRoute>} />
              <Route path="coupons" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Coupons /></ProtectedRoute>} />
              <Route path="reviews" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Reviews /></ProtectedRoute>} />
              <Route path="payouts" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Payouts /></ProtectedRoute>} />
              <Route path="chat" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Chat /></ProtectedRoute>} />
              <Route path="newsletter" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Newsletter /></ProtectedRoute>} />
              <Route path="cms" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><HomepageCMS /></ProtectedRoute>} />
              <Route path="pages" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><LegalCMS /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'vendor']}><Reports /></ProtectedRoute>} />
              <Route path="vendor/profile" element={<ProtectedRoute allowedRoles={['vendor', 'admin', 'superadmin']}><VendorProfile /></ProtectedRoute>} />
              <Route path="store-profile" element={<ProtectedRoute allowedRoles={['vendor']}><VendorProfile /></ProtectedRoute>} />
              <Route path="vendors" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Vendors /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Users /></ProtectedRoute>} />
              <Route path="activity-logs" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ActivityLogs /></ProtectedRoute>} />
              <Route path="categories" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Categories /></ProtectedRoute>} />
              <Route path="brands" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Brands /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><Settings /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
