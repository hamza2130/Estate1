import { query } from './db';

export const DEFAULT_SETTINGS = {
  site_name: 'Autostack AI',
  site_tagline: 'Properties & Developers',
  phone: '+92 300 0000000',
  whatsapp: '923000000000',
  email: 'hello@autostack.ai',
  address: 'Office 1, Second Floor, Plaza 10, Main Boulevard, DHA Phase 3, Islamabad',
  office_hours: 'Mon to Sat, 10:00 AM to 7:00 PM',
  hero_title: 'Verified Properties in DHA, Bahria & Islamabad',
  hero_subtitle: 'Buy, sell, rent or build with a team that legally vets every listing before it reaches you.',
  about_intro: 'Autostack AI is a trusted name in real estate, specialising in the sale, purchase and construction of residential and commercial properties across Islamabad and Rawalpindi.',
  ceo_name: 'Ahmed Khan',
  ceo_message: 'We started with a simple promise: no client should ever lose money to a bad file. Every property we show has passed our three-step legal verification, and every client gets a senior consultant who knows the market street by street.',
  years_experience: '10+',
  happy_clients: '1,200+',
  deals_closed: '850+',
  facebook: '#',
  instagram: '#',
  youtube: '#',
};

export async function getSettings() {
  const rows = await query('SELECT key, value FROM settings');
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}

export async function saveSettings(values) {
  for (const [key, value] of Object.entries(values)) {
    if (!(key in DEFAULT_SETTINGS)) continue;
    await query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      [key, String(value ?? '')]
    );
  }
}

export const getFaqs = () => query('SELECT * FROM faqs ORDER BY sort, id');
export const getTestimonials = () => query('SELECT * FROM testimonials ORDER BY sort, id');
export const getTeam = () => query('SELECT * FROM team_members ORDER BY sort, id');
