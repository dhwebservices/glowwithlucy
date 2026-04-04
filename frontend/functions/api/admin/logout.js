import { clearSessionCookie, deleteSession } from "../../_lib/auth";
import { json, notAllowed } from "../../_lib/http";

function parseToken(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/gwl_staff_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function onRequestPost(context) {
  const token = parseToken(context.request);
  await deleteSession(context.env, token);
  return json(
    { authenticated: false },
    { headers: { "set-cookie": clearSessionCookie() } }
  );
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
