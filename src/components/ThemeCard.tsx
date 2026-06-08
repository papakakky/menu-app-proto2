'use client';

import { useState, useEffect } from 'react';
import type { ThemeProposal } from '@/types';
import { Loader2 } from 'lucide-react';
import styles from './ThemeCard.module.css';

interface ThemeCardProps {
  theme: ThemeProposal;
  onDecide: (theme: ThemeProposal) => void;
  onEdit: (theme: ThemeProposal) => void;
}

export default function ThemeCard({ theme, onDecide, onEdit }: ThemeCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      try {
        const res = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagePrompt: theme.imagePrompt })
        });
        const data = await res.json();
        if (isMounted) {
          setImageUrl(data.imageUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setIsImageLoading(false);
        }
      }
    };
    
    if (!theme.imageUrl) {
      setIsImageLoading(true);
      fetchImage();
    } else {
      setImageUrl(theme.imageUrl);
      setIsImageLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [theme]);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {isImageLoading && (
          <div className={styles.placeholder}>
            <Loader2 className={styles.spinner} size={32} />
            <p>AIシェフがスケッチ中...</p>
          </div>
        )}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Theme Illustration" 
            className={`${styles.image} ${!isImageLoading ? styles.loaded : ''}`}
            onLoad={() => setIsImageLoading(false)}
          />
        )}
        
        <div className={styles.textOverlay}>
          <h2 className={styles.themeTitle}>{theme.themeTitle}</h2>
          <p className={styles.themeDescription}>{theme.themeDescription}</p>
          
          <div className={styles.menuDetails}>
            <p><strong>主菜:</strong> <span className={styles.menuItemName}>{theme.menu.main.name}</span></p>
            {theme.menu.side1 && <p><strong>副菜:</strong> <span className={styles.menuItemName}>{theme.menu.side1.name}</span></p>}
            {theme.menu.side2 && <p><strong>副菜:</strong> <span className={styles.menuItemName}>{theme.menu.side2.name}</span></p>}
            {theme.menu.soup && <p><strong>汁物:</strong> <span className={styles.menuItemName}>{theme.menu.soup.name}</span></p>}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={`${styles.primaryBtn} tap-effect`} onClick={() => onDecide(theme)}>
          そのまま作る
        </button>
        <button className={`${styles.secondaryBtn} tap-effect`} onClick={() => onEdit(theme)}>
          アレンジ / 対話
        </button>
      </div>
    </div>
  );
}
