'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import type { Menu as MenuType } from '@/types';
import MenuCard from '@/components/MenuCard';
import { useFavorites } from '@/hooks/useFavorites';
import styles from './page.module.css';

export default function ChatPage() {
  const router = useRouter();
  const [initialMessage, setInitialMessage] = useState('');
  const [baseMenu, setBaseMenu] = useState<MenuType | null>(null);
  
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiReply, setAiReply] = useState('');
  const [proposedMenu, setProposedMenu] = useState<MenuType | null>(null);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const msg = localStorage.getItem('chat_initial_message') || '';
    const menuStr = localStorage.getItem('chat_base_menu');
    setInitialMessage(msg);
    
    if (menuStr) {
      try {
        const menu = JSON.parse(menuStr);
        setBaseMenu(menu);
        fetchChat(msg, menu);
      } catch (e) {
        console.error(e);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchChat = async (message: string, base: MenuType) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, baseMenu: base })
      });
      const data = await res.json();
      setAiReply(data.reply);
      setProposedMenu(data.menu);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDecide = (menu: MenuType) => {
    localStorage.setItem('current_menu', JSON.stringify(menu));
    router.push('/cooking');
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

        {proposedMenu && !isAiLoading && (
          <div style={{ animation: 'slideUpFade 0.5s var(--transition-spring) 0.4s forwards', opacity: 0 }}>
            <MenuCard 
              menu={proposedMenu} 
              onDecide={handleDecide}
              onEdit={handleEdit}
              isFavorite={isFavorite(proposedMenu.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </main>
    </div>
  );
}
