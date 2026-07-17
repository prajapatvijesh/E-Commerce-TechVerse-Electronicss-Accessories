import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { store } from './store/store';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Compare } from './pages/Compare';
import { Wishlist } from './pages/Wishlist';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Returns } from './pages/Returns';
import { OrderSuccess } from './pages/OrderSuccess';
import { OrderDetails } from './pages/OrderDetails';
import { VendorStore } from './pages/VendorStore';
import { Vendors } from './pages/Vendors';
import { Offers } from './pages/Offers';
import { About } from './pages/About';
import { CMSPage } from './pages/CMSPage';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { Navigate } from 'react-router-dom';

import { ScrollToTop } from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWidget } from './components/ChatWidget';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <HelmetProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <Router>
                <ScrollToTop />
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="order/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="compare" element={<Compare />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="returns" element={<Returns />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="vendor/:id" element={<VendorStore />} />
                <Route path="offers" element={<Offers />} />
                <Route path="about" element={<About />} />
                <Route path="page/:slug" element={<CMSPage />} />
              </Route>
            </Routes>
            <ChatWidget />
            </Router>
          </QueryClientProvider>
        </Provider>
        </HelmetProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
