'use client';

import React from 'react';
import { Menu } from '@/types';
import { Heart, CookingPot, RefreshCcw, Lightbulb } from 'lucide-react';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  menu: Menu;
  onDecide: (menu: Menu) => void;
  onEdit: (menu: Menu) => void;
  isFavorite: boolean;
  onToggleFavorite: (menu: Menu) => void;
}

export default function MenuCard({ menu, onDecide, onEdit, isFavorite, onToggleFavorite }: MenuCardProps) {
  return (
    <div className={`${styles.card} animate-slide-up`}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{menu.title}</h3>
        <button 
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''} tap-effect`}
          onClick={() => onToggleFavorite(menu)}
          aria-label="お気に入り"
        >
          <Heart fill={isFavorite ? "currentColor" : "none"} size={24} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.dishLine}>
          <span className={styles.dishLabel}>主菜</span>
          <span className={styles.dishName}>{menu.main.name}</span>
        </div>
        {menu.side1 && (
          <div className={styles.dishLine}>
            <span className={styles.dishLabel}>副菜</span>
            <span className={styles.dishName}>{menu.side1.name}</span>
          </div>
        )}
        {menu.side2 && (
          <div className={styles.dishLine}>
            <span className={styles.dishLabel}>副菜</span>
            <span className={styles.dishName}>{menu.side2.name}</span>
          </div>
        )}
        {menu.soup && (
          <div className={styles.dishLine}>
            <span className={styles.dishLabel}>汁物</span>
            <span className={styles.dishName}>{menu.soup.name}</span>
          </div>
        )}
        
        <div className={styles.point}>
          <Lightbulb className={styles.pointIcon} size={18} />
          <span>{menu.point}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          className={`${styles.decideBtn} hover-scale`}
          onClick={() => onDecide(menu)}
        >
          <CookingPot size={20} />
          これを作る！(決定)
        </button>
        <button 
          className={`${styles.editBtn} hover-scale`}
          onClick={() => onEdit(menu)}
        >
          <RefreshCcw size={18} />
          この献立を手直しする
        </button>
      </div>
    </div>
  );
}
