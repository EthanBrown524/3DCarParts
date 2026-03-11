import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cars, searchCars } from '../data/cars';
import { BUILD_CATEGORIES, COMMUNITY_BUILDS } from '../data/communityBuilds';
import { STORE_COMPANIES, STORE_CATEGORIES, STORE_PRODUCTS, STORE_FILTER_CATEGORIES } from '../data/storeData';
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

function StarRating({ rating }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="star-rating">
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeBuildCat, setActiveBuildCat] = useState('all');
  const [storeTab, setStoreTab] = useState('products');
  const [storeCatFilter, setStoreCatFilter] = useState('all');
  const navigate = useNavigate();

  const searchResults = query.trim() ? searchCars(query) : cars;

  const filteredBuilds = activeBuildCat === 'all'
    ? [...COMMUNITY_BUILDS].sort((a, b) => b.likes - a.likes)
    : COMMUNITY_BUILDS.filter(b => b.tags.includes(activeBuildCat));

  const filteredProducts = storeCatFilter === 'all'
    ? STORE_PRODUCTS
    : STORE_PRODUCTS.filter(p => p.category === storeCatFilter);

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
          <a href="#trending">Builds</a>
          <a href="#store">Store</a>
          <a href="#how">How It Works</a>
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
            <span className="hero-title-accent">Dream Car</span>
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

      {/* ── Trending / Community Builds ── */}
      <section id="trending" className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              {query ? `Results for "${query}"` : 'Community Builds'}
            </h2>
            <p className="section-subtitle">
              {query
                ? 'Click any car to open the configurator'
                : 'Real builds from the community — clone any build to start your own'}
            </p>
          </div>
          {!query && <span className="section-badge">🔥 Live builds</span>}
        </div>

        {/* Build category filter */}
        {!query && (
          <div className="build-filter-bar">
            {BUILD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`build-filter-tab ${activeBuildCat === cat.id ? 'active' : ''}`}
                onClick={() => setActiveBuildCat(cat.id)}
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
        )}

        {/* Car search results */}
        {query ? (
          searchResults.length === 0 ? (
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
          )
        ) : (
          /* Community build cards */
          filteredBuilds.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🏎️</span>
              <p>No builds in this category yet</p>
            </div>
          ) : (
            <div className="community-builds-grid">
              {filteredBuilds.map((build, i) => (
                <div
                  key={build.id}
                  className="build-card"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => goToBuild(build.carId)}
                >
                  {/* Visual area */}
                  <div className="build-card-visual" style={{ background: build.gradient }}>
                    <span className="build-emoji">{build.emoji}</span>
                    <div className="build-badge" style={{ color: build.accent }}>{build.badge}</div>
                    <div className="build-card-stats">
                      <span className="build-likes">♥ {build.likes.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Info */}
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
                        onClick={(e) => { e.stopPropagation(); goToBuild(build.carId); }}
                      >
                        Clone Build →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </section>

      {/* ── Mod Store ── */}
      <section id="store" className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Mod Store</h2>
              <p className="section-subtitle">Browse the full catalog — parts from the world's leading aftermarket brands</p>
            </div>
            <span className="section-badge">🏪 {STORE_PRODUCTS.length}+ products</span>
          </div>

          {/* Store tabs */}
          <div className="store-tab-bar">
            {[
              { id: 'products',   label: 'Products',  icon: '🛒' },
              { id: 'companies',  label: 'Brands',    icon: '🏭' },
              { id: 'categories', label: 'Categories', icon: '📦' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`store-tab ${storeTab === tab.id ? 'active' : ''}`}
                onClick={() => setStoreTab(tab.id)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* ── Products tab ── */}
          {storeTab === 'products' && (
            <>
              {/* Sub-filter */}
              <div className="store-subfilter">
                {STORE_FILTER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`store-subfilter-btn ${storeCatFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setStoreCatFilter(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="store-products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card" onClick={goToConfigurator}>
                    {product.badge && (
                      <div className="product-badge" style={{ color: product.badgeColor }}>
                        {product.badge}
                      </div>
                    )}
                    {/* Visual area */}
                    <div className="product-visual">
                      <div className="product-brand-mark">{product.brand.slice(0, 2).toUpperCase()}</div>
                      <div className="product-category-chip">{product.category}</div>
                    </div>
                    <div className="product-body">
                      <div className="product-brand">{product.brand}</div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-subtitle">{product.subtitle}</div>
                      <div className="product-desc">{product.desc}</div>
                      {product.colors.length > 0 && (
                        <div className="product-colors">
                          {product.colors.map((c, i) => (
                            <span key={i} className="product-color-dot" style={{ background: c }} />
                          ))}
                        </div>
                      )}
                      <div className="product-rating-row">
                        <StarRating rating={product.rating} />
                        <span className="product-review-count">({product.reviews.toLocaleString()})</span>
                      </div>
                      <div className="product-compat">{product.compatible}</div>
                    </div>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toLocaleString()}</span>
                      <span className="product-unit">/ {product.unit}</span>
                      <button className="product-cta" onClick={(e) => { e.stopPropagation(); goToConfigurator(); }}>
                        Add to Build
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Companies/Brands tab ── */}
          {storeTab === 'companies' && (
            <div className="store-companies-grid">
              {STORE_COMPANIES.map((co) => (
                <div key={co.id} className="company-card" onClick={goToConfigurator}>
                  <div className="company-card-header">
                    <div className="company-logo-mark" style={{ color: co.accent }}>
                      {co.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="company-country">{co.country}</div>
                  </div>
                  <div className="company-name">{co.name}</div>
                  <div className="company-specialty" style={{ color: co.accent }}>{co.specialty}</div>
                  <div className="company-tagline">{co.tagline}</div>
                  <div className="company-desc">{co.desc}</div>
                  <div className="company-footer">
                    <span className="company-product-count">{co.products} products</span>
                    <button className="company-browse-btn">Browse →</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Categories tab ── */}
          {storeTab === 'categories' && (
            <div className="store-categories-grid">
              {STORE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="store-cat-card" onClick={goToConfigurator}>
                  <span className="store-cat-icon">{cat.icon}</span>
                  <div className="store-cat-body">
                    <div className="store-cat-label">{cat.label}</div>
                    <div className="store-cat-desc">{cat.desc}</div>
                  </div>
                  <div className="store-cat-footer">
                    <span className="store-cat-count">{cat.count} products</span>
                    <span className="store-cat-arrow">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="section">
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
