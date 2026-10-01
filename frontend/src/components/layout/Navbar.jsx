import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { 
  Building2, 
  Home, 
  Search, 
  LayoutDashboard, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Shield, 
  Briefcase, 
  Compass,
  Heart
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isOwner } = useAuth();
  const { favoriteCount } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel bg-white/90 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-800 bg-clip-text text-transparent">
                  PrimeHaven
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Property Management
                </span>
              </div>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-2">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-indigo-600 bg-indigo-50/80' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4 mr-1.5" />
                Home
              </Link>
              <Link
                to="/properties"
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/properties') && !location.search.includes('saved=true')
                    ? 'text-indigo-600 bg-indigo-50/80'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4 mr-1.5" />
                Browse Properties
              </Link>
              <Link
                to="/properties?saved=true"
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  location.search.includes('saved=true')
                    ? 'text-rose-600 bg-rose-50/80'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1.5 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Saved</span>
                {favoriteCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {favoriteCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    Admin Panel
                  </Link>
                )}

                {isOwner && !isAdmin && (
                  <Link
                    to="/owner/dashboard"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      location.pathname.startsWith('/owner')
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 mr-1" />
                    Owner Dashboard
                  </Link>
                )}

                {!isAdmin && !isOwner && (
                  <Link
                    to="/customer/dashboard"
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      location.pathname.startsWith('/customer')
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 mr-1" />
                    My Portal
                  </Link>
                )}

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-semibold text-xs overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <span className="block text-xs font-semibold text-slate-800">{user?.name}</span>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      {user?.role?.replace('ROLE_', '')}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Home className="w-4 h-4 mr-2" /> Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Search className="w-4 h-4 mr-2" /> Browse Properties
          </Link>
          <Link
            to="/properties?saved=true"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <div className="flex items-center">
              <Heart className={`w-4 h-4 mr-2 ${favoriteCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> Saved Favorites
            </div>
            {favoriteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                {favoriteCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-50"
                >
                  <Shield className="w-4 h-4 mr-2" /> Admin Panel
                </Link>
              )}
              {isOwner && (
                <Link
                  to="/owner/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> Owner Dashboard
                </Link>
              )}
              {!isAdmin && !isOwner && (
                <Link
                  to="/customer/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50"
                >
                  <Compass className="w-4 h-4 mr-2" /> My Portal
                </Link>
              )}
              <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-lg">
                <span className="font-semibold">{user?.name}</span>
                <button onClick={handleLogout} className="text-rose-600 font-medium">Sign Out</button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
