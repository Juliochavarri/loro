import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50%', padding: '0.6rem', color: '#a78bfa', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
        }}
        title="Change Language"
      >
        <Globe size={20} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '120%', right: 0, 
          background: 'rgba(30, 28, 58, 0.95)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '0.5rem', minWidth: '120px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100
        }}>
          <button 
            onClick={() => toggleLanguage('es')}
            style={{
              width: '100%', padding: '0.5rem 1rem', background: lang === 'es' ? 'rgba(167,139,250,0.2)' : 'transparent',
              border: 'none', borderRadius: '8px', color: lang === 'es' ? '#a78bfa' : '#fff',
              textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif'
            }}
          >
            🇪🇸 Español
          </button>
          <button 
            onClick={() => toggleLanguage('en')}
            style={{
              width: '100%', padding: '0.5rem 1rem', background: lang === 'en' ? 'rgba(167,139,250,0.2)' : 'transparent',
              border: 'none', borderRadius: '8px', color: lang === 'en' ? '#a78bfa' : '#fff',
              textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif', marginTop: '4px'
            }}
          >
            🇺🇸 English
          </button>
        </div>
      )}
    </div>
  );
}
