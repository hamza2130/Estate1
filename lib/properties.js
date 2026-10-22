import { getPool, query, queryOne, ready } from './db';
import { PROPERTY_TYPES, slugify } from './format';

const IMAGE_URL = `COALESCE(i.url, '/api/images/' || i.id)`;

const SELECT_LIST = `
  SELECT p.*,
    (SELECT ${IMAGE_URL} FROM images i WHERE i.property_id = p.id ORDER BY i.sort, i.id LIMIT 1) AS cover,
    (SELECT count(*)::int FROM images i WHERE i.property_id = p.id) AS image_count
  FROM properties p`;

const SORTS = {
  newest: 'p.created_at DESC',
  oldest: 'p.created_at ASC',
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
};

function buildFilters(filters = {}, { includeAll = false } = {}) {
  const where = [];
  const params = [];
  const add = (sql, value) => {
    params.push(value);
    where.push(sql.replace('?', `$${params.length}`));
  };

  if (!includeAll) where.push(`p.status IN ('available', 'sold', 'rented')`);
  if (filters.status) add('p.status = ?', filters.status);
  if (filters.purpose) add('p.purpose = ?', filters.purpose);
  if (filters.type) add('p.property_type = ?', filters.type);
  if (filters.city) add('p.city = ?', filters.city);
  if (filters.society) add('p.society = ?', filters.society);
  if (filters.minPrice) add('p.price >= ?', Number(filters.minPrice));
  if (filters.maxPrice) add('p.price <= ?', Number(filters.maxPrice));
  if (filters.beds) add('p.bedrooms >= ?', Number(filters.beds));
  if (filters.featured) where.push('p.featured = true');
  if (filters.q) {
    params.push(`%${filters.q}%`);
    const n = `$${params.length}`;
    where.push(`(p.title ILIKE ${n} OR p.location ILIKE ${n} OR p.society ILIKE ${n} OR p.description ILIKE ${n})`);
  }
  return { where: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

export async function listProperties(filters = {}, options = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(filters.limit) || 9));
  const { where, params } = buildFilters(filters, options);
  const order = SORTS[filters.sort] || 'p.featured DESC, p.created_at DESC';

  const [items, countRow] = await Promise.all([
    query(`${SELECT_LIST} ${where} ORDER BY ${order} LIMIT ${limit} OFFSET ${(page - 1) * limit}`, params),
    queryOne(`SELECT count(*)::int AS total FROM properties p ${where}`, params),
  ]);
  const total = countRow.total;
  return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getPropertyBySlug(slug) {
  const property = await queryOne(`SELECT * FROM properties WHERE slug = $1 AND status <> 'draft'`, [slug]);
  if (!property) return null;
  property.images = await getImages(property.id);
  return property;
}

export async function getPropertyById(id) {
  const property = await queryOne('SELECT * FROM properties WHERE id = $1', [Number(id)]);
  if (!property) return null;
  property.images = await getImages(property.id);
  return property;
}

export async function getImages(propertyId) {
  return query(
    `SELECT i.id, ${IMAGE_URL} AS src, i.sort FROM images i WHERE i.property_id = $1 ORDER BY i.sort, i.id`,
    [propertyId]
  );
}

export async function getSimilar(property, limit = 3) {
  return query(
    `${SELECT_LIST} WHERE p.id <> $1 AND p.status = 'available' AND (p.society = $2 OR p.property_type = $3)
     ORDER BY (p.society = $2) DESC, p.created_at DESC LIMIT $4`,
    [property.id, property.society, property.property_type, limit]
  );
}

export async function getStats() {
  return queryOne(`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status = 'available')::int AS available,
      count(*) FILTER (WHERE status IN ('sold', 'rented'))::int AS closed,
      count(*) FILTER (WHERE purpose = 'sale')::int AS for_sale,
      count(*) FILTER (WHERE purpose = 'rent')::int AS for_rent,
      count(*) FILTER (WHERE featured)::int AS featured
    FROM properties`);
}

export async function getSocietyCounts() {
  return query(`
    SELECT society, count(*)::int AS count FROM properties
    WHERE status = 'available' GROUP BY society ORDER BY count DESC LIMIT 6`);
}

// Validates and normalises input coming from the admin form or the JSON API.
export function parsePropertyInput(input) {
  const errors = {};
  const str = (k) => (input[k] == null ? '' : String(input[k]).trim());
  const num = (k) => {
    const v = str(k).replace(/,/g, '');
    return v === '' ? 0 : Number(v);
  };

  const data = {
    title: str('title'),
    purpose: str('purpose') || 'sale',
    property_type: str('property_type') || 'house',
    city: str('city') || 'Islamabad',
    society: str('society'),
    location: str('location'),
    price: num('price'),
    area_value: num('area_value'),
    area_unit: str('area_unit') || 'marla',
    bedrooms: Math.trunc(num('bedrooms')),
    bathrooms: Math.trunc(num('bathrooms')),
    description: str('description'),
    status: str('status') || 'available',
    video_url: str('video_url'),
    featured: input.featured === true || input.featured === 'on' || input.featured === 'true',
    verified: input.verified === undefined ? true : input.verified === true || input.verified === 'on' || input.verified === 'true',
    features: Array.isArray(input.features)
      ? input.features.map((f) => String(f).trim()).filter(Boolean)
      : str('features').split(/\n|,/).map((f) => f.trim()).filter(Boolean),
  };

  if (data.title.length < 4) errors.title = 'Title must be at least 4 characters.';
  if (!['sale', 'rent'].includes(data.purpose)) errors.purpose = 'Purpose must be sale or rent.';
  if (!PROPERTY_TYPES[data.property_type]) errors.property_type = 'Unknown property type.';
  if (!data.society) errors.society = 'Society / area is required.';
  if (!Number.isFinite(data.price) || data.price <= 0) errors.price = 'Enter a price in PKR.';
  if (!Number.isFinite(data.area_value) || data.area_value <= 0) errors.area_value = 'Enter the area.';
  if (!['available', 'sold', 'rented', 'draft'].includes(data.status)) errors.status = 'Unknown status.';
  if (!Number.isFinite(data.bedrooms) || data.bedrooms < 0) errors.bedrooms = 'Invalid bedrooms.';
  if (!Number.isFinite(data.bathrooms) || data.bathrooms < 0) errors.bathrooms = 'Invalid bathrooms.';

  return { data, errors, valid: Object.keys(errors).length === 0 };
}

async function uniqueSlug(client, title, excludeId = null) {
  const base = slugify(title) || 'property';
  let slug = base;
  for (let i = 2; ; i++) {
    const { rows } = await client.query('SELECT 1 FROM properties WHERE slug = $1 AND id IS DISTINCT FROM $2', [slug, excludeId]);
    if (!rows.length) return slug;
    slug = `${base}-${i}`;
  }
}

const COLUMNS = ['title', 'purpose', 'property_type', 'city', 'society', 'location', 'price', 'area_value', 'area_unit',
  'bedrooms', 'bathrooms', 'description', 'features', 'status', 'featured', 'verified', 'video_url'];

export async function createProperty(data, { images = [], imageUrls = [] } = {}) {
  await ready();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const slug = await uniqueSlug(client, data.title);
    const values = COLUMNS.map((c) => data[c]);
    const placeholders = COLUMNS.map((_, i) => `$${i + 2}`).join(', ');
    const { rows } = await client.query(
      `INSERT INTO properties (slug, ${COLUMNS.join(', ')}) VALUES ($1, ${placeholders}) RETURNING *`,
      [slug, ...values]
    );
    const property = rows[0];
    await addImages(client, property.id, images, imageUrls);
    await client.query('COMMIT');
    return property;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function updateProperty(id, data, { images = [], imageUrls = [], removeImageIds = [] } = {}) {
  await ready();
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (!existing.rows.length) {
      await client.query('ROLLBACK');
      return null;
    }
    const slug = existing.rows[0].title === data.title ? existing.rows[0].slug : await uniqueSlug(client, data.title, id);
    const sets = COLUMNS.map((c, i) => `${c} = $${i + 3}`).join(', ');
    const { rows } = await client.query(
      `UPDATE properties SET slug = $2, ${sets}, updated_at = now() WHERE id = $1 RETURNING *`,
      [id, slug, ...COLUMNS.map((c) => data[c])]
    );
    if (removeImageIds.length) {
      await client.query('DELETE FROM images WHERE property_id = $1 AND id = ANY($2::int[])', [id, removeImageIds.map(Number)]);
    }
    await addImages(client, id, images, imageUrls);
    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function addImages(client, propertyId, files, urls) {
  const { rows } = await client.query('SELECT COALESCE(max(sort), -1) + 1 AS next FROM images WHERE property_id = $1', [propertyId]);
  let sort = rows[0].next;
  for (const file of files) {
    await client.query('INSERT INTO images (property_id, data, mime, sort) VALUES ($1, $2, $3, $4)', [propertyId, file.buffer, file.mime, sort++]);
  }
  for (const url of urls) {
    await client.query('INSERT INTO images (property_id, url, sort) VALUES ($1, $2, $3)', [propertyId, url, sort++]);
  }
}

export async function deleteProperty(id) {
  const rows = await query('DELETE FROM properties WHERE id = $1 RETURNING id', [Number(id)]);
  return rows.length > 0;
}

export async function setCoverImage(propertyId, imageId) {
  await query(
    `WITH ordered AS (
       SELECT id, row_number() OVER (ORDER BY (id = $2) DESC, sort, id) - 1 AS rn FROM images WHERE property_id = $1
     )
     UPDATE images SET sort = ordered.rn FROM ordered WHERE images.id = ordered.id`,
    [propertyId, imageId]
  );
}

export async function filesFromFormData(formData, field = 'images') {
  const files = [];
  for (const file of formData.getAll(field)) {
    if (!file || typeof file === 'string' || !file.size) continue;
    if (!file.type.startsWith('image/')) continue;
    files.push({ buffer: Buffer.from(await file.arrayBuffer()), mime: file.type });
  }
  return files;
}
