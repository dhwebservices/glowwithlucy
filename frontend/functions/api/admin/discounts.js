import { requireStaff } from "../../_lib/auth";
import { badRequest, json, notAllowed, readJson } from "../../_lib/http";

async function ensureAuth(request, env) {
  const auth = await requireStaff(request, env);
  if (!auth.ok) return auth.response;
  return null;
}

function normalizeDiscount(body) {
  return {
    id: body.id ? Number(body.id) : null,
    code: String(body.code || "").trim().toUpperCase(),
    description: String(body.description || "").trim(),
    kind: body.kind === "fixed" ? "fixed" : "percent",
    amount: Number(body.amount || 0),
    minOrderPence: Math.round(Number(body.minOrder || 0) * 100),
    active: body.active === false ? 0 : 1,
    startsAt: body.startsAt || null,
    endsAt: body.endsAt || null,
    usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
  };
}

export async function onRequestGet(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const { results } = await context.env.DB.prepare(
    "SELECT * FROM discount_codes ORDER BY created_at DESC"
  ).all();
  return json({ discounts: results || [] });
}

export async function onRequestPost(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid discount payload");
  const discount = normalizeDiscount(body);

  if (!discount.code || !discount.amount) {
    return badRequest("Code and amount are required");
  }

  if (discount.id) {
    await context.env.DB.prepare(
      `UPDATE discount_codes SET
        code = ?, description = ?, kind = ?, amount = ?, min_order_pence = ?, active = ?,
        starts_at = ?, ends_at = ?, usage_limit = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    )
      .bind(
        discount.code,
        discount.description,
        discount.kind,
        discount.amount,
        discount.minOrderPence,
        discount.active,
        discount.startsAt,
        discount.endsAt,
        discount.usageLimit,
        discount.id
      )
      .run();
  } else {
    await context.env.DB.prepare(
      `INSERT INTO discount_codes (
        code, description, kind, amount, min_order_pence, active, starts_at, ends_at, usage_limit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        discount.code,
        discount.description,
        discount.kind,
        discount.amount,
        discount.minOrderPence,
        discount.active,
        discount.startsAt,
        discount.endsAt,
        discount.usageLimit
      )
      .run();
  }

  const row = discount.id
    ? await context.env.DB.prepare("SELECT * FROM discount_codes WHERE id = ?")
        .bind(discount.id)
        .first()
    : await context.env.DB.prepare("SELECT * FROM discount_codes WHERE code = ?")
        .bind(discount.code)
        .first();

  return json({ discount: row });
}

export async function onRequestDelete(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const body = await readJson(context.request);
  const id = Number(body?.id || 0);
  if (!id) return badRequest("Discount id is required");

  await context.env.DB.prepare("DELETE FROM discount_codes WHERE id = ?")
    .bind(id)
    .run();

  return json({ success: true });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
