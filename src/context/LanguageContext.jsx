import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  es: {
    // HomePage
    homeSubtitle: "Mejora tu inglés describiendo situaciones visuales generadas por IA.",
    chooseSubjects: "Elige tus Temas",
    whatToDescribe: "¿Qué te gustaría describir en inglés hoy?",
    startBtn: "Comenzar",
    lvlBasic: "Básico",
    lvlInter: "Intermedio",
    lvlAdvanced: "Avanzado",
    selectLevel: "Nivel de Dificultad",
    timerOption: "Habilitar Cronómetro",
    upgradeBtn: "Mejorar",
    
    // Generales
    back: "Regresar",
    settings: "Configuración de IA",
    loginToken: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    
    // QuizPage
    describing: "Describiendo:",
    loadingImage: "Generando escena aleatoria...",
    generatingFeedback: "La IA está evaluando tu descripción...",
    
    // InputSection
    yourDescription: "TU DESCRIPCIÓN",
    words: "palabras",
    placeholder: "Describe lo que ves en inglés...",
    evaluateBtn: "Evaluar mi nivel →",
    
    // ResultSection
    invalidDesc: "Descripción Inválida",
    invalidFallback: "El texto no parece describir la imagen o no está en inglés.",
    tryAnotherImg: "Intentar con otra imagen →",
    returnHome: "Volver a Clasificación",
    strengths: "✓ FORTALEZAS",
    improvements: "↑ A MEJORAR",
    vocabKey: "⭐ KEY WORDS",
    improvedExample: "💡 EJEMPLO MEJORADO",
    
    // LoginPage
    welcomeBack: "Bienvenido de nuevo",
    loginSubtitle: "Inicia sesión para guardar tu progreso en English Explorer.",
    emailAddress: "Correo Electrónico",
    continueEmail: "Continuar con Email",
    anotherMethod: "Usar otro método",
    continueGoogle: "Continuar con Google",
    continueApple: "Continuar con Apple",
    or: "O",
    terms: "Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.",
    
    // Nombres de nivel
    levelBeginner: "Principiante",
    levelBasic: "Básico",
    levelInter: "Intermedio",
    levelUpperInter: "Intermedio Alto",
    levelAdvanced: "Avanzado",
    levelMastery: "Maestría"
  },
  en: {
    // HomePage
    homeSubtitle: "Improve your English by describing AI-generated visual situations.",
    chooseSubjects: "Choose Your Subjects",
    whatToDescribe: "What would you like to describe in English today?",
    startBtn: "Start",
    lvlBasic: "Basic",
    lvlInter: "Intermediate",
    lvlAdvanced: "Advanced",
    selectLevel: "Difficulty Level",
    timerOption: "Enable Timer",
    upgradeBtn: "Upgrade",
    
    // Generales
    back: "Go Back",
    settings: "AI Settings",
    loginToken: "Log In",
    logout: "Log Out",
    
    // QuizPage
    describing: "Describing:",
    loadingImage: "Generating random scene...",
    generatingFeedback: "AI is evaluating your description...",
    
    // InputSection
    yourDescription: "YOUR DESCRIPTION",
    words: "words",
    placeholder: "Describe what you see in English...",
    evaluateBtn: "Evaluate my level →",
    
    // ResultSection
    invalidDesc: "Invalid Description",
    invalidFallback: "The text does not seem to describe the image or is not in English.",
    tryAnotherImg: "Try with another image →",
    returnHome: "Return to Categories",
    strengths: "✓ STRENGTHS",
    improvements: "↑ TO IMPROVE",
    vocabKey: "⭐ KEY WORDS",
    improvedExample: "💡 IMPROVED EXAMPLE",
    
    // LoginPage
    welcomeBack: "Welcome Back",
    loginSubtitle: "Log in to save your English Explorer progress.",
    emailAddress: "Email Address",
    continueEmail: "Continue with Email",
    anotherMethod: "Use another method",
    continueGoogle: "Continue with Google",
    continueApple: "Continue with Apple",
    or: "OR",
    terms: "By continuing, you agree to our Terms of Service and Privacy Policy.",
    
    // Level Names
    levelBeginner: "Beginner",
    levelBasic: "Basic",
    levelInter: "Intermediate",
    levelUpperInter: "Upper Intermediate",
    levelAdvanced: "Advanced",
    levelMastery: "Mastery"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Try to load language preference from localStorage, default to 'es'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language_pref') || 'es';
  });

  useEffect(() => {
    localStorage.setItem('language_pref', lang);
  }, [lang]);

  const t = translations[lang] || translations['es'];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
