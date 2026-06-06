'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Settings, Loader2 } from 'lucide-react';
import type { Menu as MenuType } from '@/types';
import MenuCard from '@/components/MenuCard';
import IngredientModal from '@/components/IngredientModal';
import { useFavorites } from '@/hooks/useFavorites';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<MenuType | null>(null);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: '' })
        });
        const data = await res.json();
        setMenus(data.menus || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleDecide = (menu: MenuType) => {
    localStorage.setItem('current_menu', JSON.stringify(menu));
    router.push('/cooking');
  };

  const handleEdit = (menu: MenuType) => {
    setEditingMenu(menu);
  };

  const handleModalSubmit = (text: string, ingredients?: string[]) => {
    let message = text;
    if (ingredients && ingredients.length > 0) {
      message = `家にある「${ingredients.join('、')}」を使って手直ししてほしい。`;
    }
    
    localStorage.setItem('chat_base_menu', JSON.stringify(editingMenu));
    localStorage.setItem('chat_initial_message', message);
    router.push('/chat');
  };

  return (
    <>
      <header className={styles.header}>
        <button className={`${styles.iconBtn} tap-effect`}><Menu size={24} /></button>
        <h1 className={styles.title}>今日の献立アイデア</h1>
        <button className={`${styles.iconBtn} tap-effect`}><Settings size={24} /></button>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} size={40} />
            <p>献立を考案中...</p>
          </div>
        ) : (
          menus.map((menu, index) => (
            <div key={menu.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <MenuCard 
                menu={menu} 
                onDecide={handleDecide}
                onEdit={handleEdit}
                isFavorite={isFavorite(menu.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))
        )}
      </main>

      {editingMenu && (
        <IngredientModal 
          onClose={() => setEditingMenu(null)}
          onSubmitText={(text) => handleModalSubmit(text)}
          onSubmitIngredients={(ings) => handleModalSubmit('', ings)}
        />
      )}
    </>
  );
}
