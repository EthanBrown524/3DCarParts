import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  STORE_COMPANIES,
  STORE_CATEGORIES,
  STORE_PRODUCTS,
  STORE_FILTER_CATEGORIES,
} from '../data/storeData';
import './ModStorePage.css';

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

export default function ModStorePage() {
  const [viewMode, setViewMode]     = useState('row'); // 'row' | 'grid'
  const [storeTab, setStoreTab]     = useState('products');
  const [catFilter, setCatFilter]   = useState('all');
  const navigate = useNavigate();

  function goToConfigurator() { navigate('/build'); }

  const filteredProducts = catFilter === 'all'
    ? STORE_PRODUCTS
    : STORE_PRODUCTS.filter(p => p.category === catFilter);

  /* Categories that have at least one product */
  const populatedCats = STORE_FILTER_CATEGORIES.filter(fc =>
    fc.id === 'all'
      ? false
      : STORE_PRODUCTS.some(p => p.category === fc.id)
  );

  return (
    <div className="store-page">

      {/* Nav */}
      <nav className="page-nav">
        <Link to="/" className="page-nav-brand">
          <span className="brand-icon">◈</span> 3D Car Parts
        </Link>
        <div className="page-nav-links">
          <Link to="/" className="page-nav-link">Home</Link>
          <Link to="/builds" className="page-nav-link">Community</Link>
          <button className="nav-cta" onClick={goToConfigurator}>
            Open Configurator →
          </button>
        </div>
      </nav>

      {/* Page header */}
      <header className="store-page-header">
        <div className="store-page-header-inner">
          <div className="store-eyebrow">Aftermarket</div>
          <h1 className="store-page-title">Mod Store</h1>
          <p className="store-page-subtitle">
            Parts from the world's leading aftermarket brands — browse, filter, and add to your build
          </p>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'row' ? 'active' : ''}`}
            onClick={() => setViewMode('row')}
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
        <div className="store-rows-container">
          {/* Brands row */}
          <div className="store-row-section">
            <div className="store-row-header">
              <span className="store-row-icon">🏭</span>
              <h2 className="store-row-title">Brands</h2>
              <span className="store-row-count">{STORE_COMPANIES.length} companies</span>
            </div>
            <div className="store-row-scroll">
              {STORE_COMPANIES.map((co) => (
                <div key={co.id} className="company-card-sm" onClick={goToConfigurator}>
                  <div className="company-logo-mark" style={{ color: co.accent }}>
                    {co.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="company-country">{co.country}</div>
                  <div className="company-name">{co.name}</div>
                  <div className="company-specialty" style={{ color: co.accent }}>{co.specialty}</div>
                  <div className="company-product-count">{co.products} products</div>
                </div>
              ))}
            </div>
          </div>

          {/* One row per product category */}
          {populatedCats.map(fc => {
            const catProducts = STORE_PRODUCTS.filter(p => p.category === fc.id);
            const catMeta = STORE_CATEGORIES.find(c => c.id === fc.id);
            return (
              <div key={fc.id} className="store-row-section">
                <div className="store-row-header">
                  <span className="store-row-icon">{catMeta?.icon ?? '📦'}</span>
                  <h2 className="store-row-title">{fc.label}</h2>
                  <span className="store-row-count">{catProducts.length} products</span>
                  {catMeta && (
                    <span className="store-row-desc">{catMeta.desc}</span>
                  )}
                </div>
                <div className="store-row-scroll">
                  {catProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      delay={i * 40}
                      onAdd={goToConfigurator}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="store-grid-container">
          {/* Tab bar */}
          <div className="store-tab-bar">
            {[
              { id: 'products',   label: 'Products',   icon: '🛒' },
              { id: 'companies',  label: 'Brands',     icon: '🏭' },
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

          {/* Products */}
          {storeTab === 'products' && (
            <>
              <div className="store-subfilter">
                {STORE_FILTER_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`store-subfilter-btn ${catFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setCatFilter(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="store-products-grid">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    delay={i * 40}
                    onAdd={goToConfigurator}
                  />
                ))}
              </div>
            </>
          )}

          {/* Brands */}
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

          {/* Categories */}
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
      )}

    </div>
  );
}

function ProductCard({ product, delay, onAdd, compact }) {
  return (
    <div
      className={`product-card ${compact ? 'product-card-compact' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onAdd}
    >
      {product.badge && (
        <div className="product-badge" style={{ color: product.badgeColor }}>
          {product.badge}
        </div>
      )}
      <div className="product-visual">
        <div className="product-brand-mark">{product.brand.slice(0, 2).toUpperCase()}</div>
        <div className="product-category-chip">{product.category}</div>
      </div>
      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-subtitle">{product.subtitle}</div>
        {!compact && <div className="product-desc">{product.desc}</div>}
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
        {!compact && <div className="product-compat">{product.compatible}</div>}
      </div>
      <div className="product-footer">
        <span className="product-price">${product.price.toLocaleString()}</span>
        <span className="product-unit">/ {product.unit}</span>
        <button
          className="product-cta"
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
        >
          Add to Build
        </button>
      </div>
    </div>
  );
}
