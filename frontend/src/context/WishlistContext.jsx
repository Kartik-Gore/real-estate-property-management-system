import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('realestate_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading wishlist', e);
    }
  }, []);

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(propertyId)) {
        updated = prev.filter((id) => id !== propertyId);
      } else {
        updated = [...prev, propertyId];
      }
      try {
        localStorage.setItem('realestate_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving wishlist', e);
      }
      return updated;
    });
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  return (
    <WishlistContext.Provider value={{ favorites, toggleFavorite, isFavorite, favoriteCount: favorites.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
