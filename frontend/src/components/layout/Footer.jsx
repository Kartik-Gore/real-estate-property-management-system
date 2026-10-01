import React from 'react';
import { Building2, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PrimeHaven
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premier destination for renting, leasing, and managing luxury residential and commercial properties with ease.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Properties & Secure Escrow</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-indigo-400 transition-colors">Explore Home</a></li>
              <li><a href="/properties" className="hover:text-indigo-400 transition-colors">Browse Listings</a></li>
              <li><a href="/login" className="hover:text-indigo-400 transition-colors">User Sign In</a></li>
              <li><a href="/register" className="hover:text-indigo-400 transition-colors">Register Account</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Property Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Luxury Penthouses</span></li>
              <li><span className="text-slate-400">Seafront & Garden Villas</span></li>
              <li><span className="text-slate-400">Modern Urban Apartments</span></li>
              <li><span className="text-slate-400">Grade-A Commercial Offices</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Support & Contact</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Capgemini Innovation Hub, Tech City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>+91 (080) 4000-REAL</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>support@primehaven.internal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 PrimeHaven. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for seamless real estate living
          </p>
        </div>
      </div>
    </footer>
  );
};
