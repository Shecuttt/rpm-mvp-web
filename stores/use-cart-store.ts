import { create } from "zustand";
import type { Product } from "@/lib/types";

export type CartItem = Product & { quantity: number };

interface CartState {
  items: CartItem[];
  // setItem = replace cart with single product (useful untuk "Buy Now")
  setItem: (item: Product, qty?: number) => void;
  // addItem = add to cart (increase qty if exists)
  addItem: (item: Product, qty?: number) => void;
  removeItem: (id: Product["id"]) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  setItem: (item, qty = 1) =>
    set({
      items: [{ ...item, quantity: qty }],
    }),

  addItem: (item, qty = 1) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...item, quantity: qty }] });
    }
  },

  removeItem: (id) =>
    set({
      items: get().items.filter((i) => i.id !== id),
    }),

  clear: () => set({ items: [] }),
}));
