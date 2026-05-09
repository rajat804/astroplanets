import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTicket, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { validateCoupon } from '../services/api';
import toast from 'react-hot-toast';

const CouponInput = ({ orderAmount, productIds, onApply, onRemove, appliedCoupon }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setLoading(true);
    setValidating(true);
    
    try {
      const result = await validateCoupon(code, orderAmount, productIds);
      if (result.valid) {
        onApply(result.coupon);
        toast.success(`Coupon applied! You saved ₹${result.coupon.discountAmount}`);
        setCode('');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Invalid coupon code');
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <div className="mt-4">
      {appliedCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineTicket className="w-5 h-5 text-green-600" />
            <div>
              <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
              <p className="text-xs text-green-600">
                {appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}% off` 
                  : `₹${appliedCoupon.discountValue} off`}
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 text-green-600 hover:text-red-600 transition"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={loading}
          />
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Apply'
            )}
          </button>
        </div>
      )}
      
      <AnimatePresence>
        {validating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-gray-500"
          >
            Validating coupon...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponInput;