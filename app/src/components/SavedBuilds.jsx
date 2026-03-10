import { formatPrice } from '../utils/costCalculator';
import useStore from '../store/useStore';

export default function SavedBuilds() {
  const savedBuilds = useStore((s) => s.savedBuilds);
  const deleteBuild = useStore((s) => s.deleteBuild);
  const loadBuild = useStore((s) => s.loadBuild);

  if (savedBuilds.length === 0) return null;

  return (
    <div className="saved-builds">
      <h3>Saved Builds</h3>
      <div className="builds-list">
        {savedBuilds.map((build) => (
          <div key={build.id} className="build-card">
            <div className="build-info">
              <div className="build-car">
                {build.car.year} {build.car.make} {build.car.model}
              </div>
              <div className="build-meta">
                {build.parts.length} part{build.parts.length !== 1 ? 's' : ''} &middot;{' '}
                {formatPrice(build.totalCost)}
              </div>
              <div className="build-date">
                {new Date(build.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="build-actions">
              <button className="btn btn-sm" onClick={() => loadBuild(build)}>
                Load
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteBuild(build.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
