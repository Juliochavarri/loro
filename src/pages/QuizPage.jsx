import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings, Loader2 } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import InputSection from '../components/InputSection';
import ResultSection from '../components/ResultSection';
import SettingsModal from '../components/SettingsModal';
import LanguageSelector from '../components/LanguageSelector';
import { evaluateWithAI, evaluateWithHeuristics } from '../utils/evaluation';
import { useLanguage } from '../context/LanguageContext';
import { SCENES } from '../utils/svgScenes';

export default function QuizPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageBase64, setImageBase64] = useState(''); // Saved for Gemini API
  const [loadingImg, setLoadingImg] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyCCbtGYuofzQnizhpfUZ13OesIWq2YYWcY');

  const location = useLocation();
  const navigate = useNavigate();
  const categories = location.state?.categories || ['all'];
  const level = location.state?.level || 'B1/B2';
  const timerActive = location.state?.timerActive ?? true;
  const timeLimit = timerActive ? (level === 'A1/A2' ? 90 : level === 'B1/B2' ? 60 : 45) : null;
  const { t, lang } = useLanguage();

  useEffect(() => {
    // Load API Key safely
    const stored = localStorage.getItem('gemini_api_key');
    if (stored) setApiKey(stored);
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const fetchNewImage = async () => {
    setLoadingImg(true);

    // Pedagogical Fix: Instead of combining all categories with ',' (which forces an impossible AND match in APIs),
    // we pick ONE random active category for this specific round.
    let activeCategory = 'lifestyle';
    if (categories && categories.length > 0 && categories[0] !== 'all') {
      activeCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    if (level === 'A1/A2') {
      // Try to find an SVG scene that matches the exact category being practiced
      const matchingScenes = SCENES.filter(s => s.id === activeCategory);
      const candidates = matchingScenes.length > 0 ? matchingScenes : SCENES;
      const randomScene = candidates[Math.floor(Math.random() * candidates.length)];
      const blob = new Blob([randomScene.svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url); // Render naturally to DOM

      // Background converter for Gemini (must be JPEG/PNG)
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,600,400);
        ctx.drawImage(img, 0, 0, 600, 400);
        setImageBase64(canvas.toDataURL("image/jpeg", 0.9).split(',')[1]);
        setLoadingImg(false);
      };
      img.src = url;
      return;
    }

    const timestamp = new Date().getTime();
    
    // Fetch a real-life situation based ONLY on the single active category chosen above
    const targetUrl = `https://loremflickr.com/600/400/${activeCategory},situational/all?lock=${timestamp}`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const picsumFallbackUrl = `https://picsum.photos/seed/${timestamp}/600/400`;

    try {
      let res = await fetch(proxyUrl);
      if (!res.ok) {
        throw new Error("Proxy failed");
      }

      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setImageBase64(base64Data);
        setImageUrl(reader.result);
        setLoadingImg(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.warn("Proxy/LoremFlickr failed, using SVG scene fallback:", err);
      const matchingScenes = SCENES.filter(s => s.id === activeCategory);
      const candidates = matchingScenes.length > 0 ? matchingScenes : SCENES;
      const randomScene = candidates[Math.floor(Math.random() * candidates.length)];
      const blob = new Blob([randomScene.svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 600, 400);
        ctx.drawImage(img, 0, 0, 600, 400);
        setImageBase64(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
        setLoadingImg(false);
      };
      img.onerror = () => {
        setImageBase64('');
        setLoadingImg(false);
      };
      img.src = url;
    }
  };

  useEffect(() => {
    fetchNewImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (text) => {
    setIsEvaluating(true);
    try {
      if (apiKey && imageBase64) {
        // AI VIsion Evaluation
        const result = await evaluateWithAI(imageBase64, 'image/jpeg', text, apiKey, lang);
        setEvaluationData(result);
      } else {
        setEvaluationData(evaluateWithHeuristics(text, lang));
      }
      setShowResult(true);
    } catch (error) {
      console.error("AI Error:", error);
      setEvaluationData(evaluateWithHeuristics(text, lang));
      setShowResult(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCloseModal = () => {
    setShowResult(false);
    fetchNewImage();
  };

  return (
    <div className="app-container quiz-container">
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/home')}
          className="btn-secondary"
          style={{ position: 'fixed', top: 20, left: 20, padding: '0.6rem', borderRadius: '50%', background: 'var(--glass-bg)', border: 'none', zIndex: 100 }}
          title={t.back}
        >
          <ArrowLeft color="white" />
        </button>

        <div style={{ position: 'fixed', top: 20, right: 20, display: 'flex', gap: '8px', zIndex: 100 }}>
          <LanguageSelector />
          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary"
            style={{ padding: '0.6rem', borderRadius: '50%', background: 'var(--glass-bg)', border: 'none' }}
            title={t.settings}
          >
            <Settings color="white" />
          </button>
        </div>

        <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
          <h1>English Explorer</h1>
          <p>{t.describing} {categories.join(', ')}</p>
          <div style={{ color: '#a78bfa', fontSize: '0.9rem', marginTop: '5px', fontFamily: 'monospace' }}>
            Nivel: {level}
          </div>
        </div>
      </header>

      <div className="split-layout">
        <div className="split-left">
          <ImageCard
            imageUrl={imageUrl}
            loading={loadingImg}
            onRefresh={fetchNewImage}
            level={level}
          />
        </div>

        {/* Modification string to intercept Submit button inside InputSection */}
        <div className="split-right" style={{ position: 'relative' }}>
          <InputSection
            key={imageUrl}
            timeLimit={timeLimit}
            onSubmit={handleSubmit}
            disabled={loadingImg || isEvaluating}
          />
          {isEvaluating && (
            <div style={{ position: 'absolute', bottom: '1.5rem', right: '45%', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
              <Loader2 className="animate-spin" /> {t.generatingFeedback}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <ResultSection
            evaluationData={evaluationData}
            selectedLevel={level}
            onNext={handleCloseModal}
            onReturnHome={() => navigate('/home')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            show={showSettings}
            onClose={() => setShowSettings(false)}
            apiKey={apiKey}
            setApiKey={saveApiKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
