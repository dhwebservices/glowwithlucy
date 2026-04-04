import { requireStaff } from "../../_lib/auth";
import { badRequest, json, notAllowed, readJson } from "../../_lib/http";

async function ensureAuth(request, env) {
  const auth = await requireStaff(request, env);
  if (!auth.ok) return auth.response;
  return null;
}

export async function onRequestGet(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const { results } = await context.env.DB.prepare(
    "SELECT * FROM orders ORDER BY created_at DESC"
  ).all();

  const orders = await Promise.all(
    (results || []).map(async (order) => {
      const items = await context.env.DB.prepare(
        "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC"
      )
        .bind(order.id)
        .all();

      return {
        ...order,
        subtotal: order.subtotal_pence / 100,
        discount: order.discount_pence / 100,
        total: order.total_pence / 100,
        items: items.results || [],
      };
    })
  );

  return json({ orders });
}

export async function onRequestPatch(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const body = await readJson(context.request);
  const id = Number(body?.id || 0);
  if (!id) return badRequest("Order id is required");

  const status = body.status || "new";
  const paymentStatus = body.paymentStatus || "pending";

  await context.env.DB.prepare(
    "UPDATE orders SET status = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(status, paymentStatus, id)
    .run();

  const row = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id)
    .first();

  return json({ order: row });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
