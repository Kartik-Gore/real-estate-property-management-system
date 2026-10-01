import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { inquiryService } from '../../services/inquiryService';
import { paymentService } from '../../services/paymentService';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { PaymentModal } from '../../components/payment/PaymentModal';
import { InvoiceModal } from '../../components/payment/InvoiceModal';
import { 
  Compass, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  User, 
  Save, 
  AlertCircle,
  Building,
  Receipt,
  FileText
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // Payment & Invoice Modal state
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const [bookingsData, inqData, payData] = await Promise.all([
        bookingService.getMyBookings(),
        inquiryService.getMyInquiries(),
        paymentService.getMyPayments().catch(() => []),
      ]);

      setBookings(bookingsData || []);
      setInquiries(inqData || []);
      setPayments(payData || []);
    } catch (err) {
      console.error('Failed to load customer data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(id);
      setNotification('Booking cancelled.');
      loadCustomerData();
    } catch (err) {
      alert('Failed to cancel booking.');
    }
  };

  const handleOpenPayment = (booking) => {
    setSelectedBookingForPayment(booking);
    setIsPaymentModalOpen(true);
  };

  const handleOpenInvoice = (booking) => {
    setSelectedBookingForInvoice(booking);
    setIsInvoiceModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, phoneNumber, address });
      setNotification('Profile details updated successfully!');
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const totalSpent = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const formattedTotalSpent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalSpent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Tenant & Customer Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {user?.name}</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your active leases, inquiries, and payments.</p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-800 font-bold">×</button>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Property Bookings"
          value={bookings.length}
          subtitle={`${bookings.filter(b => b.status === 'CONFIRMED').length} Confirmed Leases`}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Total Paid to Date"
          value={formattedTotalSpent}
          subtitle={`${payments.length} Completed Transactions`}
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Inquiries & Messages"
          value={inquiries.length}
          subtitle={`${inquiries.filter(i => i.status === 'REPLIED').length} Owner Responses`}
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'inquiries'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile & Account
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6 overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                You have not made any property bookings yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Lease Dates</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Owner Details</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{b.property?.title}</p>
                        <p className="text-[11px] text-slate-400">{b.property?.city}, {b.property?.address}</p>
                      </td>
                      <td className="px-4 py-3">{b.startDate} to {b.endDate}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        ₹{b.totalPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">{b.property?.ownerName}</p>
                        <p className="text-[11px] text-slate-400">{b.property?.ownerEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            b.status === 'CONFIRMED'
                              ? 'success'
                              : b.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleOpenInvoice(b)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-xs shadow-sm transition-colors"
                            title="View Official Lease Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Receipt</span>
                          </button>
                        )}
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => handleOpenPayment(b)}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm"
                          >
                            Pay & Confirm
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && b.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="p-6 space-y-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                You have not submitted any inquiries yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] text-slate-400">
                        Inquiry #{inq.id} · {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-0.5">{inq.subject}</h4>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                        Property: {inq.property?.title} ({inq.property?.city})
                      </p>
                    </div>
                    <Badge variant={inq.status === 'REPLIED' ? 'success' : 'warning'}>
                      {inq.status === 'REPLIED' ? 'Answered' : 'Pending Reply'}
                    </Badge>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <p className="font-semibold text-slate-500 mb-1">Your Question:</p>
                    <p>{inq.message}</p>
                  </div>

                  {inq.response ? (
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                      <p className="font-bold text-emerald-800 mb-1">Owner Response:</p>
                      <p className="leading-relaxed">{inq.response}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      The owner has not responded to this inquiry yet.
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-lg">
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-100 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedBookingForPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedBookingForPayment(null);
          }}
          booking={selectedBookingForPayment}
          onPaymentSuccess={() => {
            loadCustomerData();
          }}
        />
      )}

      {/* Invoice Modal */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedBookingForInvoice(null);
          }}
          booking={selectedBookingForInvoice}
          payment={payments.find((p) => p.bookingId === selectedBookingForInvoice?.id)}
        />
      )}
    </div>
  );
};
