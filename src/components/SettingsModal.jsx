import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, X } from 'lucide-react';

export default function SettingsModal({ show, onClose, apiKey, setApiKey }) {
  if (!show) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200 }}>
      <motion.div 
        className="result-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '2rem', maxWidth: '400px' }}
      >
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', cursor: 'pointer' }} onClick={onClose}>
          <X color="white" />
        </div>
        <Settings size={48} color="white" style={{ marginBottom: '1rem' }} />
        <h2>Configuración IA</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Para que la aplicación realmente pueda "ver" la imagen y evaluar si tu texto coincide, ingresa tu API Key gratuita de Gemini (AI Studio).
        </p>
        
        <form onSubmit={handleSave} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="AIxa... API_KEY" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{ 
              width: '100%', padding: '0.8rem', borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white' 
            }}
          />
          <button type="submit" className="btn-submit" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
            <Save size={18} /> Guardar
          </button>
        </form>
        
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--primary-color)' }}>
          Obtener API Key gratuita
        </a>
      </motion.div>
    </div>
  );
}
