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
              <div key={item.product} className="flex flex-col sm:flex-row items-center bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 gap-4">
                <div className="w-24 h-24 bg-gray-100 dark:bg-dark-700 rounded-md flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center justify-center h-full">No Img</span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <Link to={`/product/${item.product}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm dark:text-gray-300">Qty: {item.qty}</span>
                  <button 
                    onClick={() => handleRemove(item.product)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 h-fit">
            <h2 className="text-xl font-bold dark:text-white mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="font-semibold dark:text-white">
                  ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold dark:text-white text-green-500">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold dark:text-white">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 dark:border-dark-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-6" size="lg" onClick={checkoutHandler}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
