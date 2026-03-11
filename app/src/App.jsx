import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ConfiguratorPage from './pages/ConfiguratorPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/build" element={<ConfiguratorPage />} />
    </Routes>
  );
}

export default App;
