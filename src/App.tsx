import { useState, useEffect } from 'react';
import OpeningScene from './components/OpeningScene';
import SceneVideoPage from './components/SceneVideoPage';
import { type ChoiceHotspot } from './config/sceneCard1';
import './App.css';

type PageView = 'opening' | 'scene-1-esamina';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h === '#esamina' || h === '#scene-1-esamina' || window.location.pathname.includes('/esamina')) {
        return 'scene-1-esamina';
      }
    }
    return 'opening';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash;
      if (h === '#esamina' || h === '#scene-1-esamina') {
        setCurrentView('scene-1-esamina');
      } else if (h === '' || h === '#') {
        setCurrentView('opening');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleChoice = (choice: ChoiceHotspot) => {
    if (choice.id === 'esamina') {
      window.location.hash = '#esamina';
      setCurrentView('scene-1-esamina');
    }
  };

  const handleBackToBook = () => {
    window.location.hash = '';
    setCurrentView('opening');
  };

  return (
    <div className="app-shell">
      {currentView === 'scene-1-esamina' ? (
        <SceneVideoPage onBack={handleBackToBook} />
      ) : (
        <OpeningScene onChoice={handleChoice} />
      )}
    </div>
  );
}
