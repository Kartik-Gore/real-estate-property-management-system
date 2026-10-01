import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { bookingService } from '../../services/bookingService';
import { Calendar, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BookingModal = ({ isOpen, onClose, property, onBookingSuccess }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split('T')[0];

  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 31);
  const formattedNextMonth = nextMonth.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formattedTomorrow);
  const [endDate, setEndDate] = useState(formattedNextMonth);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const estimatedPrice = ((property?.price || 0) / 30) * days;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await bookingService.createBooking({
        propertyId: property.id,
        startDate,
        endDate,
        specialRequests,
      });
      setSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Book Property Lease">
      {success ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">Booking Request Submitted!</h4>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            Your booking request for <strong>{property?.title}</strong> has been sent to the owner. You can complete payment and track status from your dashboard.
          </p>
          <button
            onClick={handleResetAndClose}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">Selected Property</p>
              <h4 className="text-sm font-bold text-slate-800">{property?.title}</h4>
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                ₹{property?.price?.toLocaleString('en-IN')} / month
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lease Start Date
              </label>
              <input
                type="date"
                min={formattedTomorrow}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lease End Date
              </label>
              <input
                type="date"
                min={startDate || formattedTomorrow}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Requests / Note to Owner
            </label>
            <textarea
              rows="3"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Requesting parking slot, moving in over the weekend..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          {/* Pricing calculation summary */}
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-semibold">{days} days</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-900 pt-1 border-t border-indigo-200/60">
              <span>Estimated Total Lease</span>
              <span>₹{Math.round(estimatedPrice).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Confirm & Request Booking'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
