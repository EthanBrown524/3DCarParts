import { create } from 'zustand';
import { cars } from '../data/cars';
import { getPartsForCar } from '../data/parts';
import { validateFitment } from '../utils/fitment';
import { calculateBuildCost } from '../utils/costCalculator';

const useStore = create((set, get) => ({
  // Car selection
  selectedCarId: null,
  selectedCar: null,

  // Parts
  availableParts: [],
  selectedParts: [], // array of part objects
  activeCategory: null,

  // Fitment results (keyed by part id)
  fitmentResults: {},

  // Cost
  costBreakdown: null,

  // UI state
  viewerColor: '#cccccc',
  showFitmentPanel: false,

  // Scene / environment settings
  sceneConfig: {
    preset: 'studio',
    bgColor: '#d8d8d8',
    groundColor: '#f0f0f0',
    ambientIntensity: 0.9,
    sunIntensity: 1.6,
    sunColor: '#fff8f0',
    envPreset: 'studio',
    showGrid: true,
  },

  setSceneConfig: (partial) =>
    set((s) => ({ sceneConfig: { ...s.sceneConfig, ...partial } })),

  // Saved builds
  savedBuilds: JSON.parse(localStorage.getItem('savedBuilds') || '[]'),

  // Actions
  selectCar: (carId) => {
    const car = cars.find((c) => c.id === carId);
    const available = car ? getPartsForCar(carId) : [];
    set({
      selectedCarId: carId,
      selectedCar: car,
      availableParts: available,
      selectedParts: [],
      fitmentResults: {},
      costBreakdown: null,
      activeCategory: car?.modSlots[0] || null,
      viewerColor: '#cccccc',
    });
  },

  setActiveCategory: (category) => set({ activeCategory: category }),

  addPart: (part) => {
    const { selectedCar, selectedParts } = get();
    // Don't add duplicate category (replace instead)
    const filtered = selectedParts.filter((p) => p.category !== part.category);
    const newParts = [...filtered, part];

    // Run fitment check
    const fitment = validateFitment(selectedCar, part);
    const fitmentResults = { ...get().fitmentResults, [part.id]: fitment };

    // Update color if paint/wrap
    let viewerColor = get().viewerColor;
    if (part.category === 'paint' && part.color) {
      viewerColor = part.color;
    }

    const costBreakdown = calculateBuildCost(newParts);

    set({
      selectedParts: newParts,
      fitmentResults,
      costBreakdown,
      viewerColor,
    });
  },

  removePart: (partId) => {
    const { selectedParts, fitmentResults } = get();
    const part = selectedParts.find((p) => p.id === partId);
    const newParts = selectedParts.filter((p) => p.id !== partId);
    const newFitment = { ...fitmentResults };
    delete newFitment[partId];

    let viewerColor = get().viewerColor;
    if (part?.category === 'paint') {
      viewerColor = '#cccccc';
    }

    const costBreakdown = newParts.length > 0 ? calculateBuildCost(newParts) : null;

    set({
      selectedParts: newParts,
      fitmentResults: newFitment,
      costBreakdown,
      viewerColor,
    });
  },

  toggleFitmentPanel: () => set((s) => ({ showFitmentPanel: !s.showFitmentPanel })),

  saveBuild: () => {
    const { selectedCar, selectedParts, costBreakdown, savedBuilds } = get();
    if (!selectedCar || selectedParts.length === 0) return null;

    const build = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      car: { id: selectedCar.id, make: selectedCar.make, model: selectedCar.model, year: selectedCar.year },
      parts: selectedParts.map((p) => ({ id: p.id, name: p.name, brand: p.brand, category: p.category })),
      totalCost: costBreakdown?.total || 0,
    };

    const updated = [...savedBuilds, build];
    localStorage.setItem('savedBuilds', JSON.stringify(updated));
    set({ savedBuilds: updated });
    return build;
  },

  deleteBuild: (buildId) => {
    const updated = get().savedBuilds.filter((b) => b.id !== buildId);
    localStorage.setItem('savedBuilds', JSON.stringify(updated));
    set({ savedBuilds: updated });
  },

  loadBuild: (build) => {
    const { selectCar, addPart } = get();
    selectCar(build.car.id);
    // Need to re-add parts from IDs
    const available = getPartsForCar(build.car.id);
    for (const bp of build.parts) {
      const fullPart = available.find((p) => p.id === bp.id);
      if (fullPart) {
        // Use set directly since addPart reads from get()
        setTimeout(() => get().addPart(fullPart), 0);
      }
    }
  },

  getShareUrl: () => {
    const { selectedCar, selectedParts } = get();
    if (!selectedCar) return '';
    const data = {
      car: selectedCar.id,
      parts: selectedParts.map((p) => p.id),
    };
    const encoded = btoa(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}#/build?build=${encoded}`;
  },
}));

export default useStore;
