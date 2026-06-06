'use client';

import { useState, useEffect } from 'react';

export function useDishFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dish_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse dish favorites');
      }
    }
  }, []);

  const toggleFavorite = (dishName: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(dishName);
      const newFavs = isFav ? prev.filter(name => name !== dishName) : [...prev, dishName];
      localStorage.setItem('dish_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (dishName: string) => {
    return favorites.includes(dishName);
  };

  return { favorites, toggleFavorite, isFavorite };
}
