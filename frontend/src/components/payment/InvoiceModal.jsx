import React from 'react';
import { Modal } from '../common/Modal';
import { Printer, CheckCircle2, Building2, ShieldCheck, QrCode } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, booking, payment }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(booking.id).padStart(5, '0')}`;
  const transactionId = payment?.transactionId || `TXN-${booking.id * 876543}`;
  const paymentDate = payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const totalAmount = Number(booking.totalPrice) || 0;
  const baseRent = Math.round(totalAmount * 0.7);
  const securityDeposit = Math.round(totalAmount * 0.2);
  const maintenanceAndTax = totalAmount - baseRent - securityDeposit;

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Lease Receipt & Tax Invoice" size="max-w-3xl">
      <div className="space-y-6 text-slate-800 printable-receipt p-2">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">PRIMEHAVEN</h2>
              <p className="text-xs text-slate-500 font-medium">Verified Property Management & Escrow</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Payment Settled
            </span>
            <p className="text-xs font-bold text-slate-700">Receipt #{invoiceNumber}</p>
            <p className="text-[11px] text-slate-400">Date: {paymentDate}</p>
          </div>
        </div>

        {/* Tenant & Property Overview Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Billed To (Tenant)</span>
            <h4 className="font-bold text-sm text-slate-900 mt-0.5">{booking.customerName || 'Verified Tenant'}</h4>
            <p className="text-slate-500 mt-0.5">{booking.customerEmail}</p>
            <p className="text-slate-500">{booking.customerPhone || '+91 (080) 4000-REAL'}</p>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Property Leased</span>
            <h4 className="font-bold text-sm text-slate-900 mt-0.5 truncate">{booking.propertyTitle}</h4>
            <p className="text-slate-500 mt-0.5">Lease Term: {booking.startDate} to {booking.endDate}</p>
            <p className="text-slate-500">Booking Reference: #{booking.id}</p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Base Residential Lease Fee
                  <span className="block text-[11px] font-normal text-slate-500">Duration: {booking.startDate} to {booking.endDate}</span>
                </td>
                <td className="py-3 px-4 text-slate-600">Rental</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(baseRent)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Security Deposit (Refundable)
                  <span className="block text-[11px] font-normal text-slate-500">Held in PrimeHaven Escrow account</span>
                </td>
                <td className="py-3 px-4 text-slate-600">Deposit</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(securityDeposit)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  Society Maintenance & Digital Verification Stamp
                  <span className="block text-[11px] font-normal text-slate-500">Includes 18% GST</span>
                </td>
                <td className="py-3 px-4 text-slate-600">Fees</td>
                <td className="py-3 px-4 text-right font-bold text-slate-900">{formatCurrency(maintenanceAndTax)}</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan="2" className="py-3.5 px-4 font-bold text-slate-900 text-sm">Total Paid</td>
                <td className="py-3.5 px-4 text-right font-black text-indigo-700 text-base">{formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Transaction Metadata & Signature Stamp */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p><strong className="text-slate-700">Transaction ID:</strong> {transactionId}</p>
            <p><strong className="text-slate-700">Payment Gateway:</strong> {payment?.paymentMethod || 'DIGITAL_CHECKOUT'} (Simulated)</p>
            <p className="text-[11px] text-slate-400">This is a system-generated verified electronic receipt.</p>
          </div>

          <div className="text-center p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70">
            <div className="flex items-center justify-center gap-1 text-indigo-600 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" /> PrimeHaven Escrow
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Digitally Authenticated Stamp</p>
          </div>
        </div>

        {/* Actions Button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};
