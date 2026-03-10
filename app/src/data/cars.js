/**
 * Sample car database with base specs and available modification slots.
 * In production, this would come from a backend API.
 */

export const cars = [
  {
    id: 'civic-2024',
    make: 'Honda',
    model: 'Civic',
    year: 2024,
    trim: 'Sport',
    thumbnail: null,
    modelUrl: null, // GLB/glTF URL when available
    specs: {
      boltPattern: '5x114.3',
      centerBore: 64.1,
      stockWheelDiameter: 18,
      stockWheelWidth: 8,
      stockOffset: 45,
      stockTireSize: '235/40R18',
      maxWheelDiameter: 20,
      minWheelDiameter: 16,
      wheelWellClearance: 32, // mm
      brakeClearance: 17, // min wheel diameter for brakes
    },
    modSlots: ['wheels', 'spoiler', 'frontBumper', 'rearBumper', 'sideskirts', 'hood', 'paint'],
    basePrice: 28500,
  },
  {
    id: 'mustang-2024',
    make: 'Ford',
    model: 'Mustang',
    year: 2024,
    trim: 'GT',
    thumbnail: null,
    modelUrl: null,
    specs: {
      boltPattern: '5x114.3',
      centerBore: 70.5,
      stockWheelDiameter: 19,
      stockWheelWidth: 9.5,
      stockOffset: 50,
      stockTireSize: '255/40R19',
      maxWheelDiameter: 22,
      minWheelDiameter: 17,
      wheelWellClearance: 35,
      brakeClearance: 18,
    },
    modSlots: ['wheels', 'spoiler', 'frontBumper', 'rearBumper', 'sideskirts', 'hood', 'paint', 'exhaust'],
    basePrice: 42000,
  },
  {
    id: 'wrx-2024',
    make: 'Subaru',
    model: 'WRX',
    year: 2024,
    trim: 'Premium',
    thumbnail: null,
    modelUrl: null,
    specs: {
      boltPattern: '5x114.3',
      centerBore: 56.1,
      stockWheelDiameter: 18,
      stockWheelWidth: 8.5,
      stockOffset: 55,
      stockTireSize: '245/40R18',
      maxWheelDiameter: 20,
      minWheelDiameter: 17,
      wheelWellClearance: 30,
      brakeClearance: 17,
    },
    modSlots: ['wheels', 'spoiler', 'frontBumper', 'rearBumper', 'sideskirts', 'hood', 'paint', 'exhaust'],
    basePrice: 32000,
  },
  {
    id: 'camry-2024',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    trim: 'SE',
    thumbnail: null,
    modelUrl: null,
    specs: {
      boltPattern: '5x114.3',
      centerBore: 60.1,
      stockWheelDiameter: 18,
      stockWheelWidth: 8,
      stockOffset: 45,
      stockTireSize: '235/45R18',
      maxWheelDiameter: 20,
      minWheelDiameter: 16,
      wheelWellClearance: 30,
      brakeClearance: 16,
    },
    modSlots: ['wheels', 'spoiler', 'frontBumper', 'paint'],
    basePrice: 29500,
  },
  {
    id: 'model3-2024',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    trim: 'Performance',
    thumbnail: null,
    modelUrl: null,
    specs: {
      boltPattern: '5x114.3',
      centerBore: 64.1,
      stockWheelDiameter: 20,
      stockWheelWidth: 9,
      stockOffset: 40,
      stockTireSize: '235/35R20',
      maxWheelDiameter: 22,
      minWheelDiameter: 18,
      wheelWellClearance: 28,
      brakeClearance: 18,
    },
    modSlots: ['wheels', 'spoiler', 'frontBumper', 'sideskirts', 'paint'],
    basePrice: 50000,
  },
];

export function getCarById(id) {
  return cars.find((c) => c.id === id);
}

export function searchCars(query) {
  const q = query.toLowerCase();
  return cars.filter(
    (c) =>
      c.make.toLowerCase().includes(q) ||
      c.model.toLowerCase().includes(q) ||
      String(c.year).includes(q)
  );
}
