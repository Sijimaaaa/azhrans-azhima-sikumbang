import { create } from 'zustand';
import { Product, Transaction, CartItem, StockMovement } from './types';

interface AppState {
  products: Product[];
  transactions: Transaction[];
  cart: CartItem[];
  stockMovements: StockMovement[];
  
  // Product Actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Inventory Actions
  adjustStock: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  
  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Transaction Actions
  addTransaction: (transaction: Transaction) => void;
}

export const useStore = create<AppState>((set) => ({
  products: [
    { id: '1', name: 'Kopi Susu Gula Aren', price: 18000, stock: 50, category: 'Minuman' },
    { id: '2', name: 'Roti Bakar Cokelat', price: 15000, stock: 30, category: 'Makanan' },
    { id: '3', name: 'Es Teh Manis', price: 5000, stock: 100, category: 'Minuman' },
    { id: '4', name: 'Nasi Goreng Spesial', price: 25000, stock: 20, category: 'Makanan' },
  ],
  transactions: [],
  cart: [],
  stockMovements: [],

  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) => set((state) => ({
    products: state.products.map((p) => (p.id === product.id ? product : p)),
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),

  adjustStock: (movement) => set((state) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };

    return {
      stockMovements: [newMovement, ...state.stockMovements],
      products: state.products.map((p) => {
        if (p.id === movement.productId) {
          const quantityChange = movement.type === 'in' ? movement.quantity : -movement.quantity;
          return { ...p, stock: Math.max(0, p.stock + quantityChange) };
        }
        return p;
      }),
    };
  }),

  addToCart: (product) => set((state) => {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id),
  })),

  updateCartQuantity: (id, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0),
  })),

  clearCart: () => set({ cart: [] }),

  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions],
    products: state.products.map((p) => {
      const cartItem = transaction.items.find((item) => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    }),
  })),
}));
