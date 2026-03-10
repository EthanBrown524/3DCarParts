import { partCategories } from '../data/parts';
import { getFitmentSummary } from '../utils/fitment';
import { formatPrice } from '../utils/costCalculator';
import useStore from '../store/useStore';

export default function PartSelector() {
  const selectedCar = useStore((s) => s.selectedCar);
  const availableParts = useStore((s) => s.availableParts);
  const selectedParts = useStore((s) => s.selectedParts);
  const activeCategory = useStore((s) => s.activeCategory);
  const fitmentResults = useStore((s) => s.fitmentResults);
  const setActiveCategory = useStore((s) => s.setActiveCategory);
  const addPart = useStore((s) => s.addPart);
  const removePart = useStore((s) => s.removePart);

  if (!selectedCar) return null;

  const visibleCategories = partCategories.filter((cat) =>
    selectedCar.modSlots.includes(cat.id)
  );

  const categoryParts = availableParts.filter((p) => p.category === activeCategory);
  const selectedPartIds = new Set(selectedParts.map((p) => p.id));

  return (
    <div className="part-selector">
      <h3>Aftermarket Parts</h3>

      {/* Category tabs */}
      <div className="category-tabs">
        {visibleCategories.map((cat) => {
          const hasSelection = selectedParts.some((p) => p.category === cat.id);
          return (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''} ${hasSelection ? 'has-selection' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Parts list */}
      <div className="parts-list">
        {categoryParts.map((part) => {
          const isSelected = selectedPartIds.has(part.id);
          const fitment = fitmentResults[part.id];
          const fitSummary = fitment ? getFitmentSummary(fitment) : null;

          return (
            <div
              key={part.id}
              className={`part-card ${isSelected ? 'selected' : ''}`}
            >
              {/* Color swatch for paint/wraps */}
              {part.color && (
                <div
                  className="color-swatch"
                  style={{ backgroundColor: part.color }}
                />
              )}

              <div className="part-info">
                <div className="part-brand">{part.brand}</div>
                <div className="part-name">{part.name}</div>
                <div className="part-description">{part.description}</div>
                <div className="part-price">
                  {formatPrice(part.priceUnit === 'each' ? part.price * (part.quantity || 1) : part.price)}
                  {part.priceUnit === 'each' && <span className="price-note"> (set of {part.quantity})</span>}
                  {part.laborCost > 0 && (
                    <span className="labor-note"> + {formatPrice(part.laborCost)} labor</span>
                  )}
                </div>

                {/* Fitment badge */}
                {isSelected && fitSummary && (
                  <div className={`fitment-badge fitment-${fitSummary.status}`}>
                    {fitSummary.status === 'good' && '✓ '}
                    {fitSummary.status === 'warning' && '⚠ '}
                    {fitSummary.status === 'error' && '✕ '}
                    {fitSummary.message}
                  </div>
                )}

                {/* Fitment details */}
                {isSelected && fitment && fitment.warnings.length > 0 && (
                  <ul className="fitment-warnings">
                    {fitment.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                )}
                {isSelected && fitment && fitment.errors.length > 0 && (
                  <ul className="fitment-errors">
                    {fitment.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                className={`part-action ${isSelected ? 'remove' : 'add'}`}
                onClick={() => (isSelected ? removePart(part.id) : addPart(part))}
              >
                {isSelected ? 'Remove' : 'Add'}
              </button>
            </div>
          );
        })}
        {categoryParts.length === 0 && (
          <p className="no-results">No parts available in this category for your vehicle.</p>
        )}
      </div>
    </div>
  );
}
