import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BUILD_CATEGORIES, COMMUNITY_BUILDS } from '../data/communityBuilds';
import './CommunityBuildsPage.css';

const NON_ALL_CATS = BUILD_CATEGORIES.filter(c => c.id !== 'all');

export default function CommunityBuildsPage() {
  const [viewMode, setViewMode] = useState('row'); // 'row' | 'grid'
  const [activeGridCat, setActiveGridCat] = useState('all');
  const navigate = useNavigate();

  function goToBuild(carId) { navigate(`/build?car=${carId}`); }

  const gridBuilds = activeGridCat === 'all'
    ? [...COMMUNITY_BUILDS].sort((a, b) => b.likes - a.likes)
    : COMMUNITY_BUILDS.filter(b => b.tags.includes(activeGridCat));

  return (
    <div className="builds-page">

      {/* Nav */}
      <nav className="page-nav">
        <Link to="/" className="page-nav-brand">
          <span className="brand-icon">◈</span> 3D Car Parts
        </Link>
        <div className="page-nav-links">
          <Link to="/" className="page-nav-link">Home</Link>
          <Link to="/store" className="page-nav-link">Mod Store</Link>
          <button className="nav-cta" onClick={() => navigate('/build')}>
            Open Configurator →
          </button>
        </div>
      </nav>

      {/* Page header */}
      <header className="builds-page-header">
        <div className="builds-page-header-inner">
          <div className="builds-eyebrow">Community</div>
          <h1 className="builds-page-title">Community Builds</h1>
          <p className="builds-page-subtitle">
            Real builds from real builders — clone any build to start your own
          </p>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'row' ? 'active' : ''}`}
            onClick={() => setViewMode('row')}
            title="Row view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor"/>
              <rect x="1" y="7" width="14" height="3" rx="1" fill="currentColor"/>
              <rect x="1" y="12" width="14" height="3" rx="1" fill="currentColor"/>
            </svg>
            Rows
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/>
            </svg>
            Grid
          </button>
        </div>
      </header>

      {/* ── ROW VIEW ── */}
      {viewMode === 'row' && (
        <div className="builds-rows-container">
          {/* Hot Builds row (all sorted by likes) */}
          <BuildRow
            category={BUILD_CATEGORIES[0]}
            builds={[...COMMUNITY_BUILDS].sort((a, b) => b.likes - a.likes)}
            onClone={goToBuild}
          />
          {/* One row per category */}
          {NON_ALL_CATS.map(cat => {
            const catBuilds = COMMUNITY_BUILDS.filter(b => b.tags.includes(cat.id));
            if (catBuilds.length === 0) return null;
            return (
              <BuildRow
                key={cat.id}
                category={cat}
                builds={catBuilds}
                onClone={goToBuild}
              />
            );
          })}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="builds-grid-container">
          <div className="build-filter-bar">
            {BUILD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`build-filter-tab ${activeGridCat === cat.id ? 'active' : ''}`}
                onClick={() => setActiveGridCat(cat.id)}
              >
                <span className="build-filter-icon">{cat.icon}</span>
                {cat.label}
                {cat.id !== 'all' && (
                  <span className="build-filter-count">
                    {COMMUNITY_BUILDS.filter(b => b.tags.includes(cat.id)).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="community-builds-grid">
            {gridBuilds.map((build, i) => (
              <BuildCard
                key={build.id}
                build={build}
                delay={i * 50}
                onClone={goToBuild}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

function BuildRow({ category, builds, onClone }) {
  return (
    <div className="build-row-section">
      <div className="build-row-header">
        <span className="build-row-icon">{category.icon}</span>
        <h2 className="build-row-title">{category.label}</h2>
        <span className="build-row-count">{builds.length} builds</span>
      </div>
      <div className="build-row-scroll">
        {builds.map((build, i) => (
          <BuildCard
            key={build.id}
            build={build}
            delay={i * 40}
            onClone={onClone}
            compact
          />
        ))}
      </div>
    </div>
  );
}

function BuildCard({ build, delay, onClone, compact }) {
  return (
    <div
      className={`build-card ${compact ? 'build-card-compact' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClone(build.carId)}
    >
      <div className="build-card-visual" style={{ background: build.gradient }}>
        <span className="build-emoji">{build.emoji}</span>
        <div className="build-badge" style={{ color: build.accent }}>{build.badge}</div>
        <div className="build-card-stats">
          <span className="build-likes">♥ {build.likes.toLocaleString()}</span>
        </div>
      </div>
      <div className="build-card-body">
        <div className="build-meta-row">
          <span className="build-builder">@{build.builder}</span>
          <span className="build-type-pills">
            {build.tags.map(t => (
              <span key={t} className="build-type-pill">{t}</span>
            ))}
          </span>
        </div>
        <div className="build-name">{build.name}</div>
        <div className="build-car-label">{build.carLabel}</div>
        <div className="build-mods-list">
          {build.mods.slice(0, 3).map((mod, j) => (
            <span key={j} className="build-mod-chip">{mod}</span>
          ))}
          {build.mods.length > 3 && (
            <span className="build-mod-chip build-mod-more">+{build.mods.length - 3} more</span>
          )}
        </div>
        <div className="build-footer">
          <span className="build-cost">${build.cost.toLocaleString()}</span>
          <button
            className="build-clone-btn"
            onClick={(e) => { e.stopPropagation(); onClone(build.carId); }}
          >
            Clone →
          </button>
        </div>
      </div>
    </div>
  );
}
