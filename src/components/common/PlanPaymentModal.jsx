// PlanPaymentModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PlanPaymentModal = ({ isOpen, onClose, plan, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/payments/create-order`,
        { planId: plan._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        toast.error('Failed to create order');
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, keyId, subscriptionId } = orderResponse.data;

      // Razorpay options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'Astro Guide',
        description: `${plan.name} Plan Subscription`,
        order_id: orderId,
        handler: async (response) => {
          // Verify payment
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/payments/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: subscriptionId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful! Plan activated.');
              onSuccess();
              onClose();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.log(error);
          }
          setLoading(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: '#dc2626'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full p-6"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-red-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Confirm Your Plan</h2>
          <p className="text-gray-600 mt-2">Complete payment to activate your plan</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Plan:</span>
            <span className="font-semibold">{plan.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{plan.duration}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Amount:</span>
            <span className="text-xl font-bold text-red-600">₹{plan.sellingPrice || plan.price}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${plan.sellingPrice || plan.price}`
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 text-gray-500 hover:text-gray-700 transition"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default PlanPaymentModal;