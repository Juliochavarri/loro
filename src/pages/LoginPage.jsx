import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState('');

  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const AppleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
    </svg>
  );

  const handleLogin = (e) => {
    e?.preventDefault();
    navigate('/home');
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>
            {t.welcomeBack}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            {t.loginSubtitle}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2.5rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {emailMode ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace', color: '#a78bfa', marginBottom: '8px' }}>
                  {t.emailAddress}
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', transition: 'border-color .2s',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#a78bfa'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button 
                onClick={handleLogin}
                style={{
                  width: '100%', padding: '14px', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: 'Georgia, serif',
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}
              >
                {t.continueEmail} <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => setEmailMode(false)}
                style={{
                  width: '100%', marginTop: '1rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)',
                  fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif', textDecoration: 'underline'
                }}
              >
                {t.anotherMethod}
              </button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Google Button */}
              <button onClick={handleLogin} style={{
                  width: '100%', padding: '14px', background: 'white', color: '#333', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '500', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'transform 0.2s',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <GoogleIcon /> {t.continueGoogle}
              </button>

              {/* Apple Button */}
              <button onClick={handleLogin} style={{
                  width: '100%', padding: '14px', background: '#000', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px', fontSize: '15px', fontWeight: '500', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'transform 0.2s',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
              }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <AppleIcon /> {t.continueApple}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', opacity: 0.5 }}>
                <div style={{ flex: 1, height: '1px', background: '#fff' }}></div>
                <div style={{ padding: '0 10px', fontSize: '12px', fontFamily: 'monospace' }}>{t.or}</div>
                <div style={{ flex: 1, height: '1px', background: '#fff' }}></div>
              </div>

              {/* Email Button */}
              <button 
                onClick={() => setEmailMode(true)}
                style={{
                  width: '100%', padding: '14px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px', fontSize: '15px', fontWeight: '500', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'background 0.2s'
              }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <Mail size={20} /> {t.continueEmail}
              </button>

            </motion.div>
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
          {t.terms}
        </div>
      </motion.div>
    </div>
  );
}
