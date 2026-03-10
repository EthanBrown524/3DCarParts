import { useState } from 'react';
import { cars } from '../data/cars';
import useStore from '../store/useStore';

export default function CarSelector() {
  const [search, setSearch] = useState('');
  const selectCar = useStore((s) => s.selectCar);
  const selectedCarId = useStore((s) => s.selectedCarId);

  const filtered = search
    ? cars.filter(
        (c) =>
          c.make.toLowerCase().includes(search.toLowerCase()) ||
          c.model.toLowerCase().includes(search.toLowerCase()) ||
          String(c.year).includes(search)
      )
    : cars;

  return (
    <div className="car-selector">
      <h3>Select Vehicle</h3>
      <input
        type="text"
        placeholder="Search make, model, year..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="car-list">
        {filtered.map((car) => (
          <button
            key={car.id}
            className={`car-card ${selectedCarId === car.id ? 'active' : ''}`}
            onClick={() => selectCar(car.id)}
          >
            <div className="car-card-name">
              {car.year} {car.make} {car.model}
            </div>
            <div className="car-card-trim">{car.trim}</div>
          </button>
        ))}
        {filtered.length === 0 && <p className="no-results">No vehicles found</p>}
      </div>
    </div>
  );
}
