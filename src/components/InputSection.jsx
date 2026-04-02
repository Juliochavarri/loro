import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InputSection({ onSubmit, disabled, timeLimit = 60 }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  const textRef = useRef(text);
  useEffect(() => { textRef.current = text; }, [text]);

  // Stable ref so the timer never re-runs just because the parent re-rendered
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);

  // Prevents the timer from firing onSubmit more than once per mount
  const firedRef = useRef(false);

  useEffect(() => {
    if (disabled || timeLimit === null) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!firedRef.current) {
            firedRef.current = true;
            onSubmitRef.current(textRef.current.trim() || "[Time ran out. No description provided.]");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  // onSubmit is intentionally omitted — managed via ref above
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, timeLimit]);

  const MAX_WORDS = 60;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const newWords = newText.trim() === '' ? 0 : newText.trim().split(/\s+/).length;
    
    if (newWords <= MAX_WORDS) {
      setText(newText);
    } else if (newText.length < text.length) {
      // Allow deletion
      setText(newText);
    } else {
      // Reject new words
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onSubmit(text);
  };

  return (
    <div className="glass-panel input-section rs-input-box" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '22px', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 28px 70px rgba(0,0,0,0.55)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ color: '#a78bfa', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 'normal', margin: 0 }}>
          {t.yourDescription}
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {timeLimit !== null && (
            <span className="timer-badge" style={{ 
              background: timeLeft <= 10 ? 'rgba(255,107,107,0.2)' : 'rgba(167,139,250,0.15)',
              color: timeLeft <= 10 ? '#ff6b6b' : '#d8b4fe',
              border: `1px solid ${timeLeft <= 10 ? 'rgba(255,107,107,0.6)' : 'rgba(167,139,250,0.5)'}`,
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '10px', 
              fontSize: '16px', fontWeight: 'bold',
              animation: timeLeft <= 10 ? 'flashPulse 1s infinite' : 'none',
              fontFamily: 'monospace', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <Clock size={16} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          )}

          <span className="word-count-badge" style={{ 
            background: wordCount >= MAX_WORDS ? 'rgba(255,107,107,0.1)' : 'transparent', 
            color: wordCount >= MAX_WORDS ? '#ff6b6b' : '#a78bfa', 
            border: `1px solid ${wordCount >= MAX_WORDS ? 'rgba(255,107,107,0.4)' : 'rgba(167,139,250,0.3)'}`,
            transition: 'all 0.3s',
            padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace'
          }}>
            {wordCount} / {MAX_WORDS}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px', flex: 1 }}>
        <textarea
          placeholder={t.placeholder}
          value={text}
          onChange={handleTextChange}
          disabled={disabled}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${shake ? "#ff6b6b" : "rgba(255,255,255,0.12)"}`,
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            padding: '13px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'Georgia, serif',
            lineHeight: '1.6',
            minHeight: '100px',
            flex: 1,
            transition: 'border-color .2s',
            animation: shake ? 'shake 0.4s' : 'none'
          }}
        />
        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(124,58,237,.4)'
          }}
        >
          {t.evaluateBtn}
        </button>
      </form>
    </div>
  );
}
