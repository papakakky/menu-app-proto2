'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Settings, Loader2, RefreshCw } from 'lucide-react';
import type { ThemeProposal } from '@/types';
import ThemeCard from '@/components/ThemeCard';
import IngredientModal from '@/components/IngredientModal';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [themes, setThemes] = useState<ThemeProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeProposal | null>(null);

  const fetchThemes = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const time = now.getHours() >= 17 ? '夜' : (now.getHours() >= 11 ? '昼' : '朝');
      const month = now.getMonth() + 1;

      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, month })
      });
      const data = await res.json();
      setThemes(data.themes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleDecide = async (theme: ThemeProposal) => {
    setIsGeneratingRecipe(true);
    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu: theme.menu })
      });
      const data = await res.json();
      localStorage.setItem('current_menu', JSON.stringify(data.menu));
      router.push('/cooking');
    } catch (err) {
      console.error(err);
      setIsGeneratingRecipe(false);
    }
  };

  const handleEdit = (theme: ThemeProposal) => {
    setEditingTheme(theme);
  };

  const handleModalSubmit = (text: string, ingredients?: string[]) => {
    let message = text;
    if (ingredients && ingredients.length > 0) {
      message = `家にある「${ingredients.join('、')}」を使って手直ししてほしい。`;
    }
    
    localStorage.setItem('chat_base_theme', JSON.stringify(editingTheme));
    localStorage.setItem('chat_initial_message', message);
    router.push('/chat');
  };

  return (
    <>
      <header className={styles.header}>
        <button className={`${styles.iconBtn} tap-effect`}><Menu size={24} /></button>
        <h1 className={styles.title}>献立コンシェルジュ</h1>
        <button className={`${styles.iconBtn} tap-effect`}><Settings size={24} /></button>
      </header>

      <main className={styles.main}>
        {isLoading ? (
          <div className={styles.loading}>
            <Loader2 className={styles.spinner} size={40} />
            <p>今の気分に合わせて考案中...</p>
          </div>
        ) : (
          <>
            <div className={styles.carousel}>
              {themes.map((theme, index) => (
                <div key={theme.id} className={styles.carouselItem} style={{ animationDelay: `${index * 0.1}s` }}>
                  <ThemeCard 
                    theme={theme} 
                    onDecide={handleDecide}
                    onEdit={handleEdit}
                  />
                </div>
              ))}
            </div>

            <div className={styles.refreshBtnContainer}>
              <button className={`${styles.refreshBtn} tap-effect`} onClick={fetchThemes}>
                <RefreshCw size={20} />
                別の提案を求める
              </button>
            </div>
          </>
        )}
      </main>

      {editingTheme && (
        <IngredientModal 
          onClose={() => setEditingTheme(null)}
          onSubmitText={(text) => handleModalSubmit(text)}
          onSubmitIngredients={(ings) => handleModalSubmit('', ings)}
        />
      )}

      {isGeneratingRecipe && (
        <div className={styles.recipeLoadingOverlay}>
          <div className={styles.recipeLoadingBox}>
            <Loader2 className={styles.spinner} size={40} />
            <p>レシピを作成中...</p>
          </div>
        </div>
      )}
    </>
  );
}
