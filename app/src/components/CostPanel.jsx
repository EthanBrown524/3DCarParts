import { formatPrice } from '../utils/costCalculator';
import useStore from '../store/useStore';

export default function CostPanel() {
  const costBreakdown = useStore((s) => s.costBreakdown);
  const selectedParts = useStore((s) => s.selectedParts);
  const saveBuild = useStore((s) => s.saveBuild);
  const getShareUrl = useStore((s) => s.getShareUrl);

  if (!costBreakdown || selectedParts.length === 0) return null;

  const handleShare = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      alert('Build link copied to clipboard!');
    });
  };

  const handleSave = () => {
    const build = saveBuild();
    if (build) {
      alert(`Build saved! (ID: ${build.id})`);
    }
  };

  return (
    <div className="cost-panel">
      <h3>Build Cost</h3>

      <div className="cost-line-items">
        {costBreakdown.lineItems.map((item) => (
          <div key={item.id} className="cost-line">
            <span className="cost-line-name">{item.name}</span>
            <span className="cost-line-price">{formatPrice(item.totalPrice)}</span>
          </div>
        ))}
      </div>

      <div className="cost-summary">
        <div className="cost-row">
          <span>Parts</span>
          <span>{formatPrice(costBreakdown.partsCost)}</span>
        </div>
        <div className="cost-row">
          <span>Labor</span>
          <span>{formatPrice(costBreakdown.laborCost)}</span>
        </div>
        <div className="cost-row">
          <span>Tax ({(costBreakdown.taxRate * 100).toFixed(0)}%)</span>
          <span>{formatPrice(costBreakdown.tax)}</span>
        </div>
        <div className="cost-row cost-total">
          <span>Total</span>
          <span>{formatPrice(costBreakdown.total)}</span>
        </div>
      </div>

      <div className="cost-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Build
        </button>
        <button className="btn btn-secondary" onClick={handleShare}>
          Share Build
        </button>
      </div>
    </div>
  );
}
