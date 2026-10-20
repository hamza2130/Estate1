import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { queryOne } from './db';
import { verifyPassword } from './password';

const COOKIE = 'autostack_admin';
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET || 'dev-only-secret-change-me';
}

function sign(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function encode(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decode(token) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function login(email, password) {
  const user = await queryOne('SELECT * FROM admin_users WHERE lower(email) = lower($1)', [email]);
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  const store = await cookies();
  store.set(COOKIE, encode({ id: user.id, email: user.email, name: user.name, exp: Date.now() + MAX_AGE * 1000 }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
  return user;
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession() {
  const store = await cookies();
  return decode(store.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export function sessionFromRequest(request) {
  return decode(request.cookies.get(COOKIE)?.value);
}
