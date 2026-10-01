import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Sparkles, Heart } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useWishlist } from '../../context/WishlistContext';

export const PropertyCard = ({ property }) => {
  const { isFavorite, toggleFavorite } = useWishlist();
  const favorited = isFavorite(property.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">Available</Badge>;
      case 'RENTED':
        return <Badge variant="warning">Rented</Badge>;
      case 'SOLD':
        return <Badge variant="danger">Sold</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge(property.status)}
          {property.featured && (
            <Badge variant="purple" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-purple-500" /> Featured
            </Badge>
          )}
        </div>

        {/* Wishlist Button & Type Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant="default" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
            {property.type}
          </Badge>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              favorited
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
            title={favorited ? 'Remove from Saved' : 'Save to Favorites'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-slate-900/90 text-white px-3 py-1 rounded-lg font-bold text-lg backdrop-blur-sm shadow-md">
            {formattedPrice}
            <span className="text-xs font-normal text-slate-300"> / mo</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          {/* Spec details */}
          <div className="grid grid-cols-3 gap-2 py-3 mt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Square className="w-4 h-4 text-slate-400" />
              <span>{property.areaSqFt} sqft</span>
            </div>
          </div>

          {/* Action */}
          <Link
            to={`/properties/${property.id}`}
            className="w-full mt-2 block text-center py-2 px-4 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            View Details & Book
          </Link>
        </div>
      </div>
    </div>
  );
};
