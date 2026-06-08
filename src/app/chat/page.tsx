'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import type { ThemeProposal } from '@/types';
import ThemeCard from '@/components/ThemeCard';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [initialMessage, setInitialMessage] = useState('');
  const [baseTheme, setBaseTheme] = useState<ThemeProposal | null>(null);
  
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiReply, setAiReply] = useState('');
  const [proposedTheme, setProposedTheme] = useState<ThemeProposal | null>(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  useEffect(() => {
    const msg = localStorage.getItem('chat_initial_message') || '';
    const themeStr = localStorage.getItem('chat_base_theme');
    setInitialMessage(msg);
    
    if (themeStr) {
      try {
        const theme = JSON.parse(themeStr);
        setBaseTheme(theme);
        fetchChat(msg, theme);
      } catch (e) {
        console.error(e);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchChat = async (message: string, base: ThemeProposal) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, baseTheme: base })
      });
      const data = await res.json();
      setAiReply(data.reply);
      setProposedTheme(data.theme);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

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

  const handleEdit = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={`${styles.backBtn} tap-effect`} onClick={() => router.back()}>
          <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>手直し</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.chatArea}>
          <div className={`${styles.userBubble} animate-slide-up`}>
            {initialMessage}
          </div>

          {isAiLoading ? (
            <div className={`${styles.loadingBubble} animate-fade-in`}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          ) : (
            <div className={`${styles.aiBubble} animate-slide-up`} style={{ animationDelay: '0.2s' }}>
              {aiReply}
            </div>
          )}
        </div>

        {proposedTheme && !isAiLoading && (
          <div style={{ animation: 'slideUpFade 0.5s var(--transition-spring) 0.4s forwards', opacity: 0 }}>
            <ThemeCard 
              theme={proposedTheme} 
              onDecide={handleDecide}
              onEdit={handleEdit}
            />
          </div>
        )}
      </main>

      {isGeneratingRecipe && (
        <div className={styles.recipeLoadingOverlay}>
          <div className={styles.recipeLoadingBox}>
            <Loader2 className={styles.spinner} size={40} />
            <p>レシピを作成中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
