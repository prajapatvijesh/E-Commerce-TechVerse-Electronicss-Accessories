import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@techverse/ui';
import { Trash2 } from 'lucide-react';
import { RootState } from '../store/store';
import { removeFromCart } from '../store/slices/cartSlice';

export const Cart: React.FC = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold dark:text-white">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-dark-800 rounded-xl p-12 border border-gray-100 dark:border-dark-700 text-center">
          <p className="text-gray-500 mb-6 text-lg">Your cart is empty.</p>
          <Link to="/shop">
            <Button variant="primary" size="lg">Go Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="flex flex-col sm:flex-row items-center bg-white/70 backdrop-blur-md dark:bg-dark-800/70 p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] border border-white/40 dark:border-dark-700/50 gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all">
                <div className="w-28 h-28 bg-gray-50 dark:bg-dark-900/50 rounded-xl flex-shrink-0 overflow-hidden mix-blend-multiply dark:mix-blend-normal">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Img</span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.product}`} className="font-bold text-lg text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-xl font-extrabold text-primary-600 dark:text-primary-400 mt-2">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col sm:items-end space-y-3">
                  <span className="text-sm font-medium bg-gray-100 dark:bg-dark-700 px-3 py-1 rounded-lg dark:text-gray-300">Qty: {item.qty}</span>
                  <button 
                    onClick={() => handleRemove(item.product)}
                    className="text-red-500 hover:text-white hover:bg-red-500 transition-colors p-2 rounded-lg group"
                    title="Remove Item"
                  >
                    <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-xl dark:bg-dark-800/80 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/40 dark:border-dark-700/50 h-fit sticky top-28">
            <h2 className="text-2xl font-bold dark:text-white mb-8 tracking-tight">Order Summary</h2>
            <div className="space-y-5 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <span className="font-medium">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Shipping</span>
                <span className="font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Tax</span>
                <span className="font-semibold text-gray-900 dark:text-white">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200/50 dark:border-dark-700/50 pt-6 mt-6 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-8 rounded-2xl h-14 text-lg shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all" size="lg" onClick={checkoutHandler}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
