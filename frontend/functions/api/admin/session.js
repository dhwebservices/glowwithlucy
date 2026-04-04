import { authSummary, requireStaff } from "../../_lib/auth";
import { json, notAllowed } from "../../_lib/http";

export async function onRequestGet(context) {
  const auth = await requireStaff(context.request, context.env);
  if (!auth.ok) {
    return json(authSummary(null));
  }

  return json(authSummary(auth.session));
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
