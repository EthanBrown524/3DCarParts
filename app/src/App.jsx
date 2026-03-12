import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import CommunityBuildsPage from './pages/CommunityBuildsPage';
import ModStorePage from './pages/ModStorePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/build" element={<ConfiguratorPage />} />
      <Route path="/builds" element={<CommunityBuildsPage />} />
      <Route path="/store" element={<ModStorePage />} />
    </Routes>
  );
}

export default App;
