import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectList } from './pages/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';
import { Challenge } from './pages/Challenge';
import { PWAPrompt } from './components/PWAPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useMLStore } from './store/useMLStore';

function App() {
  const loadModel = useMLStore(state => state.loadModel);

  // Preload MobileNet model on app startup
  useEffect(() => {
    console.log('Preloading MobileNet model in background...');
    loadModel().then(success => {
      if (success) {
        console.log('MobileNet model preloaded successfully!');
      } else {
        console.warn('Failed to preload MobileNet model');
      }
    });
  }, [loadModel]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/challenge" element={<Challenge />} />
      </Routes>
      <PWAPrompt />
      <OfflineIndicator />
    </Router>
  );
}

export default App;