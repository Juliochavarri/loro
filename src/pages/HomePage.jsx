import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, FlaskConical, Briefcase, Trophy, TreePine, PawPrint, PlaneTakeoff, Palette, LogOut, Music, Utensils, Shirt, Film, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const CATEGORIES = [
  { id: 'technology', label: 'Technology', icon: <Cpu /> },
  { id: 'biology', label: 'Biology', icon: <FlaskConical /> },
  { id: 'work', label: 'Work', icon: <Briefcase /> },
  { id: 'sports', label: 'Sports', icon: <Trophy /> },
  { id: 'nature', label: 'Nature', icon: <TreePine /> },
  { id: 'animals', label: 'Animals', icon: <PawPrint /> },
  { id: 'travel', label: 'Travel', icon: <PlaneTakeoff /> },
  { id: 'art', label: 'Art', icon: <Palette /> },
  { id: 'music', label: 'Music', icon: <Music /> },
  { id: 'food', label: 'Food', icon: <Utensils /> },
  { id: 'fashion', label: 'Fashion', icon: <Shirt /> },
  { id: 'movies', label: 'Movies', icon: <Film /> }
];

export default function HomePage() {
  const [selected, setSelected] = useState([]);
  const [level, setLevel] = useState('B1/B2');
  const [timerActive, setTimerActive] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const toggleCategory = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    // If none selected, we can pass "all" or an empty array
    // Let's pass the selected array via state
    navigate('/quiz', { state: { categories: selected.length > 0 ? selected : ['all'], level, timerActive } });
  };

  return (
    <div className="app-container" style={{ textAlign: 'center', position: 'relative' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ 
          position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', padding: '0.6rem', color: '#ff6b6b',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title={t.logout}
      >
        <LogOut size={20} />
      </button>

      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: '10px' }}>
        <LanguageSelector />
        <button 
          onClick={() => navigate('/pricing')}
          style={{ 
            background: 'linear-gradient(45deg, #ff8a00, #e52e71)', 
            border: 'none', borderRadius: '20px', padding: '0.5rem 1rem', color: 'white', fontWeight: 600, 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(229, 46, 113, 0.4)'
          }}
        >
          <span>💎</span> {t.upgradeBtn}
        </button>
      </div>

      <header style={{ marginTop: '4.5rem', marginBottom: '1rem' }}>
        <h1>{t.chooseSubjects}</h1>
        <p>{t.whatToDescribe}</p>
      </header>

      <div className="category-grid">
        {CATEGORIES.map((cat, i) => {
          const isSelected = selected.includes(cat.id);
          return (
            <motion.div 
              key={cat.id}
              className={`category-card ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCategory(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="cat-icon">{cat.icon}</div>
              <span className="cat-label">{cat.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#a78bfa' }}>{t.selectLevel}</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {['A1/A2', 'B1/B2', 'C1/C2'].map(lvl => {
            const lvlColor = lvl === 'A1/A2' ? '#69db7c' : lvl === 'B1/B2' ? '#ffd43b' : '#ff6b6b';
            return (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '16px',
                border: '1px solid',
                borderColor: level === lvl ? lvlColor : 'rgba(255,255,255,0.2)',
                background: level === lvl ? `${lvlColor}22` : 'rgba(255,255,255,0.02)',
                color: level === lvl ? lvlColor : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{lvl}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                {lvl === 'A1/A2' ? t.lvlBasic : lvl === 'B1/B2' ? t.lvlInter : t.lvlAdvanced}
              </div>
            </button>
          )})}
        </div>

        {/* Timer Toggle */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: timerActive ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${timerActive ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.3s' }}>
            <input type="checkbox" checked={timerActive} onChange={e => setTimerActive(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#a78bfa', cursor: 'pointer' }} />
            <Clock size={16} color={timerActive ? '#a78bfa' : '#888'} />
            <span style={{ color: timerActive ? '#fff' : '#aaa', fontSize: '0.9rem' }}>
              {t.timerOption} ({level === 'A1/A2' ? '90s' : level === 'B1/B2' ? '60s' : '45s'})
            </span>
          </label>
        </div>
      </div>

      <motion.button 
        className="btn-submit" 
        style={{ marginTop: '2rem', width: '100%', padding: '1.2rem', fontSize: '1.2rem' }}
        onClick={handleStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {t.startBtn} →
      </motion.button>
    </div>
  );
}
