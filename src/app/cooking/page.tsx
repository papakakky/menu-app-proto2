'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, ListChecks, ExternalLink, Heart, ChevronRight } from 'lucide-react';
import type { Menu as MenuType, Dish } from '@/types';
import { useDishFavorites } from '@/hooks/useDishFavorites';
import styles from './page.module.css';

export default function CookingPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [activeTab, setActiveTab] = useState<string>('main');
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  const { isFavorite, toggleFavorite } = useDishFavorites();

  useEffect(() => {
    const menuStr = localStorage.getItem('current_menu');
    if (menuStr) {
      setMenu(JSON.parse(menuStr));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!menu) return null;

  const tabs = [
    { id: 'main', label: '主菜', dish: menu.main },
    ...(menu.side1 ? [{ id: 'side1', label: '副菜1', dish: menu.side1 }] : []),
    ...(menu.side2 ? [{ id: 'side2', label: '副菜2', dish: menu.side2 }] : []),
    ...(menu.soup ? [{ id: 'soup', label: '汁物', dish: menu.soup }] : []),
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);
  const currentDish = tabs[currentTabIndex]?.dish as Dish;
  const nextTab = tabs[currentTabIndex + 1];

  const handleCookpadSearch = () => {
    const query = encodeURIComponent(currentDish.name);
    window.open(`https://cookpad.com/search/${query}`, '_blank');
  };

  const allIngredients = tabs.flatMap(t => t.dish.ingredients || []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={`${styles.backBtn} tap-effect`} onClick={() => router.back()}>
          <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>調理</h1>
        <button 
          className={`${styles.cartBtn} tap-effect`} 
          onClick={() => setShowShoppingList(!showShoppingList)}
        >
          <ShoppingCart size={24} fill={showShoppingList ? "currentColor" : "none"} />
        </button>
      </header>

      {showShoppingList ? (
        <main className={`${styles.main} animate-fade-in`}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ShoppingCart size={20} color="var(--color-secondary)" />
              全メニューの買い物リスト
            </h2>
            <ul className={styles.list}>
              {allIngredients.map((ing, i) => (
                <li key={i} className={styles.listItem}>
                  <input type="checkbox" style={{ marginTop: '4px', transform: 'scale(1.2)' }} />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      ) : (
        <>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''} tap-effect`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <main className={styles.main}>
            
            <div className={`${styles.dishHeader} animate-fade-in`} key={`header-${activeTab}`}>
              <div className={styles.dishTitleRow}>
                <h2 className={styles.dishName}>{currentDish.name}</h2>
                <button 
                  className={`${styles.dishFavBtn} ${isFavorite(currentDish.name) ? styles.active : ''} tap-effect`}
                  onClick={() => toggleFavorite(currentDish.name)}
                >
                  <Heart fill={isFavorite(currentDish.name) ? 'currentColor' : 'none'} size={24} />
                </button>
              </div>
              <button className={`${styles.cookpadSmallBtn} tap-effect`} onClick={handleCookpadSearch}>
                <ExternalLink size={14} /> Cookpadで見る
              </button>
            </div>

            <div className={`${styles.section} animate-fade-in`} key={`ing-${activeTab}`}>
              <h2 className={styles.sectionTitle}>
                <ShoppingCart size={20} color="var(--color-secondary)" />
                材料
              </h2>
              <ul className={styles.list}>
                {(currentDish.ingredients || []).map((ing, i) => (
                  <li key={i} className={styles.listItem}>
                    {/* チェックボックスを削除して黒ポチなどのスタイルに変更 */}
                    <span style={{ color: 'var(--color-secondary)', marginRight: '0.5rem' }}>•</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.section} animate-fade-in`} key={`step-${activeTab}`} style={{ animationDelay: '0.1s' }}>
              <h2 className={styles.sectionTitle}>
                <ListChecks size={20} color="var(--color-secondary)" />
                ざっくり手順
              </h2>
              <ul className={styles.list}>
                {(currentDish.steps || []).map((step, i) => (
                  <li key={i} className={styles.listItem}>
                    <div className={styles.stepNumber}>{i + 1}</div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {nextTab && (
              <button 
                className={`${styles.nextDishBtn} tap-effect animate-slide-up`} 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveTab(nextTab.id);
                }}
              >
                次の料理（{nextTab.label}）へ
                <ChevronRight size={20} />
              </button>
            )}

          </main>
        </>
      )}
    </div>
  );
}
