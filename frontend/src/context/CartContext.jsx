import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DELIVERY_PRICE_PENCE } from "../data/shopCatalog";

const CartContext = createContext(null);
const STORAGE_KEY = "gwl-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const actions = useMemo(
    () => ({
      addItem(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.cartItemId === product.cartItemId);
          if (existing) {
            return current.map((item) =>
              item.cartItemId === product.cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }

          return [
            ...current,
            {
              cartItemId: product.cartItemId,
              productId: product.id,
              name: product.name,
              slug: product.slug,
              sizeLabel: product.sizeLabel,
              sizeId: product.sizeId,
              dimensions: product.dimensions,
              imageUrl: product.image_url || product.imageUrl,
              price: Number(product.price ?? product.price_pence / 100),
              quantity,
              scent: product.scent || "",
              scentId: product.scentId || "",
              colour: product.colour || "",
              colourId: product.colourId || "",
            },
          ];
        });
      },
      updateItem(cartItemId, patch) {
        setItems((current) =>
          current
            .map((item) =>
              item.cartItemId === cartItemId ? { ...item, ...patch } : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      removeItem(cartItemId) {
        setItems((current) =>
          current.filter((item) => item.cartItemId !== cartItemId)
        );
      },
      clearCart() {
        setItems([]);
      },
    }),
    []
  );

  const value = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const delivery = items.length ? DELIVERY_PRICE_PENCE / 100 : 0;

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      ...actions,
    };
  }, [actions, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
