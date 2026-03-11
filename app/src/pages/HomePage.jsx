import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cars, searchCars } from '../data/cars';
import './HomePage.css';

const CAR_META = {
  'civic-2024':   { gradient: 'linear-gradient(135deg, #1a3a6e 0%, #0f1a35 100%)', emoji: '🏎️', tag: 'Most Popular', tagColor: '#4f8fff' },
  'mustang-2024': { gradient: 'linear-gradient(135deg, #6e2a1a 0%, #350f0f 100%)', emoji: '🐎', tag: 'Trending',      tagColor: '#ff6b2b' },
  'wrx-2024':     { gradient: 'linear-gradient(135deg, #1a4a3a 0%, #0a2218 100%)', emoji: '🚀', tag: 'Rally Icon',    tagColor: '#00d4aa' },
  'camry-2024':   { gradient: 'linear-gradient(135deg, #3a2a6e 0%, #1a1235 100%)', emoji: '🚗', tag: 'Best Value',    tagColor: '#a78bfa' },
  'model3-2024':  { gradient: 'linear-gradient(135deg, #6e1a1a 0%, #350a0a 100%)', emoji: '⚡', tag: 'Electric',      tagColor: '#ef4444' },
};

const POPULAR_MODS = [
  { id: 'wheels',      icon: '🔩', label: 'Wheels',         desc: 'Forged, cast & multi-piece options' },
  { id: 'exhaust',     icon: '💨', label: 'Exhaust',        desc: 'Cat-back systems & headers' },
  { id: 'spoiler',     icon: '🏁', label: 'Spoilers',       desc: 'Carbon wings & ducktail spoilers' },
  { id: 'paint',       icon: '🎨', label: 'Paint & Wrap',   desc: 'Custom resprays & vinyl wraps' },
  { id: 'frontBumper', icon: '🛡️', label: 'Bumpers',        desc: 'Aero front & rear bumpers' },
  { id: 'hood',        icon: '🔲', label: 'Hoods',          desc: 'Vented & carbon fiber hoods' },
];

const STATS = [
  { value: '5+',   label: 'Car Models' },
  { value: '20+',  label: 'Aftermarket Parts' },
  { value: '3D',   label: 'Live Preview' },
  { value: '100%', label: 'Free to Use' },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const results = query.trim() ? searchCars(query) : cars;

  function goToBuild(carId) {
    navigate(`/build?car=${carId}`);
  }

  function goToConfigurator() {
    navigate('/build');
  }

  return (
    <div className="home">
      {/* ── Nav ── */}
      <nav className="home-nav">
        <div className="home-nav-brand">
          <span className="brand-icon">◈</span> 3D Car Parts
        </div>
        <div className="home-nav-links">
          <a href="#trending">Trending</a>
          <a href="#mods">Mods</a>
          <button className="nav-cta" onClick={goToConfigurator}>
            Open Configurator →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">3D Car Parts Configurator</div>
          <h1 className="hero-title">
            Build Your<br />
            <span className="hero-title-accent">Dream Car</span>
          </h1>
          <p className="hero-subtitle">
            Browse aftermarket parts, visualize modifications in real-time 3D,
            and get an instant cost breakdown — all in one place.
          </p>

          {/* Search */}
          <div className="hero-search-wrap">
            <div className="hero-search">
              <span className="hero-search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search by make, model, or year…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="hero-search-input"
              />
              {query && (
                <button className="hero-search-clear" onClick={() => setQuery('')}>✕</button>
              )}
            </div>
            {query && (
              <div className="search-hint">
                {results.length} car{results.length !== 1 ? 's' : ''} found — click to configure
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending Cars ── */}
      <section id="trending" className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {query ? `Results for "${query}"` : 'Trending Cars'}
            </h2>
            <p className="section-subtitle">
              {query ? 'Click any car to open the configurator' : 'The most-configured vehicles on the platform right now'}
            </p>
          </div>
          {!query && <span className="section-badge">🔥 Hot right now</span>}
        </div>

        {results.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <p>No cars found for "{query}"</p>
            <button className="btn-ghost" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : (
          <div className="cars-grid">
            {results.map((car, i) => {
              const meta = CAR_META[car.id] ?? {
                gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
                emoji: '🚗',
                tag: 'Popular',
                tagColor: '#4f8fff',
              };
              return (
                <div
                  key={car.id}
                  className="car-card-hero"
                  onClick={() => goToBuild(car.id)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="car-card-visual" style={{ background: meta.gradient }}>
                    <span className="car-card-emoji">{meta.emoji}</span>
                    <span className="car-card-tag" style={{ background: meta.tagColor }}>
                      {meta.tag}
                    </span>
                  </div>
                  <div className="car-card-body">
                    <div className="car-card-year">{car.year}</div>
                    <div className="car-card-name">{car.make} {car.model}</div>
                    <div className="car-card-trim">{car.trim}</div>
                    <div className="car-card-pills">
                      <span className="car-pill">{car.modSlots.length} mod slots</span>
                      <span className="car-pill">${car.basePrice.toLocaleString()} base</span>
                    </div>
                    <button className="car-card-btn">Configure →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Popular Modifications ── */}
      <section id="mods" className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Modifications</h2>
              <p className="section-subtitle">Browse parts by category — fitment-validated for your car</p>
            </div>
          </div>
          <div className="mods-grid">
            {POPULAR_MODS.map((mod) => (
              <div key={mod.id} className="mod-card" onClick={goToConfigurator}>
                <span className="mod-icon">{mod.icon}</span>
                <div className="mod-label">{mod.label}</div>
                <div className="mod-desc">{mod.desc}</div>
                <span className="mod-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three steps to your perfect build</p>
          </div>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-title">Pick Your Car</h3>
            <p className="step-desc">Select from our database of popular vehicles, each with detailed fitment specs.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-title">Add Parts</h3>
            <p className="step-desc">Browse wheels, exhausts, aero, and more — all validated for your specific car.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-title">Visualize & Price</h3>
            <p className="step-desc">See your build in 3D with real-time pricing including parts, labor, and tax.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="home-cta-glow" />
        <div className="home-cta-content">
          <h2 className="home-cta-title">Ready to start building?</h2>
          <p className="home-cta-sub">No sign-up required. Save and share your builds instantly.</p>
          <button className="cta-btn" onClick={goToConfigurator}>
            Open the Configurator →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <span className="home-footer-brand">◈ 3D Car Parts</span>
        <span className="home-footer-copy">Open-source car configurator</span>
      </footer>
    </div>
  );
}
