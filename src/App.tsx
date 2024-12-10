import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProjectList } from './pages/ProjectList';
import { ProjectDetail } from './pages/ProjectDetail';
import { Support } from './pages/Support';
import { PWAPrompt } from './components/PWAPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<ProjectList />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <PWAPrompt />
      <OfflineIndicator />
    </Router>
  );
}

export default App;