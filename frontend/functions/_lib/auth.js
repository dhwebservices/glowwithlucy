import { json, unauthorized } from './http';

const COOKIE_NAME = 'gwl_staff_session';
const SESSION_HOURS = 24 * 7;

function parseCookies(request) {
  const raw = request.headers.get('cookie') || '';
  return Object.fromEntries(
    raw
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const idx = part.indexOf('=');
        return [part.slice(0, idx), decodeURIComponent(part.slice(idx + 1))];
      })
  );
}

export function createSessionCookie(token, expiresAt) {
  const expires = new Date(expiresAt).toUTCString();
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function getConfiguredStaff(env) {
  return {
    email: env.STAFF_EMAIL,
    password: env.STAFF_PASSWORD,
  };
}

export async function createSession(env, email) {
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO sessions (token, email, expires_at) VALUES (?, ?, ?)').bind(token, email, expiresAt).run();
  return { token, expiresAt };
}

export async function deleteSession(env, token) {
  if (!token) return;
  await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
}

export async function requireStaff(request, env) {
  const cookies = parseCookies(request);
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return { ok: false, response: unauthorized() };
  }

  const session = await env.DB.prepare(
    'SELECT token, email, expires_at FROM sessions WHERE token = ?'
  ).bind(token).first();

  if (!session) {
    return { ok: false, response: unauthorized() };
  }

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await deleteSession(env, token);
    return { ok: false, response: unauthorized('Session expired') };
  }

  return { ok: true, session };
}

export function authSummary(session) {
  return {
    authenticated: Boolean(session),
    email: session?.email || null,
  };
}
