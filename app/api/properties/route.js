import { createProperty, listProperties, parsePropertyInput } from '@/lib/properties';
import { isAdmin, json, readPropertyBody, unauthorized } from '../_utils';

export const dynamic = 'force-dynamic';

// GET /api/properties?purpose=sale&type=house&society=DHA&minPrice=&maxPrice=&beds=&q=&sort=&page=&limit=
export async function GET(request) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const includeAll = params.all === '1' && isAdmin(request);
  const result = await listProperties(params, { includeAll });
  return json(result);
}

// POST /api/properties (admin only)
export async function POST(request) {
  if (!isAdmin(request)) return unauthorized();
  const { input, files, imageUrls } = await readPropertyBody(request);
  const { data, errors, valid } = parsePropertyInput(input);
  if (!valid) return json({ error: 'Validation failed', errors }, 422);
  const property = await createProperty(data, { images: files, imageUrls });
  return json(property, 201);
}
