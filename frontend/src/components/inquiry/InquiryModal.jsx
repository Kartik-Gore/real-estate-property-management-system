import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { inquiryService } from '../../services/inquiryService';
import { MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export const InquiryModal = ({ isOpen, onClose, property, onInquirySuccess }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await inquiryService.createInquiry({
        propertyId: property.id,
        subject,
        message,
      });
      setSuccess(true);
      if (onInquirySuccess) {
        onInquirySuccess(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setSubject('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResetAndClose} title="Send Inquiry to Property Owner">
      {success ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">Inquiry Sent Successfully!</h4>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            The property owner has received your inquiry and will respond back directly. You can review discussions in your dashboard.
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

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Inquiring about</p>
            <h4 className="text-sm font-bold text-slate-800">{property?.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Owner: <strong>{property?.ownerName || 'Property Owner'}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject / Topic
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="e.g. Question about maintenance fees, pet policies, viewing times..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Type your questions or schedule inquiry details here..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
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
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
