import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@techverse/ui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/slices/cartSlice';
import { DummyRazorpayPopup } from '../components/DummyRazorpayPopup';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const Checkout: React.FC = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [amountToPay, setAmountToPay] = useState(0);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const orderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const res = await axios.post('/api/orders', orderData, config);
      return res.data;
    },
    onSuccess: async (data) => {
      dispatch(clearCart());

      if (paymentMethod === 'Razorpay') {
        setCreatedOrderId(data.data._id);
        setAmountToPay(data.data.totalPrice || itemsPrice - discountAmount + 0 + Number((0.15 * (itemsPrice - discountAmount)).toFixed(2)));
        setShowRazorpay(true);
        return; // Wait for popup
      }
      
      alert('Order placed successfully!');
      navigate('/order/success');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const validateCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await axios.post('/api/coupons/validate', { code, purchaseAmount: itemsPrice }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      const coupon = data.data;
      setAppliedCoupon(coupon);
      let calculatedDiscount = 0;
      if (coupon.discountType === 'percentage') {
        calculatedDiscount = (itemsPrice * coupon.discountValue) / 100;
      } else {
        calculatedDiscount = coupon.discountValue;
      }
      setDiscountAmount(calculatedDiscount);
      alert('Coupon applied successfully!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Invalid coupon');
      setDiscountAmount(0);
      setAppliedCoupon(null);
    }
  });

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    validateCouponMutation.mutate(couponCode);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    const shippingPrice = 0; // Free shipping
    const taxPrice = Number((0.15 * (itemsPrice - discountAmount)).toFixed(2)); // 15% dummy tax on discounted price
    const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

    const cleanedCartItems = cartItems.map(item => ({
      ...item,
      vendor: typeof item.vendor === 'object' ? (item.vendor as any)?._id : (item.vendor || '60d5ec49f1b2c8b1f8e4b3a1') // fallback to dummy vendor if missing
    }));

    orderMutation.mutate({
      orderItems: cleanedCartItems,
      shippingAddress: {
        fullName,
        street: address,
        city,
        state,
        zipCode,
        country,
        phone,
      },
      paymentMethod: paymentMethod === 'Stripe' ? 'Stripe' : paymentMethod === 'Razorpay' ? 'Razorpay' : paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      coupon: appliedCoupon?._id,
      discountAmount
    });
  };

  const handleRazorpaySuccess = async (paymentId: string) => {
    setShowRazorpay(false);
    if (!createdOrderId) return;
    try {
      await axios.put(`/api/orders/${createdOrderId}/pay`, {
        id: paymentId,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: user?.email
      }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      navigate('/order/success');
    } catch (err) {
      alert('Failed to update payment status on server.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {showRazorpay && (
        <DummyRazorpayPopup 
          amount={amountToPay} 
          onSuccess={handleRazorpaySuccess} 
          onClose={() => {
            setShowRazorpay(false);
            navigate('/order/success'); // User closed, order is unpaid
          }} 
        />
      )}
      <h1 className="text-3xl font-bold dark:text-white">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Shipping Form */}
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
            <h2 className="text-xl font-semibold dark:text-white mb-4">Shipping Address</h2>
            <form className="space-y-4" onSubmit={submitHandler}>
              <Input 
                label="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
              <Input 
                label="Street Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="City" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  required 
                />
                <Input 
                  label="State/Province" 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="ZIP/Postal Code" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)} 
                  required 
                />
                <Input 
                  label="Country" 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  required 
                />
              </div>
              <Input 
                label="Phone Number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700">
            <h2 className="text-xl font-semibold dark:text-white mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 text-sm dark:text-gray-300">
                <input 
                  type="radio" 
                  value="Razorpay" 
                  checked={paymentMethod === 'Razorpay'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <span>Razorpay (Cards, UPI, Netbanking)</span>
              </label>
              <label className="flex items-center space-x-3 text-sm dark:text-gray-300">
                <input 
                  type="radio" 
                  value="Cash on Delivery (COD)" 
                  checked={paymentMethod === 'Cash on Delivery (COD)'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <span>Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 h-fit">
          <h2 className="text-xl font-bold dark:text-white mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-6 border-b border-gray-100 dark:border-dark-700 pb-6">
            {cartItems.map((item) => (
               <div key={item.product} className="flex justify-between">
                 <span className="truncate pr-4">{item.qty} x {item.name}</span>
                 <span className="font-medium">₹{(item.qty * item.price).toFixed(2)}</span>
               </div>
            ))}
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold dark:text-white">
                ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold dark:text-white">Free</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 dark:border-dark-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>₹{(itemsPrice - discountAmount + 0 + Number((0.15 * (itemsPrice - discountAmount)).toFixed(2))).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="text-sm font-medium dark:text-white mb-2 block">Discount Code</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code" 
                className="w-full px-3 py-2 border rounded-md dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <Button variant="outline" type="button" onClick={() => {
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                  setCouponCode('');
                }}>Remove</Button>
              ) : (
                <Button variant="outline" type="button" onClick={handleApplyCoupon} disabled={!couponCode || validateCouponMutation.isPending}>
                  {validateCouponMutation.isPending ? '...' : 'Apply'}
                </Button>
              )}
            </div>
          </div>
          <Button variant="primary" className="w-full mt-6" size="lg" onClick={submitHandler} disabled={orderMutation.isPending}>
            {orderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
