import { getProducts } from "../_lib/catalog";
import { json, notAllowed } from "../_lib/http";

export async function onRequestGet(context) {
  const products = await getProducts(context.env);
  return json({ products });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
