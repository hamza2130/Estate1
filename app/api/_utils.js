import { NextResponse } from 'next/server';
import { sessionFromRequest } from '@/lib/auth';

export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function unauthorized() {
  return json({ error: 'Authentication required' }, 401);
}

export function isAdmin(request) {
  return Boolean(sessionFromRequest(request));
}

// Accepts JSON or multipart/form-data. Returns { input, files, imageUrls, removeImageIds }.
export async function readPropertyBody(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('multipart/form-data')) {
    const form = await request.formData();
    const input = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'));
    const files = [];
    for (const file of form.getAll('images')) {
      if (typeof file !== 'string' && file.size && file.type.startsWith('image/')) {
        files.push({ buffer: Buffer.from(await file.arrayBuffer()), mime: file.type });
      }
    }
    return { input, files, imageUrls: form.getAll('image_urls').filter(Boolean), removeImageIds: form.getAll('remove_image_ids') };
  }
  const input = await request.json().catch(() => ({}));
  return {
    input,
    files: [],
    imageUrls: Array.isArray(input.image_urls) ? input.image_urls : [],
    removeImageIds: Array.isArray(input.remove_image_ids) ? input.remove_image_ids : [],
  };
}
