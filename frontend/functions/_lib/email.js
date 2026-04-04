import { money } from "../../src/lib/api";

const RESEND_API_BASE = "https://api.resend.com/emails";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function orderItemsHtml(items) {
  return (items || [])
    .map(
      (item) => `
        <li style="margin-bottom:12px;">
          <strong>${escapeHtml(item.product_name)}</strong><br />
          ${escapeHtml(item.size_label)} x ${escapeHtml(item.quantity)}<br />
          ${escapeHtml(item.scent || "")}<br />
          ${escapeHtml(money(item.line_total_pence / 100))}
        </li>
      `
    )
    .join("");
}

async function sendEmail(env, payload) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return;
  }

  const response = await fetch(RESEND_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || data?.error?.message || "Resend send failed");
  }
}

export async function sendOrderEmails(env, order, items) {
  const notificationEmail = env.ORDER_NOTIFICATION_EMAIL || "lucyd789@sky.com";
  const safeItems = items || [];
  const total = money(order.total_pence / 100);
  const subtotal = money(order.subtotal_pence / 100);
  const discount = money(order.discount_pence / 100);

  await Promise.all([
    sendEmail(env, {
      from: env.RESEND_FROM_EMAIL,
      to: [notificationEmail],
      subject: `New Glow With Lucy order ${order.order_number}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2E2922;">
          <h1>New order received</h1>
          <p><strong>Order:</strong> ${escapeHtml(order.order_number)}</p>
          <p><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(order.customer_phone || "Not provided")}</p>
          <p><strong>Address:</strong> ${escapeHtml(order.shipping_address)}</p>
          <p><strong>Total:</strong> ${escapeHtml(total)}</p>
          <ul style="padding-left:20px;">${orderItemsHtml(safeItems)}</ul>
        </div>
      `,
    }),
    sendEmail(env, {
      from: env.RESEND_FROM_EMAIL,
      to: [order.customer_email],
      subject: `Your Glow With Lucy order ${order.order_number}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#2E2922;">
          <h1>Thank you for your order</h1>
          <p>Hi ${escapeHtml(order.customer_name)}, your order has been received.</p>
          <p><strong>Order number:</strong> ${escapeHtml(order.order_number)}</p>
          <p><strong>Subtotal:</strong> ${escapeHtml(subtotal)}</p>
          ${
            Number(order.discount_pence || 0) > 0
              ? `<p><strong>Discount:</strong> -${escapeHtml(discount)}</p>`
              : ""
          }
          <p><strong>Delivery:</strong> ${escapeHtml(money(3.2))}</p>
          <p><strong>Total paid:</strong> ${escapeHtml(total)}</p>
          <p><strong>Delivery address:</strong> ${escapeHtml(order.shipping_address)}</p>
          <h2 style="margin-top:24px;">Your candles</h2>
          <ul style="padding-left:20px;">${orderItemsHtml(safeItems)}</ul>
          <p style="margin-top:24px;">We’ll be in touch if we need anything else.</p>
        </div>
      `,
    }),
  ]);
}
