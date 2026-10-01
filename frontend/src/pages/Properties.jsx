import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { PropertyCard } from '../components/property/PropertyCard';
import { useWishlist } from '../context/WishlistContext';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Building, 
  SlidersHorizontal,
  Home as HomeIcon,
  ChevronDown,
  Heart
} from 'lucide-react';

export const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites } = useWishlist();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [showSavedOnly, setShowSavedOnly] = useState(searchParams.get('saved') === 'true');

  // Filters State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        city: city || undefined,
        type: type || undefined,
        status: status || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        sortBy,
        sortDir,
        size: 50,
      };

      const data = await propertyService.getProperties(params);
      setProperties(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [city, type, status, bedrooms, sortBy, sortDir]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setType('');
    setStatus('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setSortBy('createdAt');
    setSortDir('desc');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Property Listings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse verified apartments, penthouses, villas, and commercial real estate available for lease.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Top Search Line */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by title, neighborhood, or keyword..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl flex items-center gap-1.5 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </form>

        {/* Multi-Criteria Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* City */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Property Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
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

          {/* Status */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Availability</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="RENTED">Rented</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="">Any</option>
              <option value="1">1+ BHK</option>
              <option value="2">2+ BHK</option>
              <option value="3">3+ BHK</option>
              <option value="4">4+ BHK</option>
              <option value="5">5+ BHK</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Min Price (₹)</label>
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Max Price (₹)</label>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sort & Wishlist Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-2 text-xs text-slate-500 border-t border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <p className="font-semibold text-slate-700">
              Showing <span className="text-indigo-600">
                {showSavedOnly ? properties.filter(p => favorites.includes(p.id)).length : properties.length}
              </span> properties
            </p>

            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                showSavedOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-rose-600 text-rose-600' : 'text-slate-400'}`} />
              <span>Saved Favorites ({favorites.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Sort by:</span>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd);
              }}
              className="px-2 py-1 border border-slate-300 rounded-lg bg-white focus:outline-none text-xs text-slate-700 font-medium"
            >
              <option value="createdAt-desc">Newest Listings</option>
              <option value="createdAt-asc">Oldest Listings</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="bedrooms-desc">Bedrooms: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (showSavedOnly ? properties.filter(p => favorites.includes(p.id)) : properties).length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">
            {showSavedOnly ? 'No Saved Properties' : 'No Properties Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {showSavedOnly
              ? 'You have not added any properties to your favorites yet. Click the heart icon on any listing to save it.'
              : 'Try adjusting your search criteria, price range, or city filter.'}
          </p>
          <button
            onClick={() => {
              if (showSavedOnly) setShowSavedOnly(false);
              else handleResetFilters();
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            {showSavedOnly ? 'View All Properties' : 'Clear All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showSavedOnly ? properties.filter(p => favorites.includes(p.id)) : properties).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};
