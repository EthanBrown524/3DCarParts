import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cars, searchCars } from '../data/cars';
import { COMMUNITY_BUILDS } from '../data/communityBuilds';
import { STORE_PRODUCTS, STORE_COMPANIES } from '../data/storeData';
import './HomePage.css';

const CAR_META = {
  'civic-2024':   { gradient: 'linear-gradient(135deg, #0a1a36 0%, #060e1c 100%)', emoji: '🏎️', tag: 'Most Popular', tagColor: '#4f8fff' },
  'mustang-2024': { gradient: 'linear-gradient(135deg, #2a0a00 0%, #140500 100%)', emoji: '🐎', tag: 'Trending',      tagColor: '#E8001E' },
  'wrx-2024':     { gradient: 'linear-gradient(135deg, #001a0e 0%, #000e07 100%)', emoji: '🚀', tag: 'Rally Icon',    tagColor: '#00CC55' },
  'camry-2024':   { gradient: 'linear-gradient(135deg, #120a28 0%, #090516 100%)', emoji: '🚗', tag: 'Best Value',    tagColor: '#E8A020' },
  'model3-2024':  { gradient: 'linear-gradient(135deg, #001428 0%, #000a14 100%)', emoji: '⚡', tag: 'Electric',      tagColor: '#3388FF' },
};

const STATS = [
  { value: '5+',   label: 'Car Models' },
  { value: '24+',  label: 'Aftermarket Parts' },
  { value: '14',   label: 'Community Builds' },
  { value: '3D',   label: 'Live Preview' },
];

/* Top 3 builds to preview */
const TOP_BUILDS = [...COMMUNITY_BUILDS].sort((a, b) => b.likes - a.likes).slice(0, 3);

/* Top 4 products to preview */
const TOP_PRODUCTS = STORE_PRODUCTS.filter(p => p.popular).slice(0, 4);

export default function HomePage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchResults = query.trim() ? searchCars(query) : cars;

  function goToBuild(carId) { navigate(`/build?car=${carId}`); }
  function goToConfigurator() { navigate('/build'); }

  return (
    <div className="home">

      {/* ── Nav ── */}
      <nav className="home-nav">
        <div className="home-nav-brand">
          <span className="brand-icon">◈</span> 3D Car Parts
        </div>
        <div className="home-nav-links">
          <Link to="/builds" className="home-nav-text-link">Builds</Link>
          <Link to="/store" className="home-nav-text-link">Store</Link>
          <a href="#how" className="home-nav-text-link">How It Works</a>
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
            Build Your
            <span className="hero-title-accent"> Dream Car</span>
          </h1>
          <p className="hero-subtitle">
            Browse aftermarket parts, visualize modifications in real-time 3D,
            and get an instant cost breakdown — all in one place.
          </p>
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
                {searchResults.length} car{searchResults.length !== 1 ? 's' : ''} found — click to configure
              </div>
            )}
          </div>
        </div>
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Car search / browse ── */}
      <section id="cars" className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {query ? `Results for "${query}"` : 'Choose Your Car'}
            </h2>
            <p className="section-subtitle">
              {query
                ? 'Click any car to open the configurator'
                : 'Select a vehicle to start building'}
            </p>
          </div>
        </div>
        {searchResults.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <p>No cars found for "{query}"</p>
            <button className="btn-ghost" onClick={() => setQuery('')}>Clear search</button>
          </div>
        ) : (
          <div className="cars-grid">
            {searchResults.map((car, i) => {
              const meta = CAR_META[car.id] ?? {
                gradient: 'linear-gradient(135deg, #0a0a14 0%, #050508 100%)',
                emoji: '🚗',
                tag: 'Popular',
                tagColor: '#E8A020',
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

      {/* ── Community Builds preview ── */}
      <section id="trending" className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Community Builds</h2>
              <p className="section-subtitle">Top builds from the community — clone any build to start your own</p>
            </div>
            <span className="section-badge">🔥 {COMMUNITY_BUILDS.length} builds</span>
          </div>

          {/* Preview cards */}
          <div className="preview-cards-row">
            {TOP_BUILDS.map((build, i) => (
              <div
                key={build.id}
                className="preview-build-card"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => goToBuild(build.carId)}
              >
                <div className="preview-build-visual" style={{ background: build.gradient }}>
                  <span className="preview-emoji">{build.emoji}</span>
                  <span className="preview-likes">♥ {build.likes.toLocaleString()}</span>
                </div>
                <div className="preview-build-body">
                  <div className="preview-build-name">{build.name}</div>
                  <div className="preview-build-car">{build.carLabel}</div>
                  <div className="preview-build-cost">${build.cost.toLocaleString()}</div>
                </div>
              </div>
            ))}

            {/* "View all" card */}
            <Link to="/builds" className="preview-viewall-card">
              <span className="preview-viewall-icon">→</span>
              <span className="preview-viewall-label">View All<br />Builds</span>
              <span className="preview-viewall-count">{COMMUNITY_BUILDS.length} builds · Row &amp; Grid views</span>
            </Link>
          </div>

          <div className="section-cta-row">
            <Link to="/builds" className="section-cta-link">
              Browse all community builds →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mod Store preview ── */}
      <section id="store" className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Mod Store</h2>
            <p className="section-subtitle">Parts from {STORE_COMPANIES.length} leading aftermarket brands</p>
          </div>
          <span className="section-badge">🏪 {STORE_PRODUCTS.length}+ products</span>
        </div>

        <div className="preview-cards-row">
          {TOP_PRODUCTS.map((product, i) => (
            <div
              key={product.id}
              className="preview-product-card"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={goToConfigurator}
            >
              <div className="preview-product-visual">
                <span className="preview-product-mark">{product.brand.slice(0, 2).toUpperCase()}</span>
                {product.badge && (
                  <span className="preview-product-badge" style={{ color: product.badgeColor }}>
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="preview-product-body">
                <div className="preview-product-brand">{product.brand}</div>
                <div className="preview-product-name">{product.name}</div>
                <div className="preview-product-price">${product.price.toLocaleString()}</div>
              </div>
            </div>
          ))}

          {/* "View all" card */}
          <Link to="/store" className="preview-viewall-card">
            <span className="preview-viewall-icon">→</span>
            <span className="preview-viewall-label">View Full<br />Store</span>
            <span className="preview-viewall-count">{STORE_PRODUCTS.length} products · Row &amp; Grid views</span>
          </Link>
        </div>

        <div className="section-cta-row">
          <Link to="/store" className="section-cta-link">
            Browse the full mod store →
          </Link>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="section section-alt">
        <div className="section-inner">
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
              <p className="step-desc">Select from our database of popular vehicles, each with detailed fitment specs and mod slot compatibility.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3 className="step-title">Add Parts</h3>
              <p className="step-desc">Browse wheels, exhausts, aero, and more from top brands — all validated for your specific vehicle.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3 className="step-title">Visualize & Price</h3>
              <p className="step-desc">See your build in real-time 3D with full pricing including parts, labor, and tax. Share instantly.</p>
            </div>
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
        <div className="home-footer-links">
          <Link to="/builds">Community Builds</Link>
          <Link to="/store">Mod Store</Link>
          <Link to="/build">Configurator</Link>
        </div>
        <span className="home-footer-copy">Open-source car configurator</span>
      </footer>
    </div>
  );
}
