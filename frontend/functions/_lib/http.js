export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set('content-type', 'application/json; charset=utf-8');
  headers.set('cache-control', 'no-store');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function badRequest(message, details) {
  return json({ error: message, details }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return json({ error: message }, { status: 401 });
}

export function notAllowed(method) {
  return json({ error: `${method} not allowed` }, { status: 405 });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
