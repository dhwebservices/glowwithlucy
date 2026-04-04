import { badRequest, json, notAllowed, readJson } from "../../_lib/http";
import { buildOrderDraft } from "../../_lib/orderDraft";

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid checkout payload");

  const draft = await buildOrderDraft(context.env, body);
  if (draft.error) return badRequest(draft.error);

  return json({
    subtotal: draft.subtotalPence / 100,
    discount: draft.discountPence / 100,
    delivery: draft.deliveryPence / 100,
    total: draft.totalPence / 100,
    discountCode: draft.discount?.code || "",
    discountDescription: draft.discount?.description || "",
  });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
