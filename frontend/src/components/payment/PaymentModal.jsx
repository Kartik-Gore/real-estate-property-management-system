import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { paymentService } from '../../services/paymentService';
import { CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [upiId, setUpiId] = useState('alex@okaxis');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(booking?.totalPrice || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await paymentService.processPayment({
        bookingId: booking.id,
        amount: booking.totalPrice,
        paymentMethod,
      });

      setPaymentResult(response);
      setSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed. Please check details and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setError('');
    setPaymentResult(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Complete Lease Payment">
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-slate-800">Payment Successful!</h4>
          <p className="text-xs text-slate-500 mt-1">Transaction ID: <strong>{paymentResult?.transactionId}</strong></p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 my-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-600">Property:</span>
              <span className="font-semibold text-slate-800">{booking?.property?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount Paid:</span>
              <span className="font-bold text-emerald-700">{formattedAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Booking Status:</span>
              <span className="font-bold text-emerald-600">CONFIRMED</span>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="mt-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Summary Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Amount Payable</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-0.5">{formattedAmount}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{booking?.property?.title}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Dates: {booking?.startDate} to {booking?.endDate}</p>
              <p className="font-medium text-slate-700 mt-1">Booking #{booking?.id}</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1.5 text-indigo-600" />
                Cards
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-1.5 text-emerald-600" />
                UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 mb-1.5 text-purple-600" />
                NetBanking
              </button>
            </div>
          </div>

          {/* Dynamic input fields based on method */}
          {paymentMethod === 'CREDIT_CARD' && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry MM/YY</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    maxLength="4"
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'UPI' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {paymentMethod === 'NET_BANKING' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Select Bank</label>
              <select className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>State Bank of India</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          <div className="flex items-center text-[11px] text-slate-500 justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Sandbox Gateway</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Processing...' : `Pay ${formattedAmount} & Confirm`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
