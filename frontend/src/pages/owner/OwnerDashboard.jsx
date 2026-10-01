import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { propertyService } from '../../services/propertyService';
import { bookingService } from '../../services/bookingService';
import { inquiryService } from '../../services/inquiryService';
import { paymentService } from '../../services/paymentService';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Send, 
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
  CreditCard,
  RefreshCw
} from 'lucide-react';

export const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [revenueFlash, setRevenueFlash] = useState(false);
  const prevRevenueRef = useRef(null);

  // Add/Edit Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'APARTMENT',
    status: 'AVAILABLE',
    address: '',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    imageUrl: '',
    featured: false,
  });

  // Reply Inquiry Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadOwnerData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [statsData, propsData, bookingsData, inqData, paymentsData] = await Promise.all([
        dashboardService.getOwnerStats().catch(() => null),
        propertyService.getMyProperties(),
        bookingService.getOwnerBookings(),
        inquiryService.getOwnerInquiries(),
        paymentService.getOwnerPayments().catch(() => []),
      ]);

      if (prevRevenueRef.current !== null && statsData?.totalRevenue !== prevRevenueRef.current) {
        setRevenueFlash(true);
        setTimeout(() => setRevenueFlash(false), 2500);
      }
      prevRevenueRef.current = statsData?.totalRevenue;

      setStats(statsData);
      setProperties(propsData || []);
      setBookings(bookingsData || []);
      setInquiries(inqData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      if (!isBackground) console.error('Failed to load owner data', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
    // Live Auto-Polling every 5 seconds to update earnings dynamically
    const interval = setInterval(() => {
      loadOwnerData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAddModal = () => {
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      description: '',
      price: '',
      type: 'APARTMENT',
      status: 'AVAILABLE',
      address: '',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
      featured: false,
    });
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropertyId(prop.id);
    setPropertyForm({
      title: prop.title,
      description: prop.description,
      price: prop.price,
      type: prop.type,
      status: prop.status,
      address: prop.address,
      city: prop.city,
      state: prop.state,
      zipCode: prop.zipCode,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      areaSqFt: prop.areaSqFt,
      imageUrl: prop.imageUrl,
      featured: prop.featured,
    });
    setIsPropertyModalOpen(true);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    try {
      if (editingPropertyId) {
        await propertyService.updateProperty(editingPropertyId, propertyForm);
        setNotification('Property listing updated successfully!');
      } else {
        await propertyService.createProperty(propertyForm);
        setNotification('New property listed successfully!');
      }
      setIsPropertyModalOpen(false);
      loadOwnerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save property.');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to remove this property listing?')) return;
    try {
      await propertyService.deleteProperty(id);
      setNotification('Property listing removed.');
      loadOwnerData();
    } catch (err) {
      alert('Failed to delete property.');
    }
  };

  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      await bookingService.updateBookingStatus(id, newStatus);
      setNotification(`Booking marked as ${newStatus}.`);
      loadOwnerData();
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleOpenReplyModal = (inq) => {
    setSelectedInquiry(inq);
    setReplyText(inq.response || '');
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    try {
      await inquiryService.replyToInquiry(selectedInquiry.id, replyText);
      setNotification('Reply submitted to customer successfully!');
      setIsReplyModalOpen(false);
      loadOwnerData();
    } catch (err) {
      alert('Failed to send reply.');
    }
  };

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(stats?.totalRevenue || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Property Owner / Host Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Owner Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Auto-Sync Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Revenue Sync</span>
          </div>

          <button
            onClick={() => loadOwnerData(false)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:gap-2.5"
          >
            <Plus className="w-4 h-4" />
            Add New Property
          </button>
        </div>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Listed Properties"
          value={properties.length}
          subtitle={`${properties.filter(p => p.status === 'AVAILABLE').length} Available now`}
          icon={Building2}
          color="indigo"
        />
        <div className={`transition-all duration-500 rounded-3xl ${revenueFlash ? 'ring-4 ring-emerald-400 scale-105 shadow-xl' : ''}`}>
          <StatCard
            title="Total Rental Revenue"
            value={formattedRevenue}
            subtitle={`${payments.length} Settled Payments`}
            icon={DollarSign}
            color="emerald"
          />
        </div>
        <StatCard
          title="Lease Bookings"
          value={bookings.length}
          subtitle={`${bookings.filter(b => b.status === 'PENDING').length} Pending approval`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Customer Inquiries"
          value={inquiries.length}
          subtitle={`${inquiries.filter(i => i.status === 'OPEN').length} Unread inquiries`}
          icon={MessageSquare}
          color="amber"
        />
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Listings ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Booking Requests ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Inquiries Inbox ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'earnings'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Earnings & Payouts ({payments.length})
          </button>
        </div>

        {/* Tab 1: Properties Table */}
        {activeTab === 'properties' && (
          <div className="p-6 overflow-x-auto">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700">No properties listed yet</h4>
                <p className="text-xs text-slate-400 mt-1">Start by adding your first real estate listing.</p>
                <button
                  onClick={handleOpenAddModal}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Monthly Rent</th>
                    <th className="px-4 py-3">Bed / Bath</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                            alt={p.title}
                            className="w-12 h-10 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                            <p className="text-[11px] text-slate-400">ID #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="default">{p.type}</Badge>
                      </td>
                      <td className="px-4 py-3">{p.city}, {p.state}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">{p.bedrooms}B / {p.bathrooms}B</td>
                      <td className="px-4 py-3">
                        <Badge variant={p.status === 'AVAILABLE' ? 'success' : 'warning'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Bookings Management */}
        {activeTab === 'bookings' && (
          <div className="p-6 overflow-x-auto">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No booking requests received yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Tenant Name</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Total Lease</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">#{b.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{b.property?.title}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{b.user?.name}</p>
                        <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                      </td>
                      <td className="px-4 py-3">{b.startDate} to {b.endDate}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">
                        ₹{b.totalPrice?.toLocaleString('en-IN')}
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
                      <td className="px-4 py-3 text-right space-x-1">
                        {b.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Approve Booking"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Reject Booking"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Inquiries Inbox */}
        {activeTab === 'inquiries' && (
          <div className="p-6 space-y-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No customer inquiries received yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={inq.status === 'OPEN' ? 'warning' : 'success'}>
                          {inq.status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{inq.subject}</h4>
                      <p className="text-xs text-indigo-600 font-semibold">
                        Property: {inq.property?.title}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenReplyModal(inq)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {inq.response ? 'Update Reply' : 'Reply'}
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800 mb-0.5">From: {inq.user?.name} ({inq.user?.email})</p>
                    <p className="text-slate-600">{inq.message}</p>
                  </div>

                  {inq.response && (
                    <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <p className="font-semibold mb-0.5">Your Response:</p>
                      <p>{inq.response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Earnings & Payouts */}
        {activeTab === 'earnings' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>Total Credited Payments: <strong className="text-emerald-700 font-bold">{payments.length}</strong></span>
              <span>Accumulated Rental Volume: <strong className="text-emerald-700 font-bold">{formattedRevenue}</strong></span>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No rental transactions have been credited yet. When a customer completes a lease payment for your property, it will appear here automatically in real time.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Transaction ID</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Tenant Name</th>
                      <th className="px-4 py-3">Payment Method</th>
                      <th className="px-4 py-3">Payout Date</th>
                      <th className="px-4 py-3 text-right">Net Credit (₹)</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{p.transactionId}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 truncate max-w-xs">
                          {p.propertyTitle || `Booking #${p.bookingId}`}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{p.customerName || 'Tenant'}</p>
                          <span className="text-[11px] text-slate-400">{p.customerEmail}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            <CreditCard className="w-3 h-3 text-indigo-600" />
                            {p.paymentMethod?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Just now'}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-emerald-700 text-sm">
                          ₹{p.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="success">
                            {p.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Property Modal */}
      <Modal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        title={editingPropertyId ? 'Edit Property Listing' : 'Add New Property Listing'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Property Title</label>
            <input
              type="text"
              required
              value={propertyForm.title}
              onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
              placeholder="e.g. Skyline 3BHK Penthouse with Deck"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              required
              value={propertyForm.description}
              onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
              placeholder="Provide key features, view, furnishing details..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Monthly Price (₹)</label>
              <input
                type="number"
                required
                value={propertyForm.price}
                onChange={(e) => setPropertyForm({ ...propertyForm, price: e.target.value })}
                placeholder="45000"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Type</label>
              <select
                value={propertyForm.type}
                onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="PENTHOUSE">Penthouse</option>
                <option value="HOUSE">House</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="STUDIO">Studio</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={propertyForm.status}
                onChange={(e) => setPropertyForm({ ...propertyForm, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="RENTED">RENTED</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={propertyForm.city}
                onChange={(e) => setPropertyForm({ ...propertyForm, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={propertyForm.state}
                onChange={(e) => setPropertyForm({ ...propertyForm, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Address Line</label>
              <input
                type="text"
                required
                value={propertyForm.address}
                onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={propertyForm.bedrooms}
                onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={propertyForm.bathrooms}
                onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area (Sq. Ft)</label>
              <input
                type="number"
                value={propertyForm.areaSqFt}
                onChange={(e) => setPropertyForm({ ...propertyForm, areaSqFt: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              value={propertyForm.imageUrl}
              onChange={(e) => setPropertyForm({ ...propertyForm, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={propertyForm.featured}
              onChange={(e) => setPropertyForm({ ...propertyForm, featured: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label htmlFor="featured" className="font-semibold text-slate-700">
              Highlight as Featured Property
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPropertyModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30"
            >
              {editingPropertyId ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="Respond to Customer Inquiry"
      >
        <form onSubmit={handleSendReply} className="space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-800">{selectedInquiry?.subject}</p>
            <p className="text-slate-600 mt-1">{selectedInquiry?.message}</p>
            <p className="text-[11px] text-slate-400 mt-1">From: {selectedInquiry?.user?.name}</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Response Message</label>
            <textarea
              rows="4"
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply to the customer..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsReplyModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/30"
            >
              Send Response
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
