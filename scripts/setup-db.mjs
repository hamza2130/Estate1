// Creates the schema, the admin account and demo content.
//   npm run db:setup         create tables, seed only if empty
//   npm run db:reset         drop everything and reseed
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { randomBytes, scryptSync } from 'node:crypto';

for (const file of ['.env.local', '.env']) {
  try { process.loadEnvFile(file); } catch {}
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env first.');
  process.exit(1);
}

const reset = process.argv.includes('--reset');
const ssl = /sslmode=require|neon\.tech|supabase\.co/.test(url) ? { rejectUnauthorized: false } : undefined;
const db = new pg.Client({ connectionString: url, ssl });
await db.connect();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

if (reset) {
  await db.query('DROP TABLE IF EXISTS images, inquiries, properties, faqs, testimonials, team_members, settings, admin_users CASCADE');
  console.log('Dropped existing tables.');
}

await db.query(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
console.log('Schema ready.');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@autostack.ai';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const { rows: admins } = await db.query('SELECT id FROM admin_users WHERE lower(email) = lower($1)', [adminEmail]);
if (!admins.length) {
  await db.query('INSERT INTO admin_users (name, email, password_hash) VALUES ($1, $2, $3)', ['Administrator', adminEmail, hashPassword(adminPassword)]);
  console.log(`Admin created: ${adminEmail}`);
}

const { rows: [{ count }] } = await db.query('SELECT count(*)::int AS count FROM properties');
if (count > 0) {
  console.log('Properties already present, skipping demo content. Use `npm run db:reset` to reseed.');
  await db.end();
  process.exit(0);
}

const C = 10000000, L = 100000;
const properties = [
  {
    title: '1 Kanal Designer House in DHA Phase 2',
    purpose: 'sale', property_type: 'house', society: 'DHA', location: 'Sector F, DHA Phase 2, Islamabad',
    price: 11.5 * C, area_value: 1, area_unit: 'kanal', bedrooms: 6, bathrooms: 7, featured: true,
    images: ['villa-1.svg', 'interior-1.svg', 'interior-2.svg'],
    features: ['Double unit', 'Basement with home theatre', 'Imported kitchen', 'Solar system installed', 'Servant quarter', 'Park facing'],
    description: 'A brand new architect-designed residence on a park-facing 1 Kanal plot. Double-height lobby, Italian marble, imported kitchen fittings and a full basement with a home theatre. Fully solar-powered with net metering. All documents verified through our three-step legal check.',
  },
  {
    title: '10 Marla Modern House in Bahria Town Phase 8',
    purpose: 'sale', property_type: 'house', society: 'Bahria Town', location: 'Usman Block, Bahria Town Phase 8, Rawalpindi', city: 'Rawalpindi',
    price: 4.25 * C, area_value: 10, area_unit: 'marla', bedrooms: 5, bathrooms: 6, featured: true,
    images: ['villa-2.svg', 'interior-3.svg'],
    features: ['Corner plot', 'Near commercial', 'Tiled flooring', 'Gas & electricity', 'Covered parking for 2'],
    description: 'Well maintained corner house with a modern elevation, five bedrooms with attached baths, and a lawn. Walking distance to the Usman Block commercial area and mosque.',
  },
  {
    title: '1 Kanal Residential Plot in DHA Phase 5',
    purpose: 'sale', property_type: 'plot', society: 'DHA', location: 'Sector A, DHA Phase 5, Islamabad',
    price: 3.1 * C, area_value: 1, area_unit: 'kanal', featured: true,
    images: ['plot-1.svg'],
    features: ['Possession ready', 'All dues clear', 'Boulevard access', 'Developed sector'],
    description: 'Possession-ready plot on a 50-foot street in a fully developed sector. Ideal for building your dream home; our construction team can deliver a turnkey house.',
  },
  {
    title: 'Luxury 2 Bed Apartment in Gulberg Greens',
    purpose: 'sale', property_type: 'apartment', society: 'Gulberg Greens', location: 'Block C, Gulberg Greens, Islamabad',
    price: 1.65 * C, area_value: 1250, area_unit: 'sqft', bedrooms: 2, bathrooms: 2, featured: true,
    images: ['apartment-1.svg', 'interior-2.svg'],
    features: ['Lift', '24/7 security', 'Backup generator', 'Gym', 'Rooftop lounge'],
    description: 'Ready-to-move apartment in a gated tower with lifts, gym and rooftop lounge. Excellent rental yield, currently vacant.',
  },
  {
    title: '1 Kanal Upper Portion for Rent in DHA Phase 2',
    purpose: 'rent', property_type: 'house', society: 'DHA', location: 'Sector D, DHA Phase 2, Islamabad',
    price: 2.2 * L, area_value: 1, area_unit: 'kanal', bedrooms: 3, bathrooms: 3, featured: true,
    images: ['villa-3.svg', 'interior-1.svg'],
    features: ['Separate gate', 'Semi furnished', 'Family only', 'Near DHA mall'],
    description: 'Elegant upper portion with a separate entrance, three bedrooms, a TV lounge and a large terrace. Suitable for families.',
  },
  {
    title: '8 Marla Commercial Plaza in Bahria Town Phase 7',
    purpose: 'sale', property_type: 'commercial', society: 'Bahria Town', location: 'Spring North, Bahria Town Phase 7, Rawalpindi', city: 'Rawalpindi',
    price: 14 * C, area_value: 8, area_unit: 'marla', bathrooms: 8, featured: true,
    images: ['commercial-1.svg'],
    features: ['Ground + 4 floors', 'Rented to national brands', 'Lift installed', 'Corner'],
    description: 'Fully rented commercial plaza with tenants from national brands, generating steady monthly income. Ideal for investors looking for secure returns.',
  },
  {
    title: '4 Kanal Farmhouse on Bani Gala Road',
    purpose: 'sale', property_type: 'farmhouse', society: 'Top City-1', location: 'Bani Gala Road, Islamabad',
    price: 9.5 * C, area_value: 4, area_unit: 'kanal', bedrooms: 5, bathrooms: 5,
    images: ['farmhouse-1.svg', 'interior-3.svg'],
    features: ['Swimming pool', 'Fruit orchard', 'Hilly view', 'Guest annexe'],
    description: 'A peaceful weekend retreat with lush lawns, fruit orchard, swimming pool and a view of the Margalla Hills.',
  },
  {
    title: '5 Marla House for Sale in Bahria Enclave',
    purpose: 'sale', property_type: 'house', society: 'Bahria Town', location: 'Sector H, Bahria Enclave, Islamabad',
    price: 1.9 * C, area_value: 5, area_unit: 'marla', bedrooms: 3, bathrooms: 4,
    images: ['villa-2.svg'],
    features: ['Brand new', 'Margalla view', 'Near park'],
    description: 'Brand new double storey house with a beautiful Margalla Hills view, ideal for small families.',
  },
  {
    title: '1 Bed Studio Apartment for Rent in B-17',
    purpose: 'rent', property_type: 'apartment', society: 'B-17 Multi Gardens', location: 'Block C, B-17, Islamabad',
    price: 45000, area_value: 650, area_unit: 'sqft', bedrooms: 1, bathrooms: 1,
    images: ['apartment-2.svg'],
    features: ['Fully furnished', 'Lift', 'Parking'],
    description: 'Fully furnished studio apartment, perfect for working professionals.',
  },
  {
    title: '10 Marla Plot in DHA Valley',
    purpose: 'sale', property_type: 'plot', society: 'DHA', location: 'Oleander Sector, DHA Valley, Islamabad',
    price: 85 * L, area_value: 10, area_unit: 'marla',
    images: ['plot-2.svg'],
    features: ['Balloted', 'Map approved', 'Easy installments'],
    description: 'Balloted 10 Marla plot in Oleander Sector at an investor-friendly price. Installment plan available.',
  },
  {
    title: '1 Kanal House for Rent in E-11',
    purpose: 'rent', property_type: 'house', society: 'E-11', location: 'E-11/3, Islamabad',
    price: 3.5 * L, area_value: 1, area_unit: 'kanal', bedrooms: 5, bathrooms: 6,
    images: ['villa-1.svg', 'interior-2.svg'],
    features: ['Full house', 'Lawn', 'Ideal for embassy/office'],
    description: 'Spacious full house with a large lawn, suitable for families, embassies or corporate offices.',
  },
  {
    title: '3 Bed Penthouse in Gulberg Greens',
    purpose: 'sale', property_type: 'penthouse', society: 'Gulberg Greens', location: 'Block B, Gulberg Greens, Islamabad',
    price: 3.4 * C, area_value: 3100, area_unit: 'sqft', bedrooms: 3, bathrooms: 4,
    images: ['apartment-1.svg', 'interior-1.svg'],
    features: ['Private terrace', 'Jacuzzi', 'Two parking spaces', 'Smart home'],
    description: 'A top-floor penthouse with a private terrace, smart-home controls and uninterrupted city views.',
  },
  {
    title: '7 Marla House in G-13',
    purpose: 'sale', property_type: 'house', society: 'G-13', location: 'G-13/1, Islamabad', status: 'sold',
    price: 3.6 * C, area_value: 7, area_unit: 'marla', bedrooms: 4, bathrooms: 4,
    images: ['villa-3.svg'],
    features: ['CDA sector', 'Near metro'],
    description: 'Recently sold through Autostack AI. Contact us for similar options in CDA sectors.',
  },
];

for (const p of properties) {
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const { rows: [row] } = await db.query(
    `INSERT INTO properties (slug, title, purpose, property_type, city, society, location, price, area_value, area_unit,
      bedrooms, bathrooms, description, features, status, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING id`,
    [slug, p.title, p.purpose, p.property_type, p.city || 'Islamabad', p.society, p.location, Math.round(p.price),
      p.area_value, p.area_unit, p.bedrooms || 0, p.bathrooms || 0, p.description, p.features, p.status || 'available', !!p.featured]
  );
  for (const [i, img] of p.images.entries()) {
    await db.query('INSERT INTO images (property_id, url, sort) VALUES ($1, $2, $3)', [row.id, `/demo/${img}`, i]);
  }
}

const faqs = [
  ['What is the "Easy Option" service?', 'The Easy Option is our full-service concierge for busy professionals and overseas Pakistanis. You delegate the whole workload to a senior consultant: market research, shortlisting, site visits on video, price negotiation and all legal paperwork.'],
  ['Is there a fee for the Easy Option?', 'Yes, it carries a concierge fee agreed up front. In most cases it pays for itself by catching legal risks early and negotiating a better purchase price on your behalf.'],
  ['How do you verify properties?', 'Every listing goes through our three-step legal verification: ownership and file check with the society, dues and NOC confirmation, and a physical site inspection, before it appears in our Available Options.'],
  ['Can overseas Pakistanis buy through you remotely?', 'Absolutely. We handle video walkthroughs, documentation and power-of-attorney coordination so you can buy, sell or rent without travelling.'],
  ['Do you offer construction services?', 'Yes. Our construction team delivers grey structure and turnkey homes in DHA, Bahria Town and CDA sectors, with transparent per-square-foot pricing and weekly progress updates.'],
  ['Should I still verify documents myself?', 'We always encourage clients to independently confirm documents at the relevant society or land authority office. We will accompany you or arrange it for you.'],
];
for (const [i, [q, a]] of faqs.entries()) await db.query('INSERT INTO faqs (question, answer, sort) VALUES ($1, $2, $3)', [q, a, i]);

const testimonials = [
  ['Usman Tariq', 'Overseas client, Dubai', 'I bought a 1 Kanal plot in DHA without leaving Dubai. The team sent video walkthroughs and handled the transfer end to end. Completely transparent.', 5],
  ['Sana Malik', 'Homeowner, Bahria Town', 'They sold our house within three weeks at a better price than we expected, and kept us informed at every step.', 5],
  ['Col. (R) Javed Iqbal', 'Investor', 'Their legal verification saved me from a file with pending dues. That alone was worth it. Highly recommended.', 5],
  ['Hira & Bilal', 'Tenants, DHA Phase 2', 'Found the perfect family portion in a week. Professional, responsive and honest.', 4],
];
for (const [i, [name, role, quote, rating]] of testimonials.entries()) {
  await db.query('INSERT INTO testimonials (name, role, quote, rating, sort) VALUES ($1, $2, $3, $4, $5)', [name, role, quote, rating, i]);
}

const team = [
  ['Ahmed Khan', 'CEO & Founder', 'Over 12 years in Islamabad real estate with a focus on DHA and Bahria Town.', '+92 300 0000001'],
  ['Ayesha Raza', 'Head of Sales', 'Leads our sales consultants and the Easy Option concierge desk.', '+92 300 0000002'],
  ['Hamid Shah', 'Legal Advisor', 'Runs the three-step verification on every listing.', '+92 300 0000003'],
  ['Farhan Ali', 'Construction Manager', 'Delivers our grey structure and turnkey construction projects.', '+92 300 0000004'],
];
for (const [i, [name, role, bio, phone]] of team.entries()) {
  await db.query('INSERT INTO team_members (name, role, bio, phone, sort) VALUES ($1, $2, $3, $4, $5)', [name, role, bio, phone, i]);
}

const { rows: firstProperty } = await db.query('SELECT id FROM properties ORDER BY id LIMIT 1');
await db.query(
  `INSERT INTO inquiries (kind, property_id, name, phone, email, message) VALUES
   ('property', $1, 'Kamran Aslam', '+92 321 1234567', 'kamran@example.com', 'Is the price negotiable? I would like to visit this weekend.'),
   ('easy_option', NULL, 'Nadia Hussain', '+44 7700 900123', 'nadia@example.com', 'I live in the UK and want a 10 Marla house in Bahria for around 4 crore.'),
   ('contact', NULL, 'Imran Qureshi', '+92 333 7654321', '', 'I want to sell my plot in DHA Phase 5.')`,
  [firstProperty[0].id]
);

console.log(`Seeded ${properties.length} properties, ${faqs.length} FAQs, ${testimonials.length} testimonials, ${team.length} team members.`);
await db.end();
