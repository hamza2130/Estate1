import { deleteProperty, getPropertyById, parsePropertyInput, updateProperty } from '@/lib/properties';
import { isAdmin, json, readPropertyBody, unauthorized } from '../../_utils';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property || (property.status === 'draft' && !isAdmin(request))) return json({ error: 'Not found' }, 404);
  return json(property);
}

export async function PUT(request, { params }) {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const existing = await getPropertyById(id);
  if (!existing) return json({ error: 'Not found' }, 404);
  const { input, files, imageUrls, removeImageIds } = await readPropertyBody(request);
  // Allow partial updates by merging over the stored record.
  const { data, errors, valid } = parsePropertyInput({ ...existing, ...input });
  if (!valid) return json({ error: 'Validation failed', errors }, 422);
  const property = await updateProperty(existing.id, data, { images: files, imageUrls, removeImageIds });
  return json(property);
}

export const PATCH = PUT;

export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const deleted = await deleteProperty(id);
  return deleted ? json({ ok: true }) : json({ error: 'Not found' }, 404);
}
