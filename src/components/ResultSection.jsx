import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

async function fetchTranslation(word) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|es`
  );
  if (!res.ok) throw new Error('translation failed');
  const data = await res.json();
  return data.responseData?.translatedText || null;
}

const LEVEL_STYLES = {
  A1: { color: "#ff6b6b", label: "A1 — Principiante", emoji: "🌱", bar: 1 },
  A2: { color: "#ffa94d", label: "A2 — Básico",        emoji: "🌿", bar: 2 },
  B1: { color: "#ffd43b", label: "B1 — Intermedio",    emoji: "🌻", bar: 3 },
  B2: { color: "#69db7c", label: "B2 — Intermedio Alto",emoji: "🌳", bar: 4 },
  C1: { color: "#4dabf7", label: "C1 — Avanzado",      emoji: "💎", bar: 5 },
  C2: { color: "#cc5de8", label: "C2 — Maestría",      emoji: "👑", bar: 6 },
};

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const LEVEL_TO_TAB = { 'A1/A2': 'basic', 'B1/B2': 'intermediate', 'C1/C2': 'advanced' };

export default function ResultSection({ evaluationData, selectedLevel, onNext, onReturnHome }) {
  const containerRef = useRef(null);
  const [exampleTab, setExampleTab] = useState(LEVEL_TO_TAB[selectedLevel] ?? 'intermediate');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [translations, setTranslations] = useState({});   // cache kw → texto
  const [loadingKw, setLoadingKw] = useState(null);
  const { t } = useLanguage();

  const handleKeywordClick = async (kw) => {
    if (activeTooltip === kw) { setActiveTooltip(null); return; }
    setActiveTooltip(kw);
    if (translations[kw] !== undefined) return;          // ya está en caché
    setLoadingKw(kw);
    try {
      const result = await fetchTranslation(kw);
      setTranslations(prev => ({ ...prev, [kw]: result ?? '—' }));
    } catch {
      setTranslations(prev => ({ ...prev, [kw]: '—' }));
    } finally {
      setLoadingKw(null);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      // Allow slight delay for DOM painting if needed
      setTimeout(() => {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [evaluationData]);

  if (!evaluationData) return null;

  const {
    isRelevant,
    level,
    levelName,
    encouragement,
    strengths,
    improvements,
    improvedExamples = {},
    keywords,
    keywordsByTab,
  } = evaluationData;

  // Use tab-synced keywords when available (heuristics), otherwise flat array (Gemini)
  const activeKeywords = keywordsByTab ? keywordsByTab[exampleTab] : keywords;

  if (!isRelevant) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(15, 12, 41, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
      }}>
        <div ref={containerRef} style={{
            width: "100%", maxWidth: "480px",
            borderRadius: "18px", overflow: "hidden",
            border: `1px solid rgba(255,107,107,0.44)`,
            background: "rgba(36,36,62,0.95)", // dark solid background so text isn't invisible
            animation: "fadeUp .5s ease",
            padding: "2rem", textAlign: "center",
            fontFamily: "Georgia, serif", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
        }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{t.invalidDesc}</h2>
            <p style={{ color: '#ddd' }}>{encouragement || t.invalidFallback}</p>
            <button onClick={onNext} style={{
                width: "100%", padding: "11px", marginTop: "1rem",
                background: "transparent", border: `1px solid rgba(255,107,107,0.55)`,
                borderRadius: "10px", color: '#ff6b6b',
                fontSize: "13px", fontFamily: "Georgia,serif", cursor: "pointer", letterSpacing: "1px",
              }}>{t.tryAnotherImg}</button>
        </div>
      </div>
    );
  }

  const lKey = CEFR_LEVELS.includes(level) ? level : 'A1';
  const levelInfo = LEVEL_STYLES[lKey];

  const levelNames = {
    A1: t.levelBeginner,
    A2: t.levelBasic,
    B1: t.levelInter,
    B2: t.levelUpperInter,
    C1: t.levelAdvanced,
    C2: t.levelMastery,
  };

  return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(15, 12, 41, 0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
      }}>
        <div ref={containerRef} style={{
          width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
          borderRadius: "18px",
          border: `1px solid ${levelInfo.color}44`,
          background: "rgba(36,36,62,0.95)",
          animation: "fadeUp .5s ease",
          fontFamily: "Georgia, serif", boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
        }}>
          {/* Level header */}
          <div style={{
            background: `linear-gradient(135deg,${levelInfo.color}22,${levelInfo.color}08)`,
            borderBottom: `1px solid ${levelInfo.color}30`,
            padding: "20px 22px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
              <div style={{ fontSize: "38px", lineHeight: 1 }}>{levelInfo.emoji}</div>
              <div>
                <div style={{ fontSize: "30px", fontWeight: "700", color: levelInfo.color, lineHeight: 1, fontFamily: "monospace" }}>{lKey}</div>
                <div style={{ color: "#ccc", fontSize: "13px", marginTop: "2px" }}>{lKey} — {levelNames[lKey]}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#aaa", fontSize: "12px", fontStyle: "italic", maxWidth: "160px", textAlign: "right", lineHeight: "1.5" }}>
                {encouragement}
              </div>
            </div>
            {/* Level bar */}
            <div style={{ display: "flex", gap: "4px" }}>
              {["A1","A2","B1","B2","C1","C2"].map((l, i) => (
                <div key={l} style={{
                  flex: 1, height: "6px", borderRadius: "3px",
                  background: i < levelInfo.bar ? levelInfo.color : "rgba(255,255,255,0.1)",
                  transition: "background .3s",
                }}/>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {["A1","A2","B1","B2","C1","C2"].map(l => (
                <span key={l} style={{ fontSize: "9px", color: l === lKey ? levelInfo.color : "#555", fontFamily: "monospace", fontWeight: l === lKey ? "bold" : "normal" }}>{l}</span>
              ))}
            </div>
          </div>
 
          {/* Feedback */}
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: "14px", textAlign: 'left' }}>
            <div>
              <div style={{ color: "#69db7c", fontSize: "12px", letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: "6px", fontWeight: "bold" }}>{t.strengths}</div>
              <p style={{ color: "#ddd", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>{strengths}</p>
            </div>
            <div>
              <div style={{ color: "#ffd43b", fontSize: "12px", letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: "6px", fontWeight: "bold" }}>{t.improvements}</div>
              <p style={{ color: "#ddd", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>{improvements}</p>
            </div>
            
            {activeKeywords && activeKeywords.length > 0 && (
              <div>
                <div style={{ color: "rgb(77, 171, 247)", fontSize: "12px", letterSpacing: "1.5px", fontFamily: "monospace", marginBottom: "8px", fontWeight: "bold" }}>{t.vocabKey}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {activeKeywords.map(kw => {
                    const isOpen = activeTooltip === kw;
                    const isLoading = loadingKw === kw;
                    const translation = translations[kw];
                    return (
                      <span
                        key={kw}
                        onClick={() => handleKeywordClick(kw)}
                        style={{
                          position: 'relative',
                          background: isOpen ? 'rgba(77, 171, 247, 0.28)' : 'rgba(77, 171, 247, 0.15)',
                          border: `1px solid ${isOpen ? 'rgba(77, 171, 247, 0.7)' : 'rgba(77, 171, 247, 0.3)'}`,
                          color: 'rgb(77, 171, 247)', padding: '4px 10px', borderRadius: '12px',
                          fontSize: '13px', fontFamily: 'Inter, sans-serif',
                          cursor: 'pointer', userSelect: 'none', transition: 'all 0.15s',
                        }}
                      >
                        {kw}
                        {isOpen && (
                          <span style={{
                            position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#1e1b4b', border: '1px solid rgba(77,171,247,0.5)',
                            color: '#e0d7ff', borderRadius: '8px', padding: '5px 10px',
                            fontSize: '12px', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.5)', zIndex: 10, pointerEvents: 'none',
                            fontStyle: 'italic',
                          }}>
                            {isLoading ? '...' : (translation ?? '—')}
                            <span style={{
                              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                              borderWidth: '5px', borderStyle: 'solid',
                              borderColor: 'rgba(77,171,247,0.5) transparent transparent transparent',
                            }} />
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "13px" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ color: "#a78bfa", fontSize: "12px", letterSpacing: "1.5px", fontFamily: "monospace", fontWeight: "bold" }}>{t.improvedExample}</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['basic', 'intermediate', 'advanced'].map(lvl => {
                    const tabColor = lvl === 'basic' ? '#69db7c' : lvl === 'intermediate' ? '#ffd43b' : '#ff6b6b';
                    return (
                    <button
                      key={lvl}
                      onClick={() => { setExampleTab(lvl); setActiveTooltip(null); }}
                      style={{
                        padding: '4px 8px', fontSize: '10px', fontFamily: 'monospace', 
                        cursor: 'pointer', borderRadius: '4px', border: `1px solid ${exampleTab === lvl ? tabColor : 'rgba(255,255,255,0.15)'}`,
                        background: exampleTab === lvl ? `${tabColor}25` : 'transparent',
                        color: exampleTab === lvl ? tabColor : 'rgba(255,255,255,0.5)', transition: 'all 0.2s', fontWeight: exampleTab === lvl ? 'bold' : 'normal'
                      }}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  )})}
                </div>
              </div>
              <p style={{ color: "#e0d7ff", fontSize: "14px", margin: 0, fontStyle: "italic", lineHeight: "1.6", minHeight: '40px' }}>
                "{improvedExamples[exampleTab] || improvedExamples['intermediate'] || 'No example available'}"
              </p>
            </div>
          </div>
 
          <div style={{ padding: "0 22px 18px", display: "flex", gap: "10px" }}>
            <button onClick={onReturnHome} style={{
              width: "50%", padding: "11px",
              background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: "10px", color: "#ccc",
              fontSize: "13px", fontFamily: "Georgia,serif", cursor: "pointer", letterSpacing: "1px",
              transition: "all 0.2s"
            }}>{t.returnHome}</button>

            <button onClick={onNext} style={{
              width: "50%", padding: "11px",
              background: "transparent", border: `1px solid ${levelInfo.color}55`,
              borderRadius: "10px", color: levelInfo.color,
              fontSize: "13px", fontFamily: "Georgia,serif", cursor: "pointer", letterSpacing: "1px",
              transition: "all 0.2s"
            }}>{t.tryAnotherImg}</button>
          </div>
        </div>
      </div>
  );
}
