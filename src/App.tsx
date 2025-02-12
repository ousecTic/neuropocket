import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectList } from './pages/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';
import { Support } from './pages/Support';
import { Challenge } from './pages/Challenge';
import { PWAPrompt } from './components/PWAPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/support" element={<Support />} />
        <Route path="/challenge" element={<Challenge />} />
      </Routes>
      <PWAPrompt />
      <OfflineIndicator />
    </Router>
  );
}

export default App;