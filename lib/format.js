export function formatPrice(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `PKR ${trim(n / 10000000)} Crore`;
  if (n >= 100000) return `PKR ${trim(n / 100000)} Lac`;
  if (n >= 1000) return `PKR ${trim(n / 1000)} Thousand`;
  return `PKR ${n.toLocaleString('en-PK')}`;
}

export function formatPriceFull(value) {
  return `PKR ${(Number(value) || 0).toLocaleString('en-PK')}`;
}

function trim(n) {
  return Number(n.toFixed(2)).toString();
}

export const AREA_UNITS = { marla: 'Marla', kanal: 'Kanal', sqft: 'Sq. Ft.', sqyd: 'Sq. Yd.' };

export function formatArea(value, unit) {
  const n = Number(value) || 0;
  return `${trim(n)} ${AREA_UNITS[unit] || unit}`;
}

export const PROPERTY_TYPES = {
  house: 'House',
  apartment: 'Apartment',
  plot: 'Residential Plot',
  commercial: 'Commercial',
  farmhouse: 'Farmhouse',
  penthouse: 'Penthouse',
};

export const SOCIETIES = ['DHA', 'Bahria Town', 'Gulberg Greens', 'B-17 Multi Gardens', 'Top City-1', 'E-11', 'F-7', 'G-13'];

export const CITIES = ['Islamabad', 'Rawalpindi', 'Lahore'];

export function typeLabel(type) {
  return PROPERTY_TYPES[type] || type;
}

export function purposeLabel(purpose) {
  return purpose === 'rent' ? 'For Rent' : 'For Sale';
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
