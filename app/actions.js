'use server';

import { query } from '@/lib/db';

const KINDS = ['contact', 'property', 'easy_option', 'sell', 'construction'];

export async function submitInquiry(_prev, formData) {
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const kind = KINDS.includes(formData.get('kind')) ? formData.get('kind') : 'contact';
  const propertyId = Number(formData.get('property_id')) || null;

  if (name.length < 2) return { ok: false, error: 'Please enter your name.' };
  if (!phone && !email) return { ok: false, error: 'Please share a phone number or email so we can reach you.' };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };

  await query(
    'INSERT INTO inquiries (kind, property_id, name, phone, email, message) VALUES ($1, $2, $3, $4, $5, $6)',
    [kind, propertyId, name, phone, email, message.slice(0, 4000)]
  );
  return { ok: true };
}
