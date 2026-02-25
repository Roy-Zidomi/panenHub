import { create } from "zustand";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  add: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  remove: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
