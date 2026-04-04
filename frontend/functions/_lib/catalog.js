export function formatMoney(pence) {
  return Number(pence || 0) / 100;
}

export async function getProducts(env, includeInactive = false) {
  const query = includeInactive
    ? 'SELECT * FROM products ORDER BY sort_order ASC, id ASC'
    : 'SELECT * FROM products WHERE active = 1 ORDER BY sort_order ASC, id ASC';
  const { results } = await env.DB.prepare(query).all();
  return (results || []).map(mapProduct);
}

export function mapProduct(row) {
  return {
    ...row,
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    price: formatMoney(row.price_pence),
    formattedPrice: `£${(row.price_pence / 100).toFixed(2)}`,
    sizeLabel: `${row.size_oz} oz`,
  };
}

export async function findDiscount(env, code) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  const row = await env.DB.prepare('SELECT * FROM discount_codes WHERE code = ? AND active = 1').bind(normalized).first();
  return row || null;
}

export function calculateDiscount(discount, subtotalPence) {
  if (!discount) return 0;
  if (subtotalPence < Number(discount.min_order_pence || 0)) return 0;

  const now = Date.now();
  if (discount.starts_at && new Date(discount.starts_at).getTime() > now) return 0;
  if (discount.ends_at && new Date(discount.ends_at).getTime() < now) return 0;
  if (discount.usage_limit && Number(discount.times_used || 0) >= Number(discount.usage_limit)) return 0;

  if (discount.kind === 'percent') {
    return Math.min(subtotalPence, Math.round(subtotalPence * (Number(discount.amount) / 100)));
  }

  return Math.min(subtotalPence, Number(discount.amount || 0));
}

export function toOrderNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `GWL-${stamp}-${random}`;
}
