import { badRequest, json, notAllowed } from "../../_lib/http";
import { incrementDiscountUsage } from "../../_lib/orderDraft";
import { stripeRequest } from "../../_lib/stripe";

function joinAddress(address) {
  if (!address) return "";
  return [
    address.line1,
    address.line2,
    address.city,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return badRequest("Stripe session id is required");

  const session = await stripeRequest(
    context.env,
    `/checkout/sessions/${sessionId}`,
    null,
    { method: "GET" }
  );

  if (session.payment_status !== "paid") {
    return badRequest("Payment has not been completed yet.");
  }

  const orderId = Number(session.metadata?.order_id || 0);
  if (!orderId) return badRequest("No linked order found for this payment.");

  const existing = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId)
    .first();
  if (!existing) return badRequest("Linked order could not be found.");

  const customerName =
    session.customer_details?.name || existing.customer_name || "Stripe customer";
  const customerEmail =
    session.customer_details?.email || existing.customer_email || "";
  const customerPhone =
    session.customer_details?.phone || existing.customer_phone || "";
  const shippingAddress =
    joinAddress(session.shipping_details?.address) ||
    joinAddress(session.customer_details?.address) ||
    existing.shipping_address;
  const notes = session.metadata?.customer_notes || existing.notes || "";

  await context.env.DB.prepare(
    `UPDATE orders
      SET customer_name = ?, customer_email = ?, customer_phone = ?, shipping_address = ?,
          notes = ?, payment_status = 'paid', status = CASE WHEN status = 'cancelled' THEN status ELSE 'paid' END,
          updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  )
    .bind(
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      notes,
      orderId
    )
    .run();

  if (existing.discount_code && existing.payment_status !== "paid") {
    const discount = await context.env.DB.prepare(
      "SELECT * FROM discount_codes WHERE code = ?"
    )
      .bind(existing.discount_code)
      .first();
    await incrementDiscountUsage(context.env, discount);
  }

  const order = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId)
    .first();

  return json({
    order: {
      id: order.id,
      orderNumber: order.order_number,
      subtotal: order.subtotal_pence / 100,
      discount: order.discount_pence / 100,
      delivery: 3.2,
      total: order.total_pence / 100,
      status: order.status,
      paymentStatus: order.payment_status,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
    },
  });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
