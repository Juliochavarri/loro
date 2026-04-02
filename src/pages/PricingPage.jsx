import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Basic Explorer',
    price: '$0',
    period: '/mo',
    description: 'Perfect for casual learners discovering new words.',
    features: [
      { text: 'Access to 5 categories', included: true },
      { text: '10 images per day', included: true },
      { text: 'AI Grammar Simulation', included: true },
      { text: 'Real Vision Evaluation', included: false },
      { text: 'Vocabulary Tracking', included: false },
    ],
    buttonText: 'Current Plan',
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Fluent Master',
    price: '$9.99',
    period: '/mo',
    description: 'Supercharge your English with advanced AI feedback.',
    features: [
      { text: 'Unlimited Categories', included: true },
      { text: 'Unlimited Images', included: true },
      { text: 'Real Vision Evaluation', included: true },
      { text: 'Advanced Connectors & Phrases', included: true },
      { text: 'Offline Review mode', included: false },
    ],
    buttonText: 'Upgrade to Pro',
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Native Speaker',
    price: '$19.99',
    period: '/mo',
    description: 'The ultimate immersive learning experience.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Save & Review Offline', included: true },
      { text: 'Download Certificates', included: true },
      { text: 'Voice Pronunciation (Beta)', included: true },
      { text: 'Priority Support', included: true },
    ],
    buttonText: 'Get Premium',
    isPopular: false
  }
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="app-container" style={{ textAlign: 'center', maxWidth: '1200px' }}>
      <header style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/home')}
          className="btn-secondary"
          style={{ position: 'absolute', top: 0, left: 0, padding: '0.6rem', borderRadius: '50%', background: 'var(--glass-bg)', border: 'none' }}
          title="Regresar"
        >
          <ArrowLeft color="white" />
        </button>
        <h1>Level Up Your Learning</h1>
        <p>Choose the plan that fits your English goals and unlock your full potential.</p>
      </header>

      <div className="pricing-grid">
        {PLANS.map((plan, i) => (
          <motion.div 
            key={plan.id}
            className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
          >
            {plan.isPopular && <div className="popular-badge">Most Popular</div>}
            
            <div className="pricing-header">
              <h3>{plan.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', minHeight: '40px' }}>
                {plan.description}
              </p>
            </div>

            <div className="pricing-price">
              {plan.price} <span>{plan.period}</span>
            </div>

            <ul className="pricing-features">
              {plan.features.map((feat, idx) => (
                <li key={idx} className={feat.included ? 'included' : ''} style={{ opacity: feat.included ? 1 : 0.5 }}>
                  {feat.included ? <CheckCircle2 size={18} color="var(--primary-color)" /> : <XCircle size={18} color="var(--text-secondary)" />}
                  {feat.text}
                </li>
              ))}
            </ul>

            <motion.button 
              className={plan.isPopular ? "btn-submit" : "btn-secondary"}
              style={{ width: '100%', padding: '1rem', marginTop: 'auto' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.buttonText}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
