import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectList } from './pages/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';
import { Challenge } from './pages/Challenge';
import { PWAPrompt } from './components/PWAPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useMLStore } from './store/useMLStore';


function App() {
  // Load the model in the background once the first screen is up, so it is ready
  // before the user opens Training or the Challenge.
  useEffect(() => {
    const start = () => { useMLStore.getState().loadModel(); };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 500);
    return () => window.clearTimeout(id);
  }, []);

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