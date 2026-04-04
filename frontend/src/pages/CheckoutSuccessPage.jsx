import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { apiRequest, money } from "../lib/api";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Missing Stripe session details.");
      return;
    }

    apiRequest(`/api/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((data) => {
        setOrder(data.order);
        clearCart();
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [clearCart, searchParams]);

  return (
    <div className="min-h-screen bg-[#F7F2EB] pt-20">
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          {order ? (
            <>
              <p className="text-sm text-[#8A7C69]">Payment complete</p>
              <h1 className="mt-4 text-5xl font-serif text-[#2E2922]">
                Thank you for your order
              </h1>
              <p className="mt-6 text-lg text-[#6B6358]">
                Your reference is{" "}
                <span className="font-medium text-[#2E2922]">{order.orderNumber}</span>.
              </p>
              <div className="mt-10 rounded-2xl border border-[#D8CEC0] bg-white/90 p-8 text-left">
                <div className="flex justify-between text-[#6B6358]">
                  <span>Subtotal</span>
                  <span className="text-[#2E2922]">{money(order.subtotal)}</span>
                </div>
                <div className="mt-3 flex justify-between text-[#6B6358]">
                  <span>Next-day delivery</span>
                  <span className="text-[#2E2922]">{money(order.delivery)}</span>
                </div>
                <div className="mt-3 flex justify-between text-[#6B6358]">
                  <span>Total</span>
                  <span className="text-[#2E2922]">{money(order.total)}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-[#8A7C69]">Confirming payment</p>
              <h1 className="mt-4 text-5xl font-serif text-[#2E2922]">
                Finalising your order
              </h1>
              <p className="mt-6 text-lg text-[#6B6358]">
                {error || "Please wait while we confirm your Stripe payment."}
              </p>
            </>
          )}

          <Link to="/shop">
            <Button className="btn-primary mt-10 rounded-full px-8">
              Return to shop
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
