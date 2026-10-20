'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { login, logout, requireAdmin } from '@/lib/auth';
import { query } from '@/lib/db';
import { DEFAULT_SETTINGS, saveSettings } from '@/lib/content';
import { hashPassword, verifyPassword } from '@/lib/password';
import {
  createProperty, deleteProperty, filesFromFormData, parsePropertyInput, setCoverImage, updateProperty,
} from '@/lib/properties';

export async function loginAction(_prev, formData) {
  const user = await login(String(formData.get('email') || ''), String(formData.get('password') || ''));
  if (!user) return { error: 'Invalid email or password.' };
  redirect('/admin');
}

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}

function refresh() {
  revalidatePath('/', 'layout');
}

export async function savePropertyAction(_prev, formData) {
  await requireAdmin();
  const id = Number(formData.get('id')) || null;
  const input = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === 'string'));
  input.featured = formData.get('featured') === 'on';
  input.verified = formData.get('verified') === 'on';
  const { data, errors, valid } = parsePropertyInput(input);
  if (!valid) return { errors, error: 'Please fix the highlighted fields.' };

  const images = await filesFromFormData(formData);
  const removeImageIds = formData.getAll('remove_image_ids').map(Number);
  const property = id
    ? await updateProperty(id, data, { images, removeImageIds })
    : await createProperty(data, { images });
  const cover = Number(formData.get('cover_image_id'));
  if (cover && !removeImageIds.includes(cover)) await setCoverImage(property.id, cover);
  refresh();
  redirect(`/admin/properties?saved=${property.id}`);
}

export async function deletePropertyAction(formData) {
  await requireAdmin();
  await deleteProperty(Number(formData.get('id')));
  refresh();
}

export async function togglePropertyFlagAction(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (formData.get('field') === 'featured') {
    await query('UPDATE properties SET featured = NOT featured, updated_at = now() WHERE id = $1', [id]);
  } else {
    const status = String(formData.get('status'));
    if (['available', 'sold', 'rented', 'draft'].includes(status)) {
      await query('UPDATE properties SET status = $2, updated_at = now() WHERE id = $1', [id, status]);
    }
  }
  refresh();
}

export async function updateInquiryAction(formData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (formData.get('delete')) {
    await query('DELETE FROM inquiries WHERE id = $1', [id]);
  } else {
    const status = String(formData.get('status'));
    if (['new', 'contacted', 'closed'].includes(status)) await query('UPDATE inquiries SET status = $2 WHERE id = $1', [id, status]);
  }
  revalidatePath('/admin', 'layout');
}

export async function saveSettingsAction(_prev, formData) {
  await requireAdmin();
  const values = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (formData.has(key)) values[key] = String(formData.get(key)).trim();
  }
  await saveSettings(values);
  refresh();
  return { ok: true };
}

// Generic CRUD for the simple content tables.
const CONTENT = {
  faqs: { fields: ['question', 'answer', 'sort'], required: ['question', 'answer'] },
  testimonials: { fields: ['name', 'role', 'quote', 'rating', 'sort'], required: ['name', 'quote'] },
  team_members: { fields: ['name', 'role', 'bio', 'phone', 'sort'], required: ['name'] },
};

export async function saveContentAction(formData) {
  await requireAdmin();
  const table = String(formData.get('table'));
  const config = CONTENT[table];
  if (!config) return;
  const id = Number(formData.get('id')) || null;
  const values = config.fields.map((f) => {
    const v = String(formData.get(f) ?? '').trim();
    return f === 'sort' || f === 'rating' ? Number(v) || (f === 'rating' ? 5 : 0) : v;
  });
  if (config.required.some((f) => !String(formData.get(f) || '').trim())) return;
  if (id) {
    const sets = config.fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
    await query(`UPDATE ${table} SET ${sets} WHERE id = $1`, [id, ...values]);
  } else {
    const ph = config.fields.map((_, i) => `$${i + 1}`).join(', ');
    await query(`INSERT INTO ${table} (${config.fields.join(', ')}) VALUES (${ph})`, values);
  }
  refresh();
}

export async function deleteContentAction(formData) {
  await requireAdmin();
  const table = String(formData.get('table'));
  if (!CONTENT[table]) return;
  await query(`DELETE FROM ${table} WHERE id = $1`, [Number(formData.get('id'))]);
  refresh();
}

export async function changePasswordAction(_prev, formData) {
  const session = await requireAdmin();
  const current = String(formData.get('current') || '');
  const next = String(formData.get('next') || '');
  const [user] = await query('SELECT * FROM admin_users WHERE id = $1', [session.id]);
  if (!user || !verifyPassword(current, user.password_hash)) return { error: 'Current password is incorrect.' };
  if (next.length < 8) return { error: 'New password must be at least 8 characters.' };
  await query('UPDATE admin_users SET password_hash = $2 WHERE id = $1', [user.id, hashPassword(next)]);
  return { ok: true };
}
