import { useEffect } from 'react';
import CarViewer from './components/CarViewer';
import CarSelector from './components/CarSelector';
import PartSelector from './components/PartSelector';
import CostPanel from './components/CostPanel';
import SavedBuilds from './components/SavedBuilds';
import useStore from './store/useStore';
import { getPartsForCar } from './data/parts';
import './App.css';

function App() {
  const selectCar = useStore((s) => s.selectCar);
  const addPart = useStore((s) => s.addPart);

  // Load build from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const buildParam = params.get('build');
    if (buildParam) {
      try {
        const data = JSON.parse(atob(buildParam));
        if (data.car) {
          selectCar(data.car);
          if (data.parts) {
            const available = getPartsForCar(data.car);
            for (const partId of data.parts) {
              const part = available.find((p) => p.id === partId);
              if (part) {
                setTimeout(() => addPart(part), 0);
              }
            }
          }
        }
      } catch {
        // Invalid build param, ignore
      }
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>3D Car Configurator</h1>
        <p className="app-subtitle">Build. Visualize. Price.</p>
      </header>

      <main className="app-layout">
        <aside className="sidebar sidebar-left">
          <CarSelector />
          <SavedBuilds />
        </aside>

        <section className="main-content">
          <CarViewer />
        </section>

        <aside className="sidebar sidebar-right">
          <PartSelector />
          <CostPanel />
        </aside>
      </main>
    </div>
  );
}

export default App;
