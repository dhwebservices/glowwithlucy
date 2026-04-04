import { useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useCart } from "../context/CartContext";
import {
  buildCartItemId,
  COLOUR_OPTIONS,
  DELIVERY_PRICE_PENCE,
  formatSizeLabel,
  getProductBySlug,
  SCENT_OPTIONS,
} from "../data/shopCatalog";
import { money } from "../lib/api";

export function ProductPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  const [sizeId, setSizeId] = useState(product?.sizes?.[0]?.id ?? "");
  const [colourId, setColourId] = useState(COLOUR_OPTIONS[0].id);
  const [scentId, setScentId] = useState(SCENT_OPTIONS[0].id);

  const selectedSize = useMemo(
    () => product?.sizes.find((size) => size.id === sizeId) ?? null,
    [product, sizeId]
  );
  const selectedColour = COLOUR_OPTIONS.find((colour) => colour.id === colourId);
  const selectedScent = SCENT_OPTIONS.find((scent) => scent.id === scentId);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  function handleAddToBasket() {
    addItem({
      ...product,
      cartItemId: buildCartItemId({
        productId: product.id,
        sizeId: selectedSize.id,
        colourId: selectedColour.id,
        scentId: selectedScent.id,
      }),
      sizeId: selectedSize.id,
      sizeLabel: formatSizeLabel(selectedSize),
      dimensions: selectedSize.dimensions,
      price: selectedSize.pricePence / 100,
      colour: selectedColour.label,
      colourId: selectedColour.id,
      scent: selectedScent.label,
      scentId: selectedScent.id,
    });
  }

  return (
    <div className="min-h-screen bg-[#F7F2EB] pt-20">
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-[#6B6358] transition-colors hover:text-[#2E2922]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="overflow-hidden rounded-2xl border border-[#D8CEC0] bg-white/80">
              <div className="aspect-[5/6] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="img-cover"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8CEC0] bg-[#FCFAF7] p-8">
              <p className="text-sm text-[#8A7C69]">{product.subtitle}</p>
              <h1 className="mt-3 text-5xl font-serif text-[#2E2922]">
                {product.name}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#6B6358]">
                {product.description}
              </p>

              <div className="mt-8 rounded-2xl bg-[#F1E8DC] p-5">
                <p className="text-sm text-[#6B6358]">Your current selection</p>
                <p className="mt-2 text-xl font-serif text-[#2E2922]">
                  {formatSizeLabel(selectedSize)}
                </p>
                <div className="mt-4 grid gap-2 text-sm text-[#4B4338]">
                  <p>Colour: {selectedColour.label}</p>
                  <p>Scent: {selectedScent.label}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-[#6B6358]">Candle price</span>
                  <span className="text-3xl font-serif text-[#2E2922]">
                    {money(selectedSize.pricePence / 100)}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-5">
                <label className="block">
                  <span className="mb-2 block text-sm text-[#6B6358]">
                    Now customise your candle..
                  </span>
                  <Select value={sizeId} onValueChange={setSizeId}>
                    <SelectTrigger className="h-12 rounded-xl border-[#D8CEC0] bg-white px-4 text-[#2E2922] shadow-none">
                      <SelectValue placeholder="Choose a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.label} - {size.dimensions}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#6B6358]">Colour</span>
                  <Select value={colourId} onValueChange={setColourId}>
                    <SelectTrigger className="h-12 rounded-xl border-[#D8CEC0] bg-white px-4 text-[#2E2922] shadow-none">
                      <SelectValue placeholder="Choose a colour" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOUR_OPTIONS.map((colour) => (
                        <SelectItem key={colour.id} value={colour.id}>
                          {colour.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-[#6B6358]">Scent</span>
                  <Select value={scentId} onValueChange={setScentId}>
                    <SelectTrigger className="h-12 rounded-xl border-[#D8CEC0] bg-white px-4 text-[#2E2922] shadow-none">
                      <SelectValue placeholder="Choose a scent" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCENT_OPTIONS.map((scent) => (
                        <SelectItem key={scent.id} value={scent.id}>
                          {scent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              </div>

              <div className="mt-8 rounded-2xl border border-[#E3D7C8] bg-white p-5 text-sm text-[#4B4338]">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-[#6B6358]" />
                  <span>
                    Next-day delivery is added at checkout for{" "}
                    {money(DELIVERY_PRICE_PENCE / 100)} per order.
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  className="btn-primary rounded-full px-8 py-6"
                  onClick={handleAddToBasket}
                >
                  Add to basket
                  <ShoppingBag className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/checkout">
                  <Button className="btn-outline rounded-full px-8 py-6">
                    Go to checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
