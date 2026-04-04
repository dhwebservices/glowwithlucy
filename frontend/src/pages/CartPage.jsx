import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { money } from "../lib/api";

export function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, delivery, total, updateItem, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-[#F7F2EB] pt-20" data-testid="cart-page">
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-[#8A7C69]">Your basket</p>
              <h1 className="mt-3 text-5xl font-serif text-[#2E2922]">
                Review your order
              </h1>
            </div>
            <Button
              className="btn-outline rounded-full px-6"
              onClick={() => navigate("/shop")}
            >
              Continue shopping
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="mt-14 rounded-2xl border border-[#D8CEC0] bg-white/85 p-12 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-[#8A7C69]" />
              <h2 className="mt-5 text-2xl font-serif text-[#2E2922]">
                Your basket is empty
              </h2>
              <p className="mt-3 text-[#6B6358]">
                Start by customising one of Lucy&apos;s candle styles in the shop.
              </p>
              <Link to="/shop">
                <Button className="btn-primary mt-8 rounded-full px-8">
                  Browse candles
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-14 grid gap-8 lg:grid-cols-[1.55fr_0.85fr]">
              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={item.cartItemId}
                    className="rounded-2xl border border-[#D8CEC0] bg-white/90 p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-32 w-full rounded-xl object-cover sm:w-28"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-[#8A7C69]">{item.sizeLabel}</p>
                            <h2 className="mt-1 text-2xl font-serif text-[#2E2922]">
                              {item.name}
                            </h2>
                            <p className="mt-2 text-[#6B6358]">{money(item.price)} each</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="rounded-full border border-[#D8CEC0] p-2 text-[#6B6358] transition hover:text-[#2E2922]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-2xl bg-[#F4ECE2] p-4 text-sm text-[#4B4338]">
                          <p>
                            <span className="text-[#7A6C58]">Colour:</span> {item.colour}
                          </p>
                          <p>
                            <span className="text-[#7A6C58]">Scent:</span> {item.scent}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <div className="inline-flex items-center rounded-full border border-[#D8CEC0] bg-[#FBF8F3]">
                            <button
                              type="button"
                              className="p-3 text-[#6B6358]"
                              onClick={() =>
                                updateItem(item.cartItemId, {
                                  quantity: Math.max(1, item.quantity - 1),
                                })
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm text-[#2E2922]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="p-3 text-[#6B6358]"
                              onClick={() =>
                                updateItem(item.cartItemId, {
                                  quantity: item.quantity + 1,
                                })
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-lg font-serif text-[#2E2922]">
                            {money(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-2xl border border-[#D8CEC0] bg-[#2E2922] p-8 text-[#F7F2EB]">
                <p className="text-sm text-[#DCCDBA]">Order summary</p>
                <div className="mt-8 space-y-4 text-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[#DCCDBA]">Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#DCCDBA]">
                      <Truck className="h-4 w-4" />
                      Next-day delivery
                    </span>
                    <span>{money(delivery)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#5B534A] pt-4 text-xl">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-[#DCCDBA]">
                  Delivery is charged once per order at checkout.
                </p>
                <Button
                  className="mt-8 w-full rounded-full bg-[#D7C2A3] px-6 py-6 text-[#2E2922] hover:bg-[#CDB18A]"
                  onClick={() => navigate("/checkout")}
                >
                  Continue to checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
