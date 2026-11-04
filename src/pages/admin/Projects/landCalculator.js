// Pure helpers for the Land Area Calculator (admin > Add Project).
// All areas are converted through Sq. Meters so every measurement stays consistent.

export const SQ_METERS_PER_UNIT = {
  "Sq. Ft.": 0.09290304,
  "Sq. Yards": 0.83612736,
  "Sq. Meters": 1,
  "Acres": 4046.8564224
};

export const AREA_UNITS = Object.keys(SQ_METERS_PER_UNIT);

// Keeps only digits and one decimal point so ANY number can be typed.
export const sanitizeNumberInput = (raw) => {
  const cleaned = String(raw).replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("")}` : whole;
};

export const parsePositive = (raw) => {
  const value = Number(raw);
  return raw !== "" && raw !== "." && Number.isFinite(value) && value > 0 ? value : null;
};

export const getAreaPerUnit = (totalLandArea, totalUnits) => (
  totalLandArea > 0 && totalUnits > 0 ? totalLandArea / totalUnits : null
);

// Land + price for `count` units, in every measurement.
export const calculateForUnits = ({ count, areaPerUnit, landAreaUnit, pricePerUnit }) => {
  const factor = SQ_METERS_PER_UNIT[landAreaUnit] || 1;
  const sqMetersPerUnit = areaPerUnit * factor;
  const land = count * areaPerUnit;
  const byUnit = {};
  AREA_UNITS.forEach((unit) => {
    byUnit[unit] = (count * sqMetersPerUnit) / SQ_METERS_PER_UNIT[unit];
  });
  return {
    count,
    land,
    byUnit,
    unitsPerArea: land > 0 ? count / land : null,
    cost: pricePerUnit !== null && pricePerUnit !== undefined ? count * pricePerUnit : null
  };
};

// Small -> big list of unit counts: presets up to total units + anything the user added/typed.
const PRESET_BASES = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 750];

export const buildUnitList = (totalUnits, extraCounts = []) => {
  const set = new Set();
  const ceiling = totalUnits > 0 ? totalUnits : 1000;
  PRESET_BASES.forEach((n) => { if (n <= ceiling) set.add(n); });
  for (let magnitude = 1000; magnitude <= ceiling; magnitude *= 10) {
    [1, 2, 2.5, 5].forEach((m) => {
      const n = magnitude * m;
      if (n <= ceiling) set.add(n);
    });
  }
  if (totalUnits > 0) set.add(totalUnits);
  extraCounts.forEach((n) => { if (Number.isFinite(n) && n > 0) set.add(n); });
  return Array.from(set).sort((a, b) => a - b);
};

// Filter: "2" keeps 2, 20, 25, 200, 250 ...; a typed number that is not in the list is still added.
export const filterUnitList = (list, filterText) => {
  const text = String(filterText).trim();
  if (!text) return list;
  const typed = parsePositive(text);
  const matches = list.filter((n) => String(n).includes(text));
  if (typed !== null && !list.includes(typed)) matches.push(typed);
  return matches.sort((a, b) => a - b);
};
