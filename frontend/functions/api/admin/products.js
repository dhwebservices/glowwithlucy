import { getProducts, mapProduct } from "../../_lib/catalog";
import { requireStaff } from "../../_lib/auth";
import { badRequest, json, notAllowed, readJson } from "../../_lib/http";

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeProduct(body) {
  return {
    id: body.id ? Number(body.id) : null,
    slug: slugify(body.slug || body.name),
    name: String(body.name || "").trim(),
    sizeOz: Number(body.sizeOz || 0),
    subtitle: String(body.subtitle || "").trim(),
    description: String(body.description || "").trim(),
    scentNotes: String(body.scentNotes || "").trim(),
    burnTimeHours: Number(body.burnTimeHours || 0),
    pricePence: Math.round(Number(body.price || 0) * 100),
    imageUrl: String(body.imageUrl || "").trim(),
    featured: body.featured ? 1 : 0,
    active: body.active === false ? 0 : 1,
    sortOrder: Number(body.sortOrder || 0),
  };
}

async function ensureAuth(request, env) {
  const auth = await requireStaff(request, env);
  if (!auth.ok) return auth.response;
  return null;
}

export async function onRequestGet(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const products = await getProducts(context.env, true);
  return json({ products });
}

export async function onRequestPost(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const body = await readJson(context.request);
  if (!body) return badRequest("Invalid product payload");
  const product = normalizeProduct(body);

  if (
    !product.name ||
    !product.slug ||
    !product.sizeOz ||
    !product.description ||
    !product.burnTimeHours ||
    !product.pricePence
  ) {
    return badRequest("Please complete all required product fields");
  }

  if (product.id) {
    await context.env.DB.prepare(
      `UPDATE products SET
        slug = ?, name = ?, size_oz = ?, subtitle = ?, description = ?, scent_notes = ?,
        burn_time_hours = ?, price_pence = ?, image_url = ?, featured = ?, active = ?, sort_order = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`
    )
      .bind(
        product.slug,
        product.name,
        product.sizeOz,
        product.subtitle,
        product.description,
        product.scentNotes,
        product.burnTimeHours,
        product.pricePence,
        product.imageUrl,
        product.featured,
        product.active,
        product.sortOrder,
        product.id
      )
      .run();
  } else {
    await context.env.DB.prepare(
      `INSERT INTO products (
        slug, name, size_oz, subtitle, description, scent_notes, burn_time_hours, price_pence,
        image_url, featured, active, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        product.slug,
        product.name,
        product.sizeOz,
        product.subtitle,
        product.description,
        product.scentNotes,
        product.burnTimeHours,
        product.pricePence,
        product.imageUrl,
        product.featured,
        product.active,
        product.sortOrder
      )
      .run();
  }

  const row = product.id
    ? await context.env.DB.prepare("SELECT * FROM products WHERE id = ?")
        .bind(product.id)
        .first()
    : await context.env.DB.prepare("SELECT * FROM products WHERE slug = ?")
        .bind(product.slug)
        .first();

  return json({ product: mapProduct(row) });
}

export async function onRequestDelete(context) {
  const denied = await ensureAuth(context.request, context.env);
  if (denied) return denied;

  const body = await readJson(context.request);
  const id = Number(body?.id || 0);
  if (!id) return badRequest("Product id is required");

  await context.env.DB.prepare("DELETE FROM products WHERE id = ?")
    .bind(id)
    .run();

  return json({ success: true });
}

export async function onRequest(context) {
  return notAllowed(context.request.method);
}
