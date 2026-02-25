import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image?: string
    quantity: number
    stock: number
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                                    : i
                            ),
                        }
                    }
                    return { items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }] }
                })
            },
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }))
            },
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock) } : i
                    ),
                }))
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },
        }),
        {
            name: 'panenhub-cart',
        }
    )
)
