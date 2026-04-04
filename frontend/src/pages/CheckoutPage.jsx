import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { DELIVERY_PRICE_PENCE } from "../data/shopCatalog";
import { apiRequest, money } from "../lib/api";

const initialForm = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  postcode: "",
  notes: "",
  discountCode: "",
};

export function CheckoutPage() {
  const { items, subtotal, delivery, total } = useCart();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({
      ...form,
      shippingAddress: [
        form.addressLine1,
        form.addressLine2,
        form.townCity,
        form.postcode,
      ]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(", "),
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        sizeId: item.sizeId,
        colour: item.colour,
        scent: item.scent,
      })),
    }),
    [form, items]
  );

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await apiRequest("/api/stripe/checkout-session", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.location.assign(data.url);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F2EB] pt-20">
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-8"
            >
              <p className="text-sm text-[#8A7C69]">Checkout</p>
              <h1 className="mt-3 text-4xl font-serif text-[#2E2922]">
                Delivery details
              </h1>
              <p className="mt-3 text-[#6B6358]">
                Your details are saved with the order, then Stripe securely collects
                payment and confirms the delivery information.
              </p>

              {searchParams.get("cancelled") ? (
                <p className="mt-5 rounded-2xl bg-[#F4ECE2] px-4 py-3 text-sm text-[#6B6358]">
                  Payment was cancelled, so your basket is still here if you want to try again.
                </p>
              ) : null}

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  ["customerName", "Full name"],
                  ["customerEmail", "Email address"],
                  ["customerPhone", "Phone number"],
                  ["discountCode", "Discount code"],
                  ["addressLine1", "Address line 1"],
                  ["addressLine2", "Address line 2 (optional)"],
                  ["townCity", "Town / city"],
                  ["postcode", "Postcode"],
                ].map(([field, label]) => (
                  <label key={field} className="block">
                    <span className="mb-2 block text-sm text-[#6B6358]">{label}</span>
                    <input
                      value={form[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      className="form-input w-full rounded-full border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-3 text-[#2E2922]"
                    />
                  </label>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm text-[#6B6358]">Order notes</span>
                <textarea
                  rows="4"
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="form-input w-full rounded-2xl border border-[#D8CEC0] bg-[#FBF8F3] px-5 py-4 text-[#2E2922]"
                />
              </label>

              {error ? (
                <p className="mt-5 rounded-2xl bg-[#F5E4DE] px-4 py-3 text-sm text-[#8A3F2B]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={!items.length || submitting}
                className="btn-primary mt-8 rounded-full px-8 py-6"
              >
                {submitting ? "Opening Stripe..." : "Continue to secure payment"}
              </Button>
            </form>

            <aside className="h-fit rounded-2xl border border-[#D8CEC0] bg-[#2E2922] p-8 text-[#F7F2EB]">
              <h2 className="text-3xl font-serif">Order summary</h2>
              <p className="mt-3 text-sm text-[#DCCDBA]">
                Next-day delivery is applied once to every order.
              </p>

              <div className="mt-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="rounded-2xl border border-[#5B534A] p-4 text-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p>{item.name}</p>
                      <span>{money(item.price * item.quantity)}</span>
                    </div>
                    <p className="mt-2 text-[#DCCDBA]">
                      {item.sizeLabel} x {item.quantity}
                    </p>
                    <p className="mt-1 text-[#DCCDBA]">Colour: {item.colour}</p>
                    <p className="mt-1 text-[#DCCDBA]">Scent: {item.scent}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-[#5B534A] pt-6">
                <div className="flex items-center justify-between text-[#DCCDBA]">
                  <span>Subtotal</span>
                  <span className="text-[#F7F2EB]">{money(subtotal)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[#DCCDBA]">
                  <span>Next-day delivery</span>
                  <span className="text-[#F7F2EB]">
                    {money(delivery || DELIVERY_PRICE_PENCE / 100)}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xl text-[#F7F2EB]">
                  <span>Total</span>
                  <span>{money(total || subtotal + DELIVERY_PRICE_PENCE / 100)}</span>
                </div>
              </div>

              <Link to="/cart" className="mt-8 block">
                <Button className="btn-outline w-full rounded-full px-6 py-6">
                  Back to basket
                </Button>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
