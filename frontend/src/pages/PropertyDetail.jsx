import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { BookingModal } from '../components/booking/BookingModal';
import { InquiryModal } from '../components/inquiry/InquiryModal';
import { Badge } from '../components/common/Badge';
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  Building, 
  Sparkles,
  Phone,
  Mail,
  Heart,
  Share2,
  Train,
  ShoppingBag,
  HeartPulse,
  Plane,
  GraduationCap,
  Calculator,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Check
} from 'lucide-react';

export const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite } = useWishlist();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals & UI States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [leaseMonths, setLeaseMonths] = useState(12);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await propertyService.getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details. The listing may have been moved or removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-sm font-medium text-slate-500 mt-4">Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-200">
          <h3 className="font-bold text-lg">Property Not Found</h3>
          <p className="text-sm mt-1">{error || 'This listing does not exist.'}</p>
          <Link
            to="/properties"
            className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [
    property.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
  ];

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price);

  // Calculator figures
  const monthlyRent = Number(property.price) || 0;
  const securityDeposit = monthlyRent * 2;
  const maintenance = 3500;
  const utilityFee = 2000;
  const totalUpfront = securityDeposit + monthlyRent + maintenance + utilityFee;

  const formattedDeposit = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(securityDeposit);
  const formattedMaintenance = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(maintenance);
  const formattedUtility = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(utilityFee);
  const formattedTotalUpfront = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalUpfront);

  const isOwnerOfProperty = user?.id === property.ownerId;
  const favorited = isFavorite(property.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation Bar & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to previous page
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Listing'}</span>
          </button>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              favorited
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:text-rose-500 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-600' : ''}`} />
            <span>{favorited ? 'Saved in Wishlist' : 'Save to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Photo Grid (Airbnb style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 relative bg-slate-900">
        {/* Main large photo */}
        <div
          onClick={() => setSelectedPhotoIndex(0)}
          className="md:col-span-2 relative cursor-pointer overflow-hidden group h-full"
        >
          <img
            src={galleryImages[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={property.status === 'AVAILABLE' ? 'success' : 'warning'}>
              {property.status}
            </Badge>
            <Badge variant="default" className="bg-slate-900/80 text-white backdrop-blur-sm border-transparent">
              {property.type}
            </Badge>
            {property.featured && (
              <Badge variant="purple" className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-purple-500" /> Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Side photo 1 */}
        <div
          onClick={() => setSelectedPhotoIndex(1)}
          className="hidden md:block relative cursor-pointer overflow-hidden group h-full"
        >
          <img
            src={galleryImages[1]}
            alt="Interior view 1"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Side photo 2 & 3 stacked */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <div
            onClick={() => setSelectedPhotoIndex(2)}
            className="relative cursor-pointer overflow-hidden group h-full"
          >
            <img
              src={galleryImages[2]}
              alt="Interior view 2"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div
            onClick={() => setSelectedPhotoIndex(3)}
            className="relative cursor-pointer overflow-hidden group h-full"
          >
            <img
              src={galleryImages[3]}
              alt="Interior view 3"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-xs group-hover:bg-slate-950/20 transition-colors">
              <span>View All 4 Photos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Specs, Description, Calculator, Neighborhood */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Location Header */}
          <div>
            <div className="flex items-center text-sm text-slate-500 mb-1.5">
              <MapPin className="w-4 h-4 mr-1 text-indigo-500 flex-shrink-0" />
              <span>{property.address}, {property.city}, {property.state} {property.zipCode}, {property.country}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </h1>
          </div>

          {/* Key Attributes Spec Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bedrooms</p>
                <p className="text-sm font-bold text-slate-800">{property.bedrooms} BHK</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bathrooms</p>
                <p className="text-sm font-bold text-slate-800">{property.bathrooms} Baths</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Square className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Built Area</p>
                <p className="text-sm font-bold text-slate-800">{property.areaSqFt} sq.ft</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Property Type</p>
                <p className="text-sm font-bold text-slate-800">{property.type}</p>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About this Property</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>24/7 Gated Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>High Speed Fiber Internet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Covered Parking Slot</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Power & Water Backup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>High-Speed Elevators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Swimming Pool & Gym</span>
              </div>
            </div>
          </div>

          {/* Interactive Lease & Upfront Cost Calculator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Transparent Lease Cost Calculator</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Estimated Breakdown</span>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Preferred Lease Duration</label>
              <div className="grid grid-cols-3 gap-3">
                {[6, 12, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLeaseMonths(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      leaseMonths === m
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} Months Lease
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Monthly Base Rent:</span>
                <span className="font-semibold text-slate-900">{formattedPrice} / mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit (2 months):</span>
                <span className="font-semibold text-slate-900">{formattedDeposit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Society Maintenance & Amenities:</span>
                <span className="font-semibold text-slate-900">{formattedMaintenance} / mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Move-in Verification & Digital Stamp Fee:</span>
                <span className="font-semibold text-slate-900">{formattedUtility}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-indigo-700">
                <span>Total Estimated Upfront Payment:</span>
                <span>{formattedTotalUpfront}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Security deposit is 100% refundable upon lease completion according to standard terms.
            </p>
          </div>

          {/* Neighborhood & Commute Guide */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Neighborhood & Transit Guide</h3>
            <p className="text-xs text-slate-500">
              Key hubs and lifestyle amenities located within close proximity to this property:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Metro Station</h4>
                  <p className="text-[11px] text-slate-500">450 meters (5 min walk)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Shopping Mall & Supermarket</h4>
                  <p className="text-[11px] text-slate-500">800 meters (10 min walk)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Super-Specialty Hospital</h4>
                  <p className="text-[11px] text-slate-500">1.4 km (6 min drive)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">International Airport</h4>
                  <p className="text-[11px] text-slate-500">32 km (40 min drive via Expressway)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Booking & Owner Trust Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6 sticky top-24">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Lease Rate</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">{formattedPrice}</span>
                <span className="text-xs font-semibold text-slate-500">/ month</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    disabled={property.status !== 'AVAILABLE' || isOwnerOfProperty}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    {isOwnerOfProperty ? 'You Own this Listing' : property.status === 'AVAILABLE' ? 'Book Lease Now' : 'Property Rented'}
                  </button>

                  <button
                    onClick={() => setIsInquiryOpen(true)}
                    disabled={isOwnerOfProperty}
                    className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                    Send Owner Inquiry
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-colors block text-center"
                  >
                    Sign In to Book or Inquire
                  </Link>
                  <p className="text-[11px] text-center text-slate-400">
                    New user? <Link to="/register" className="text-indigo-600 font-semibold">Create account</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Verified Owner Profile & Trust Badges */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Landlord / Agent</span>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shadow-sm">
                  {property.ownerName?.charAt(0) || 'O'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{property.ownerName}</h4>
                  <div className="flex items-center text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    <span>Govt. ID & RERA Verified</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold">4.9 ★ Super Host</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>&lt; 15 min reply</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{property.ownerEmail}</span>
                </div>
                {property.ownerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{property.ownerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full flex items-center justify-center">
            <button
              onClick={() => setSelectedPhotoIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={galleryImages[selectedPhotoIndex]}
              alt={`Photo view ${selectedPhotoIndex + 1}`}
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              onClick={() => setSelectedPhotoIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedPhotoIndex(i)}
                className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                  selectedPhotoIndex === i ? 'border-indigo-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        property={property}
        onBookingSuccess={() => {}}
      />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        property={property}
      />
    </div>
  );
};
