import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}
