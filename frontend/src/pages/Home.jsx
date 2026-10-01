import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { dashboardService } from '../services/dashboardService';
import { PropertyCard } from '../components/property/PropertyCard';
import { 
  Search, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Quote,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';

export const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [searchIntent, setSearchIntent] = useState('rent'); // 'rent', 'buy', 'commercial'
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const [featured, publicStats] = await Promise.all([
          propertyService.getFeaturedProperties(),
          dashboardService.getPublicStats().catch(() => null),
        ]);
        setFeaturedProperties(featured || []);
        setStats(publicStats);
      } catch (err) {
        if (!isBackground) console.error('Error loading homepage data', err);
      } finally {
        if (!isBackground) setLoading(false);
      }
    };
    loadHomeData();
    const interval = setInterval(() => {
      loadHomeData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (city) params.append('city', city);
    if (type) {
      params.append('type', type);
    } else if (searchIntent === 'commercial') {
      params.append('type', 'COMMERCIAL');
    }
    navigate(`/properties?${params.toString()}`);
  };

  const citiesList = [
    {
      name: 'Bangalore',
      subtitle: 'Silicon Valley of India',
      listings: '45+ Properties',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600',
    },
    {
      name: 'Mumbai',
      subtitle: 'Financial Capital & Coastline',
      listings: '60+ Properties',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',
    },
    {
      name: 'Hyderabad',
      subtitle: 'Cyberabad & HITEC City',
      listings: '30+ Properties',
      image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?w=600',
    },
    {
      name: 'Pune',
      subtitle: 'Oxford of the East',
      listings: '25+ Properties',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
    },
    {
      name: 'Delhi',
      subtitle: 'National Capital Region',
      listings: '38+ Properties',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',
    },
  ];

  const testimonials = [
    {
      name: 'Aarav Mehta',
      role: 'Software Architect (Tenant)',
      city: 'Bangalore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 5,
      comment: 'Found and leased an ultra-modern 3 BHK in Indiranagar within 48 hours. The zero-brokerage model and direct owner communication made everything effortless.',
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Property Owner & Investor',
      city: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 5,
      comment: 'Managing three penthouse units has never been smoother. Booking approvals, identity verification, and online rental payouts happen seamlessly in one portal.',
    },
    {
      name: 'Neha Singhal',
      role: 'Design Lead (Tenant)',
      city: 'Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 5,
      comment: 'The digital lease checkout with simulated instant payment receipt gave me total peace of mind. Exactly what modern real estate should feel like.',
    },
  ];

  const faqs = [
    {
      q: 'How does the digital lease booking and security deposit work?',
      a: 'Once you choose your dates and submit a booking request, the verified owner reviews and approves it. You then complete the digital checkout, and an official lease invoice with a transaction receipt is automatically generated for your records.',
    },
    {
      q: 'Are all property listings and landlords verified on the platform?',
      a: 'Yes, 100%. Every property undergoes address and title inspection, and all landlord profiles are verified with government-issued credentials and phone verification before publishing.',
    },
    {
      q: 'Can I message the property owner before making a booking deposit?',
      a: 'Absolutely! You can use the "Send Owner Inquiry" button on any property page to ask questions about furnishing, parking, pet policies, or schedule an in-person walkthrough tour.',
    },
    {
      q: 'Are maintenance fees and taxes included in the monthly lease price?',
      a: 'The transparent price breakdown on each listing clearly separates the base monthly rent, estimated society maintenance, security deposit, and applicable service fees so there are no surprises.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative hero-gradient pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
            <span>Discover Your Dream Home & Premium Properties</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Discover, Lease & Manage <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Premium Properties Seamlessly
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The premier marketplace for verified luxury rentals, executive villas, and high-yield commercial spaces across top metropolitan cities.
          </p>

          {/* Search Box with Segmented Tabs */}
          <div className="mt-10 max-w-4xl mx-auto">
            {/* Intent Tabs */}
            <div className="inline-flex p-1 bg-slate-200/70 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
              <button
                type="button"
                onClick={() => setSearchIntent('rent')}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  searchIntent === 'rent'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rent a Home
              </button>
              <button
                type="button"
                onClick={() => setSearchIntent('buy')}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  searchIntent === 'buy'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchIntent('commercial');
                  setType('COMMERCIAL');
                }}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                  searchIntent === 'commercial'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Commercial Spaces
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-left"
            >
              <div className="px-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Location / Keyword
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="City, area or address..."
                    className="w-full text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="px-2 sm:border-l sm:border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm font-medium text-slate-800 bg-transparent focus:outline-none"
                >
                  <option value="">All Cities</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div className="px-2 sm:border-l sm:border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Property Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-sm font-medium text-slate-800 bg-transparent focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="VILLA">Villa</option>
                  <option value="PENTHOUSE">Penthouse</option>
                  <option value="HOUSE">House</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="STUDIO">Studio</option>
                </select>
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:gap-3"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Trust Metrics Counter */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-indigo-600">{stats?.totalProperties || '15+'}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Active Listings</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-emerald-600">{stats?.availableProperties || '12+'}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Ready to Move</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-purple-600">{stats?.totalUsers || '50+'}</p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Verified Members</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-2xl font-black text-amber-600">
                {stats?.totalRevenue
                  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.totalRevenue)
                  : '₹14.8 Lakhs'}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Platform Leased Volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by City Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Prime Locations</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Properties by Metropolitan Hubs
            </h2>
          </div>
          <Link
            to="/properties"
            className="mt-3 sm:mt-0 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            View all cities
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {citiesList.map((c) => (
            <div
              key={c.name}
              onClick={() => navigate(`/properties?city=${c.name}`)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold group-hover:text-indigo-300 transition-colors">{c.name}</h3>
                <p className="text-[11px] text-slate-300 truncate">{c.subtitle}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                  {c.listings}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Handpicked Selections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Real Estate Listings
            </h2>
          </div>
          <Link
            to="/properties"
            className="mt-3 sm:mt-0 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            Explore all listings
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Platform Features / Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Why Choose Us</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Simple, Transparent & Secure Property Management
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
              Experience hassle-free real estate with 100% verified property listings, transparent leasing agreements, direct owner communication, and instant digital payments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <ShieldCheck className="w-8 h-8 text-indigo-400 mb-3" />
                <h4 className="font-bold text-base">Verified Listings</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Every property and owner profile is thoroughly verified to ensure authentic, reliable, and scam-free rentals.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <KeyRound className="w-8 h-8 text-emerald-400 mb-3" />
                <h4 className="font-bold text-base">Instant Booking & Checkout</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule visits, apply for lease contracts, and make secure digital payments with instant receipt generation.
                </p>
              </div>

              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
                <Building2 className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-bold text-base">Direct Owner Chat</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Connect directly with property owners and agents to negotiate terms and ask questions with zero middleman fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer & Owner Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Client Stories</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Trusted by Thousands of Happy Tenants & Landlords
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Read real experiences from residents who found their perfect home and owners who manage properties with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.role} • {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Find Your Next Luxury Home?</h2>
            <p className="text-indigo-100 text-sm">
              Explore handpicked listings, schedule instant in-person tours, and secure your lease online with zero hassle.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/properties"
                className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-slate-50 transition-colors"
              >
                Browse All Properties
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-2xl bg-indigo-500/30 hover:bg-indigo-500/50 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
