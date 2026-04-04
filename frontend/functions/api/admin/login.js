import {
  createSession,
  createSessionCookie,
  getConfiguredStaff,
} from "../../_lib/auth";
import {
  badRequest,
  json,
  notAllowed,
  readJson,
  unauthorized,
} from "../../_lib/http";

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid login payload");

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const staff = getConfiguredStaff(context.env);

  if (!staff.email || !staff.password) {
    return unauthorized("Staff credentials are not configured");
  }

  if (email !== staff.email.toLowerCase() || password !== staff.password) {
    return unauthorized("Incorrect email or password");
  }

  const session = await createSession(context.env, staff.email);
  return json(
    { authenticated: true, email: staff.email },
    {
      headers: {
        "set-cookie": createSessionCookie(session.token, session.expiresAt),
      },
    }
  );
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
