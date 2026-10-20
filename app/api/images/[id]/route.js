import { queryOne } from '@/lib/db';

export async function GET(_request, { params }) {
  const { id } = await params;
  const image = await queryOne('SELECT data, mime, url FROM images WHERE id = $1', [Number(id)]);
  if (!image) return new Response('Not found', { status: 404 });
  if (!image.data) return Response.redirect(new URL(image.url, _request.url), 302);
  return new Response(image.data, {
    headers: { 'Content-Type': image.mime || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
