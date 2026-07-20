import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, MessageSquare, Bell, Wallet, MessageCircle, MonitorPlay, Activity, FileText, Moon, Sun } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@techverse/ui';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const queryClient = useQueryClient();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return data.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000 // Poll every 30s
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setIsNotificationsOpen(false);
    }
  });

  const unreadCount = notificationsData?.filter((n: any) => !n.isRead).length || 0;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const navItems = user?.role === 'admin' || user?.role === 'superadmin' ? [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: ShoppingBag },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Vendors', path: '/vendors', icon: Users },
    { name: 'Enquiries', path: '/enquiries', icon: MessageSquare },
    { name: 'Coupons', path: '/coupons', icon: ShoppingBag },
    { name: 'Reviews', path: '/reviews', icon: MessageSquare },
    { name: 'Payouts', path: '/payouts', icon: Wallet },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Homepage CMS', path: '/cms', icon: MonitorPlay },
    { name: 'Legal Pages', path: '/pages', icon: FileText },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Newsletter', path: '/newsletter', icon: MessageSquare },
    { name: 'Activity Logs', path: '/activity-logs', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ] : [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Products', path: '/products', icon: ShoppingBag },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Enquiries', path: '/enquiries', icon: MessageSquare },
    { name: 'Coupons', path: '/coupons', icon: ShoppingBag },
    { name: 'Reviews', path: '/reviews', icon: MessageSquare },
    { name: 'Payouts', path: '/payouts', icon: Wallet },
    { name: 'Chat', path: '/chat', icon: MessageCircle },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Store Profile', path: '/store-profile', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 md:relative bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-dark-700">
          {(!(!isSidebarOpen && window.innerWidth >= 768) || isSidebarOpen) && <span className="text-xl font-bold text-primary-600 truncate">TechVerse</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 hidden md:block">
            <Menu size={20} />
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 md:hidden">
            <Menu size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'}`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {(!(!isSidebarOpen && window.innerWidth >= 768) || isSidebarOpen) && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between md:justify-end px-4 md:px-8 z-20 sticky top-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 md:hidden">
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-2 md:space-x-6">
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => markAllAsReadMutation.mutate()}
                        className="text-xs text-primary-600 hover:underline"
                        disabled={markAllAsReadMutation.isPending}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notificationsData?.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                      notificationsData?.map((notification: any) => (
                        <div 
                          key={notification._id} 
                          className={`p-4 border-b border-gray-50 dark:border-dark-700/50 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                          onClick={() => {
                            if (!notification.isRead) markAsReadMutation.mutate(notification._id);
                            if (notification.link) window.location.href = notification.link;
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{notification.title}</span>
                            {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary-600"></span>}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{notification.message}</p>
                          <span className="text-[10px] text-gray-400 mt-2 block">{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="hidden sm:inline text-sm font-medium dark:text-white truncate max-w-[150px]">
              Hello, {user?.name}
            </span>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 px-2 md:px-4" onClick={() => dispatch(logout())}>
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Main section */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-dark-900 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
