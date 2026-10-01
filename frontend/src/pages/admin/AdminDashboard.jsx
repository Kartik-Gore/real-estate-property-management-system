import React, { useState, useEffect, useRef } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { propertyService } from '../../services/propertyService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle,
  AlertCircle,
  CreditCard,
  ArrowUpRight,
  RefreshCw,
  Zap
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [searchPayment, setSearchPayment] = useState('');
  const [notification, setNotification] = useState('');
  const [revenueFlash, setRevenueFlash] = useState(false);
  const prevRevenueRef = useRef(null);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [statsData, usersData, propsData, bookingsData, paymentsData] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getAllUsers(),
        propertyService.getProperties({ size: 100 }),
        bookingService.getAllBookings(),
        paymentService.getAllPayments().catch(() => []),
      ]);

      if (prevRevenueRef.current !== null && statsData?.totalRevenue !== prevRevenueRef.current) {
        setRevenueFlash(true);
        setTimeout(() => setRevenueFlash(false), 2500);
      }
      prevRevenueRef.current = statsData?.totalRevenue;

      setStats(statsData);
      setUsers(usersData || []);
      setProperties(propsData.content || []);
      setBookings(bookingsData || []);
      setPayments(paymentsData || []);
    } catch (err) {
      if (!isBackground) console.error('Failed to load admin dashboard data', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live Auto-Polling every 5 seconds to capture dynamic transactions in real time
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await dashboardService.deleteUser(id);
      setNotification('User deleted successfully.');
      loadData();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await propertyService.deleteProperty(id);
      setNotification('Property deleted successfully.');
      loadData();
    } catch (err) {
      alert('Failed to delete property.');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">System Overview & Governance</h1>
        </div>

        {/* Live Auto-Sync Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Live Transactions Active</span>
          </div>
          <button
            onClick={() => loadData(false)}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Force Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
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

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          subtitle={`${stats?.availableProperties || 0} Available · ${stats?.rentedProperties || 0} Rented`}
          icon={Building2}
          color="indigo"
        />
        <div className={`transition-all duration-500 rounded-3xl ${revenueFlash ? 'ring-4 ring-emerald-400 scale-105 shadow-xl' : ''}`}>
          <StatCard
            title="Total Platform Revenue"
            value={formattedRevenue}
            subtitle={`${payments.length} Completed Transactions`}
            icon={DollarSign}
            color="emerald"
          />
        </div>
        <StatCard
          title="Active Bookings"
          value={stats?.totalBookings || 0}
          subtitle={`${stats?.confirmedBookings || 0} Confirmed · ${stats?.pendingBookings || 0} Pending`}
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Registered Members"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.totalOwners || 0} Owners · ${stats?.totalCustomers || 0} Customers`}
          icon={Users}
          color="amber"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-6 pt-4 gap-6 text-sm font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'properties'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Global Properties ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`pb-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Financial Ledger ({payments.length})
          </button>
        </div>

        {/* Tab 1: Users Table */}
        {activeTab === 'users' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter users by name or email..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">#{u.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            u.role === 'ROLE_ADMIN'
                              ? 'purple'
                              : u.role === 'ROLE_OWNER'
                              ? 'success'
                              : 'primary'
                          }
                        >
                          {u.role?.replace('ROLE_', '')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{u.phoneNumber || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Global Properties */}
        {activeTab === 'properties' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Property Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">#{p.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 max-w-xs truncate">{p.title}</td>
                    <td className="px-4 py-3">{p.city}, {p.state}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default">{p.type}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">
                      ₹{p.price?.toLocaleString('en-IN')} / mo
                    </td>
                    <td className="px-4 py-3">{p.ownerName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'AVAILABLE' ? 'success' : 'warning'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Property Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: System Bookings */}
        {activeTab === 'bookings' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Lease Period</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">#{b.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{b.property?.title}</td>
                    <td className="px-4 py-3">{b.user?.name} ({b.user?.email})</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Financial Ledger & Dynamic Revenue Stream */}
        {activeTab === 'transactions' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Txn ID, Property, or Tenant..."
                  value={searchPayment}
                  onChange={(e) => setSearchPayment(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                Settled Transactions: <span className="text-emerald-700 font-bold">{payments.length}</span> · Total Volume: <span className="text-emerald-700 font-bold">{formattedRevenue}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Property / Booking</th>
                    <th className="px-4 py-3">Payer (Tenant)</th>
                    <th className="px-4 py-3">Landlord (Beneficiary)</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Settlement Date</th>
                    <th className="px-4 py-3 text-right">Amount (₹)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments
                    .filter((p) =>
                      !searchPayment ||
                      p.transactionId?.toLowerCase().includes(searchPayment.toLowerCase()) ||
                      p.propertyTitle?.toLowerCase().includes(searchPayment.toLowerCase()) ||
                      p.customerName?.toLowerCase().includes(searchPayment.toLowerCase()) ||
                      p.customerEmail?.toLowerCase().includes(searchPayment.toLowerCase())
                    )
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{p.transactionId}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 truncate max-w-xs">{p.propertyTitle || `Booking #${p.bookingId}`}</p>
                          <span className="text-[11px] text-slate-400">Ref Booking: #{p.bookingId}</span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{p.customerName || 'Tenant'}</p>
                          <span className="text-[11px] text-slate-400">{p.customerEmail}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">{p.ownerName || 'Verified Owner'}</td>
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
          </div>
        )}
      </div>
    </div>
  );
};
