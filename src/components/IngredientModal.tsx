'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Send, Check } from 'lucide-react';
import styles from './IngredientModal.module.css';

interface IngredientModalProps {
  onClose: () => void;
  onSubmitText: (text: string) => void;
  onSubmitIngredients: (ingredients: string[]) => void;
}

const INGREDIENTS = {
  meat_seafood: [
    { id: 'pork', name: '豚肉', icon: '🥩' },
    { id: 'chicken', name: '鶏肉', icon: '🍗' },
    { id: 'beef', name: '牛肉', icon: '🥩' },
    { id: 'seafood', name: '魚介', icon: '🐟' },
    { id: 'processed', name: '加工肉', icon: '🥓' },
  ],
  veg: [
    { id: 'cabbage', name: 'キャベツ', icon: '🥬' },
    { id: 'tomato', name: 'トマト', icon: '🍅' },
    { id: 'onion', name: '玉ねぎ', icon: '🧅' },
    { id: 'mushroom', name: 'きのこ', icon: '🍄' },
    { id: 'beansprout', name: 'もやし', icon: '🌱' },
    { id: 'potato', name: 'じゃがいも', icon: '🥔' },
  ],
  other: [
    { id: 'egg', name: '卵', icon: '🥚' },
    { id: 'tofu', name: '豆腐', icon: '🧊' },
    { id: 'natto', name: '納豆', icon: '🥢' },
    { id: 'milk', name: '牛乳', icon: '🥛' },
    { id: 'cheese', name: 'チーズ', icon: '🧀' },
  ]
};

export default function IngredientModal({ onClose, onSubmitText, onSubmitIngredients }: IngredientModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [chatText, setChatText] = useState('');

  const toggleSelect = (name: string) => {
    setSelected(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <MessageCircle size={20} className="gradient-text" />
            何か変更したい要素はありますか？
          </h3>
          <button className={`${styles.closeBtn} tap-effect`} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>▼ 家にある食材から選ぶ</h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#8D99AE', marginBottom: '0.5rem' }}>【肉・魚介】</div>
            <div className={styles.grid}>
              {INGREDIENTS.meat_seafood.map(i => (
                <button 
                  key={i.id} 
                  className={`${styles.ingredientBtn} ${selected.includes(i.name) ? styles.selected : ''} tap-effect`}
                  onClick={() => toggleSelect(i.name)}
                >
                  {selected.includes(i.name) && <Check size={14} />} {i.name} {i.icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#8D99AE', marginBottom: '0.5rem' }}>【野菜】</div>
            <div className={styles.grid}>
              {INGREDIENTS.veg.map(i => (
                <button 
                  key={i.id} 
                  className={`${styles.ingredientBtn} ${selected.includes(i.name) ? styles.selected : ''} tap-effect`}
                  onClick={() => toggleSelect(i.name)}
                >
                  {selected.includes(i.name) && <Check size={14} />} {i.name} {i.icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#8D99AE', marginBottom: '0.5rem' }}>【その他】</div>
            <div className={styles.grid}>
              {INGREDIENTS.other.map(i => (
                <button 
                  key={i.id} 
                  className={`${styles.ingredientBtn} ${selected.includes(i.name) ? styles.selected : ''} tap-effect`}
                  onClick={() => toggleSelect(i.name)}
                >
                  {selected.includes(i.name) && <Check size={14} />} {i.name} {i.icon}
                </button>
              ))}
            </div>
          </div>
          
          {selected.length > 0 && (
            <button 
              className={`${styles.fixBtn} hover-scale animate-fade-in`}
              onClick={() => onSubmitIngredients(selected)}
            >
              この食材で手直しする
            </button>
          )}
        </div>

        <div className={styles.chatSection}>
          <h4 className={styles.sectionTitle}>▼ AIコンシェルジュに相談する</h4>
          <form 
            className={styles.chatInputWrapper}
            onSubmit={(e) => {
              e.preventDefault();
              if (chatText.trim()) onSubmitText(chatText);
            }}
          >
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="3の方向で、季節を感じる献立..."
              value={chatText}
              onChange={e => setChatText(e.target.value)}
            />
            <button 
              type="submit" 
              className={`${styles.submitBtn} tap-effect`}
              disabled={!chatText.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
