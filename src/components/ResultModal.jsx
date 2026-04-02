import React from 'react';
import { motion } from 'framer-motion';
import { Award, RefreshCcw, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';
export default function ResultModal({ show, onClose, evaluationData }) {
  if (!show) return null;

  let isRelevant = evaluationData?.isRelevant ?? true;
  const level = evaluationData?.level || 'N/A';
  const feedback = {
    description: evaluationData?.encouragement || evaluationData?.description || '',
    capabilities: evaluationData?.capabilities || [],
    recommendations: evaluationData?.recommendations || { words: [], connectors: [], phrases: [] },
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
      <motion.div 
        className="result-card"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', margin: 'auto', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexDirection: 'column' }}>
            {!isRelevant ? (
              <AlertTriangle size={64} color="#ffaa00" />
            ) : (
              <Award size={64} color="white" />
            )}
            
            <h2>{!isRelevant ? "Texto Irrelevante" : "Nivel Alcanzado"}</h2>
            
            {isRelevant && level !== 'N/A' && (
              <motion.div 
                className={`level-badge level-${level.slice(0, 2)}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                {level}
              </motion.div>
            )}

            <p className="result-desc" style={{ color: !isRelevant ? '#ffaa00' : 'white' }}>
              <strong>{feedback.description}</strong>
            </p>
        </div>

        <div className="feedback-section">
          <h3><CheckCircle size={18} /> {isRelevant ? "¿Qué puedes hacer con este nivel?" : "Observaciones"}</h3>
          <ul>
            {feedback.capabilities.map((cap, i) => <li key={i}>{cap}</li>)}
          </ul>
        </div>

        <div className="feedback-section">
          <h3><Lightbulb size={18} /> Recomendaciones para avanzar</h3>
          
          <div className="recommendations-grid">
            <div className="rec-box">
              <h4>Palabras Útiles</h4>
              <p>{feedback.recommendations.words?.join(', ') || ''}</p>
            </div>
            <div className="rec-box">
              <h4>Conectores</h4>
              <p>{feedback.recommendations.connectors?.join(', ') || ''}</p>
            </div>
            <div className="rec-box" style={{ gridColumn: '1 / -1' }}>
              <h4>Frases de ejemplo para aplicar</h4>
              <ul>
                {feedback.recommendations.phrases?.map((phrase, i) => <li key={i}>{phrase}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <button className="btn-secondary" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem auto 0 auto' }}>
          <RefreshCcw size={18} /> Reiniciar
        </button>
      </motion.div>
    </div>
  );
}
