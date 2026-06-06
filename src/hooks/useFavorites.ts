'use client';

import { useState, useEffect } from 'react';
import { Menu } from '@/types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Menu[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('menu_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites');
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleFavorite = (menu: Menu) => {
    setFavorites(prev => {
      const isFav = prev.some(m => m.id === menu.id);
      const newFavs = isFav ? prev.filter(m => m.id !== menu.id) : [...prev, menu];
      localStorage.setItem('menu_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const isFavorite = (menuId: string) => {
    return favorites.some(m => m.id === menuId);
  };

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
