import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CarViewer from '../components/CarViewer';
import CarSelector from '../components/CarSelector';
import PartSelector from '../components/PartSelector';
import CostPanel from '../components/CostPanel';
import SavedBuilds from '../components/SavedBuilds';
import ScenePanel from '../components/ScenePanel';
import useStore from '../store/useStore';
import { getPartsForCar } from '../data/parts';

function ConfiguratorPage() {
  const selectCar = useStore((s) => s.selectCar);
  const addPart = useStore((s) => s.addPart);
  const [searchParams] = useSearchParams();
  const [rightTab, setRightTab] = useState('parts');

  useEffect(() => {
    const buildParam = searchParams.get('build');
    const carParam = searchParams.get('car');

    if (buildParam) {
      try {
        const data = JSON.parse(atob(buildParam));
        if (data.car) {
          selectCar(data.car);
          if (data.parts) {
            const available = getPartsForCar(data.car);
            for (const partId of data.parts) {
              const part = available.find((p) => p.id === partId);
              if (part) setTimeout(() => addPart(part), 0);
            }
          }
        }
      } catch {
        // Invalid build param, ignore
      }
    } else if (carParam) {
      selectCar(carParam);
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <Link to="/" className="app-back-link">← Home</Link>
          <span className="app-header-divider">|</span>
          <span className="app-logo-text">3D Car Parts</span>
        </div>
        <span className="app-subtitle">Build. Visualize. Price.</span>
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
          {/* Tab switcher */}
          <div className="right-tab-bar">
            <button
              className={`right-tab ${rightTab === 'parts' ? 'active' : ''}`}
              onClick={() => setRightTab('parts')}
            >
              🔧 Parts
            </button>
            <button
              className={`right-tab ${rightTab === 'scene' ? 'active' : ''}`}
              onClick={() => setRightTab('scene')}
            >
              🎬 Scene
            </button>
          </div>

          {rightTab === 'parts' ? (
            <>
              <PartSelector />
              <CostPanel />
            </>
          ) : (
            <ScenePanel />
          )}
        </aside>
      </main>
    </div>
  );
}

export default ConfiguratorPage;
