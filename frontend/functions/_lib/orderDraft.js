import {
  calculateDiscount,
  findDiscount,
  toOrderNumber,
} from "./catalog";
import {
  DELIVERY_PRICE_PENCE,
  formatSizeLabel,
  getProductById,
  getSizeOption,
} from "../../src/data/shopCatalog";

export function normalizeOrderItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity || 0),
      sizeId: String(item.sizeId || "").trim(),
      scent: String(item.scent || "").trim(),
      colour: String(item.colour || "").trim(),
    }))
    .filter(
      (item) =>
        item.productId && item.quantity > 0 && item.sizeId && item.scent && item.colour
    );
}

export function getCustomerDetails(body) {
  return {
    name: String(body.customerName || "").trim(),
    email: String(body.customerEmail || "").trim(),
    phone: String(body.customerPhone || "").trim(),
    address: String(body.shippingAddress || "").trim(),
    notes: String(body.notes || "").trim(),
  };
}

export async function buildOrderDraft(env, body) {
  const items = normalizeOrderItems(body.items);
  const customer = getCustomerDetails(body);

  const detailedItems = items.map((item) => {
    const product = getProductById(item.productId);
    const size = getSizeOption(product, item.sizeId);

    if (!product || !size) return null;

    return {
      ...item,
      product,
      size,
      sizeLabel: formatSizeLabel(size),
      lineTotalPence: Number(size.pricePence) * item.quantity,
    };
  });

  if (!items.length || detailedItems.some((item) => !item)) {
    return { error: "Please add valid candle selections before checkout." };
  }

  const subtotalPence = detailedItems.reduce(
    (sum, item) => sum + item.lineTotalPence,
    0
  );
  const discount = await findDiscount(env, body.discountCode);
  const discountPence = calculateDiscount(discount, subtotalPence);
  const deliveryPence = DELIVERY_PRICE_PENCE;
  const totalPence = subtotalPence - discountPence + deliveryPence;

  return {
    customer,
    items,
    detailedItems,
    subtotalPence,
    discount,
    discountPence,
    deliveryPence,
    totalPence,
    orderNumber: toOrderNumber(),
  };
}

export async function createOrderRecord(env, draft) {
  const orderResult = await env.DB.prepare(
    `INSERT INTO orders (
      order_number, customer_name, customer_email, customer_phone, shipping_address, notes,
      subtotal_pence, discount_pence, total_pence, discount_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      draft.orderNumber,
      draft.customer.name || "Stripe customer",
      draft.customer.email || "pending@stripe.checkout",
      draft.customer.phone || null,
      draft.customer.address || "Collected via Stripe Checkout",
      draft.customer.notes || null,
      draft.subtotalPence,
      draft.discountPence,
      draft.totalPence,
      draft.discount?.code || null
    )
    .run();

  const orderId = orderResult.meta.last_row_id;

  for (const item of draft.detailedItems) {
    await env.DB.prepare(
      `INSERT INTO order_items (
        order_id, product_id, product_name, size_label, quantity, unit_price_pence, line_total_pence, scent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        orderId,
        item.product.id,
        item.product.name,
        item.sizeLabel,
        item.quantity,
        item.size.pricePence,
        item.lineTotalPence,
        `Scent: ${item.scent} | Colour: ${item.colour}`
      )
      .run();
  }

  return { orderId };
}

export async function incrementDiscountUsage(env, discount) {
  if (!discount) return;

  await env.DB.prepare(
    "UPDATE discount_codes SET times_used = times_used + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  )
    .bind(discount.id)
    .run();
}
