import { badRequest, json, notAllowed, readJson } from "../_lib/http";
import {
  buildOrderDraft,
  createOrderRecord,
  getCustomerDetails,
  incrementDiscountUsage,
} from "../_lib/orderDraft";
import { sendOrderEmails } from "../_lib/email";

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid order payload");
  const customer = getCustomerDetails(body);
  if (!customer.name || !customer.email || !customer.address) {
    return badRequest("Name, email, and shipping address are required");
  }

  const draft = await buildOrderDraft(context.env, body);
  if (draft.error) return badRequest(draft.error);

  const { orderId } = await createOrderRecord(context.env, draft);
  await incrementDiscountUsage(context.env, draft.discount);
  const order = await context.env.DB.prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId)
    .first();
  const itemsResult = await context.env.DB.prepare(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC"
  )
    .bind(orderId)
    .all();
  await sendOrderEmails(context.env, order, itemsResult.results || []);

  return json(
    {
      success: true,
      order: {
        id: orderId,
        orderNumber: draft.orderNumber,
        subtotal: draft.subtotalPence / 100,
        discount: draft.discountPence / 100,
        delivery: draft.deliveryPence / 100,
        total: draft.totalPence / 100,
        status: "new",
        paymentStatus: "pending",
      },
    },
    { status: 201 }
  );
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
