import { query } from '@/lib/db';
import { isAdmin, json, unauthorized } from '../_utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  if (!isAdmin(request)) return unauthorized();
  const rows = await query(
    `SELECT i.*, p.title AS property_title FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ORDER BY i.created_at DESC LIMIT 200`
  );
  return json(rows);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  if (name.length < 2 || (!phone && !email)) return json({ error: 'Name and a phone or email are required' }, 422);
  const [row] = await query(
    'INSERT INTO inquiries (kind, property_id, name, phone, email, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [String(body.kind || 'contact'), Number(body.property_id) || null, name, phone, email, String(body.message || '').slice(0, 4000)]
  );
  return json({ ok: true, id: row.id }, 201);
}
