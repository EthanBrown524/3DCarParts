/**
 * Cost calculator for car builds.
 * Adds up parts, labor, and taxes.
 */

const DEFAULT_TAX_RATE = 0.08; // 8%
const DEFAULT_LABOR_RATE = 85; // $/hr fallback

/**
 * Calculate total cost for a list of selected parts.
 * @param {Array} selectedParts - Array of part objects from the catalog
 * @param {Object} options - { taxRate, includeLabor }
 * @returns {Object} Detailed cost breakdown
 */
export function calculateBuildCost(selectedParts, options = {}) {
  const { taxRate = DEFAULT_TAX_RATE, includeLabor = true } = options;

  let partsCost = 0;
  let laborCost = 0;
  const lineItems = [];

  for (const part of selectedParts) {
    const qty = part.quantity || 1;
    const unitPrice = part.price || 0;
    const totalPartPrice = part.priceUnit === 'each' ? unitPrice * qty : unitPrice;
    const partLabor = includeLabor ? (part.laborCost || 0) : 0;

    partsCost += totalPartPrice;
    laborCost += partLabor;

    lineItems.push({
      id: part.id,
      name: `${part.brand} ${part.name}`,
      category: part.category,
      unitPrice,
      quantity: qty,
      priceUnit: part.priceUnit,
      totalPrice: totalPartPrice,
      laborCost: partLabor,
    });
  }

  const subtotal = partsCost + laborCost;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    lineItems,
    partsCost,
    laborCost,
    subtotal,
    taxRate,
    tax,
    total,
    partCount: selectedParts.length,
  };
}

/**
 * Format a dollar amount.
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
