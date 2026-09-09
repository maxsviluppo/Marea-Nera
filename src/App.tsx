import { useState, useEffect } from 'react';
import OpeningScene from './components/OpeningScene';
import SceneVideoPage from './components/SceneVideoPage';
import { type ChoiceHotspot } from './config/sceneCard1';
import './App.css';

type PageView = 'opening' | 'scene-1-esamina';

export default function App() {
  // Comincia sempre dal principio
  const [currentView, setCurrentView] = useState<PageView>('opening');

  useEffect(() => {
    // Pulisce qualsiasi hash nell'URL in modo che a ogni ricarica si riparta dall'inizio
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleChoice = (choice: ChoiceHotspot) => {
    if (choice.id === 'esamina') {
      setCurrentView('scene-1-esamina');
    }
  };

  return (
    <div className="app-shell">
      {currentView === 'scene-1-esamina' ? (
        <SceneVideoPage />
      ) : (
        <OpeningScene onChoice={handleChoice} />
      )}
    </div>
  );
}
