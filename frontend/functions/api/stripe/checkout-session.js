import { badRequest, json, notAllowed, readJson } from "../../_lib/http";
import {
  buildOrderDraft,
  createOrderRecord,
} from "../../_lib/orderDraft";
import { stripeRequest } from "../../_lib/stripe";

function getOrigin(request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid checkout payload");

  const draft = await buildOrderDraft(context.env, body);
  if (draft.error) return badRequest(draft.error);

  const { orderId } = await createOrderRecord(context.env, draft);
  const origin = getOrigin(context.request);

  const session = await stripeRequest(context.env, "/checkout/sessions", {
    mode: "payment",
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?cancelled=1`,
    "shipping_address_collection[allowed_countries][0]": "GB",
    "phone_number_collection[enabled]": "true",
    "billing_address_collection": "required",
    "metadata[order_id]": String(orderId),
    "metadata[order_number]": draft.orderNumber,
    "metadata[customer_notes]": draft.customer.notes || "",
    "customer_email": draft.customer.email || undefined,
    line_items: [
      ...draft.detailedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "gbp",
          unit_amount: item.size.pricePence,
          product_data: {
            name: item.product.name,
            description: `${item.sizeLabel} | ${item.colour} | ${item.scent}`,
          },
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: draft.deliveryPence,
          product_data: {
            name: "Next-day delivery",
            description: "Standard next-day delivery charge",
          },
        },
      },
    ],
  });

  return json({
    url: session.url,
    sessionId: session.id,
    orderId,
    orderNumber: draft.orderNumber,
  });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
