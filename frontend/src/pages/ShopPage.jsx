import { ArrowRight, Mail, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useCart } from "../context/CartContext";
import { DELIVERY_PRICE_PENCE, SHOP_PRODUCTS } from "../data/shopCatalog";
import { money } from "../lib/api";

export const ShopPage = () => {
  const { itemCount } = useCart();

  return (
    <div className="pt-20" data-testid="shop-page">
      <section className="bg-[#F7F2EB] py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#7A6C58]">Custom candle shop</p>
            <h1 className="mt-4 text-5xl font-serif font-light tracking-tight text-[#2E2922] sm:text-6xl">
              Choose your sculpted candle
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#6B6358]">
              Browse the collection, open a full product page, and customise the
              candle there with your size, colour, and scent choices.
            </p>
          </div>

          <div className="rounded-2xl border border-[#D8CEC0] bg-white/80 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#6B6358]">Basket items</p>
                <p className="mt-2 text-4xl font-serif text-[#2E2922]">{itemCount}</p>
              </div>
              <Link to="/cart">
                <Button className="btn-primary rounded-full px-6">
                  View basket
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 rounded-2xl bg-[#F4ECE2] p-4 text-sm text-[#4B4338]">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4" />
                <span>Next-day delivery is {money(DELIVERY_PRICE_PENCE / 100)} per order.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#ECE3D7] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif text-[#2E2922] lg:text-4xl">
                Shop the collection
              </h2>
              <p className="mt-2 text-[#6B6358]">
                Each candle opens into its own product page for customisation.
              </p>
            </div>
            <Link to="/checkout">
              <Button className="btn-outline rounded-full px-6">Go to checkout</Button>
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {SHOP_PRODUCTS.map((product) => {
              const fromPrice = Math.min(...product.sizes.map((size) => size.pricePence)) / 100;

              return (
                <article
                  key={product.id}
                  className="candle-card overflow-hidden rounded-2xl border border-[#D8CEC0] bg-[#F9F6F1]"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="img-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-[#8A7C69]">{product.subtitle}</p>
                    <h3 className="mt-3 text-3xl font-serif text-[#2E2922]">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#6B6358]">
                      {product.description}
                    </p>

                    <div className="mt-5 rounded-2xl bg-[#F4ECE2] p-4">
                      <p className="text-sm text-[#6B6358]">Available sizes</p>
                      <p className="mt-2 text-sm text-[#4B4338]">
                        {product.sizes.map((size) => size.label).join(", ")}
                      </p>
                      <p className="mt-3 text-2xl font-serif text-[#2E2922]">
                        From {money(fromPrice)}
                      </p>
                    </div>

                    <Link to={`/shop/${product.slug}`} className="mt-6 block">
                      <Button className="btn-primary w-full rounded-full px-6 py-6">
                        View product
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F4ED] py-24 lg:py-28" data-testid="how-to-order-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-serif text-[#2E2922] lg:text-4xl">
              How to order
            </h2>
            <p className="mt-3 text-[#6B6358]">
              Customers now move from the shop grid into a dedicated product page
              before adding anything to the basket.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Open a product page",
                copy: "Choose Heart Bears, Rose, Spirals, or Bubble Cubes to view the full product details first.",
              },
              {
                title: "Customise the candle",
                copy: "Pick the size, colour, and scent on the product page, then add the finished candle to the basket.",
              },
              {
                title: "Checkout and pay",
                copy: "Review the basket, enter delivery details, and continue into payment once Stripe is connected.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-[#D8CEC0] bg-white/80 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6D6C0] text-[#2E2922]">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-2xl font-serif text-[#2E2922]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[#6B6358]">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#CDB79B] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mb-4 flex items-center justify-center">
            <Mail className="h-6 w-6 text-[#2E2922]" />
          </div>
          <h3 className="text-2xl font-serif text-[#2E2922]">
            Need a bespoke order or event quantity?
          </h3>
          <p className="mt-4 font-light text-[#3A342C]">
            Reach out at{" "}
            <a
              href="mailto:Lucyd789@sky.com"
              className="underline hover:no-underline"
            >
              Lucyd789@sky.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};
