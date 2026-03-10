/**
 * Rule-based fitment validation engine.
 * Checks whether a part is compatible with a given car's specs.
 * Returns { valid, warnings, errors }.
 */

export function validateFitment(car, part) {
  const result = { valid: true, warnings: [], errors: [] };

  if (!car || !part) {
    result.valid = false;
    result.errors.push('Missing car or part data');
    return result;
  }

  // Check basic compatibility list
  if (!part.compatibleCars.includes(car.id)) {
    result.valid = false;
    result.errors.push(`${part.name} is not listed as compatible with ${car.year} ${car.make} ${car.model}`);
    return result;
  }

  // Category-specific fitment checks
  switch (part.category) {
    case 'wheels':
      return validateWheelFitment(car, part, result);
    case 'exhaust':
      return validateExhaustFitment(car, part, result);
    default:
      return result;
  }
}

function validateWheelFitment(car, part, result) {
  const { specs: carSpecs } = car;
  const { specs: wheelSpecs } = part;

  // Bolt pattern must match
  if (wheelSpecs.boltPattern !== carSpecs.boltPattern) {
    result.valid = false;
    result.errors.push(
      `Bolt pattern mismatch: wheel is ${wheelSpecs.boltPattern}, car requires ${carSpecs.boltPattern}`
    );
  }

  // Diameter range
  if (wheelSpecs.diameter > carSpecs.maxWheelDiameter) {
    result.valid = false;
    result.errors.push(
      `Wheel diameter ${wheelSpecs.diameter}" exceeds max ${carSpecs.maxWheelDiameter}" for this vehicle`
    );
  }
  if (wheelSpecs.diameter < carSpecs.minWheelDiameter) {
    result.valid = false;
    result.errors.push(
      `Wheel diameter ${wheelSpecs.diameter}" is below min ${carSpecs.minWheelDiameter}" (brake clearance)`
    );
  }

  // Brake clearance
  if (wheelSpecs.diameter < carSpecs.brakeClearance) {
    result.valid = false;
    result.errors.push(
      `Wheel diameter ${wheelSpecs.diameter}" won't clear brakes (need at least ${carSpecs.brakeClearance}")`
    );
  }

  // Offset check — too low offset = wheel pokes out
  const offsetDiff = wheelSpecs.offset - carSpecs.stockOffset;
  if (offsetDiff < -20) {
    result.valid = false;
    result.errors.push(
      `Offset ${wheelSpecs.offset}mm is too aggressive (stock: ${carSpecs.stockOffset}mm). Wheel will poke significantly.`
    );
  } else if (offsetDiff < -10) {
    result.warnings.push(
      `Offset ${wheelSpecs.offset}mm is ${Math.abs(offsetDiff)}mm lower than stock. Wheel may poke slightly — fender rolling may be needed.`
    );
  }

  // Too high offset = wheel sits too far in
  if (offsetDiff > 15) {
    result.warnings.push(
      `Offset ${wheelSpecs.offset}mm is ${offsetDiff}mm higher than stock. Wheel may sit too far inward.`
    );
  }

  // Width check
  const widthDiff = wheelSpecs.width - carSpecs.stockWheelWidth;
  if (widthDiff > 2) {
    result.warnings.push(
      `Wheel width ${wheelSpecs.width}" is ${widthDiff}" wider than stock. Check fender clearance.`
    );
  }
  if (widthDiff > 3) {
    result.valid = false;
    result.errors.push(
      `Wheel width ${wheelSpecs.width}" is too wide for this vehicle without major modifications.`
    );
  }

  return result;
}

function validateExhaustFitment(car, part, result) {
  // Basic check — exhaust slot must exist
  if (!car.modSlots.includes('exhaust')) {
    result.valid = false;
    result.errors.push(`${car.year} ${car.make} ${car.model} does not support exhaust modifications in this configurator.`);
  }
  return result;
}

/**
 * Generate a human-readable fitment summary.
 */
export function getFitmentSummary(fitmentResult) {
  if (fitmentResult.valid && fitmentResult.warnings.length === 0) {
    return { status: 'good', message: 'Perfect fitment — no issues detected.' };
  }
  if (fitmentResult.valid && fitmentResult.warnings.length > 0) {
    return { status: 'warning', message: `Fits with ${fitmentResult.warnings.length} warning(s).` };
  }
  return { status: 'error', message: `Does not fit — ${fitmentResult.errors.length} issue(s) found.` };
}
