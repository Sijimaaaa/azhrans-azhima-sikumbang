import { create } from 'zustand';
import { Product, Transaction, CartItem, StockMovement, Customer } from './types';

interface AppState {
  products: Product[];
  transactions: Transaction[];
  customers: Customer[];
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
  addTransaction: (transaction: Transaction, customerPhone?: string) => void;
  clearTransactions: () => void;
  
  // Customer Actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;

  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  products: [
    { 
      id: '1', 
      name: 'Indomie Goreng Original + Telur', 
      price: 15000, 
      costPrice: 8500,
      stock: 50, 
      category: 'Mie Goreng',
      description: 'Mie goreng legendaris dengan bumbu rahasia Warmindo, disajikan dengan telur mata sapi dan bawang goreng renyah.',
      image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Agen Sembako Makmur', whatsapp: '628123456789', email: 'makmur@agen.com' }
    },
    { 
      id: '2', 
      name: 'Indomie Aceh Jumbo Pedas', 
      price: 18000, 
      costPrice: 9500,
      stock: 30, 
      category: 'Mie Goreng',
      description: 'Cita rasa rempah Aceh yang kuat dengan mie ukuran jumbo, lengkap dengan irisan cabai rawit dan telur.',
      image: 'https://images.unsplash.com/photo-1621511252110-534bc7e5843b?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Distributor Mie Utama', whatsapp: '628987654321', email: 'utama@mie.com' }
    },
    { 
      id: '3', 
      name: 'Soto Medan Creamy Telur', 
      price: 16000, 
      costPrice: 9000,
      stock: 100, 
      category: 'Mie Kuah',
      description: 'Kuah soto yang kental dan gurih, disajikan hangat dengan telur rebus dan perasan jeruk nipis.',
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Agen Sembako Makmur', whatsapp: '628123456789', email: 'makmur@agen.com' }
    },
    { 
      id: '4', 
      name: 'Mie Dok-dok Spesial', 
      price: 20000, 
      costPrice: 11000,
      stock: 20, 
      category: 'Spesial',
      description: 'Menu andalan Warmindo dengan kuah nyemek yang gurih pedas, dicampur telur hancur dan sayuran segar.',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Distributor Mie Utama', whatsapp: '628987654321', email: 'utama@mie.com' }
    },
    { 
      id: '5', 
      name: 'Magelangan Warmindo', 
      price: 22000, 
      costPrice: 12000,
      stock: 25, 
      category: 'Nasi',
      description: 'Perpaduan sempurna nasi goreng dan mie instan yang dimasak bersama dengan bumbu racikan khas.',
      image: 'https://images.unsplash.com/photo-1596797038530-2c396b5967d0?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Pasar Induk Beras', whatsapp: '628555666777', email: 'sales@beras.com' }
    },
    { 
      id: '6', 
      name: 'Nasi Gila Bar-bar', 
      price: 25000, 
      costPrice: 14000,
      stock: 15, 
      category: 'Nasi',
      description: 'Nasi putih dengan topping tumisan sosis, bakso, dan telur yang melimpah dengan rasa manis pedas gurih.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Pasar Induk Beras', whatsapp: '628555666777', email: 'sales@beras.com' }
    },
    { 
      id: '7', 
      name: 'Indomie Rendang + Telur', 
      price: 17000, 
      costPrice: 9000,
      stock: 40, 
      category: 'Mie Goreng',
      description: 'Mie instan rasa rendang dengan aroma yang sangat menggoda, makin nikmat dengan tambahan telur dadar.',
      image: 'https://images.unsplash.com/photo-1558102821-30948c26ec74?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Distributor Mie Utama', whatsapp: '628987654321', email: 'utama@mie.com' }
    },
    { 
      id: '8', 
      name: 'Tante (Tanpa Telur) Pedas', 
      price: 10000, 
      costPrice: 6000,
      stock: 60, 
      category: 'Mie Goreng',
      description: 'Pilihan ekonomis buat kamu yang lagi pengen mie instan pedas murni tanpa tambahan telur.',
      image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Distributor Mie Utama', whatsapp: '628987654321', email: 'utama@mie.com' }
    },
    { 
      id: '9', 
      name: 'Es Teh Manis Jumbo', 
      price: 5000, 
      costPrice: 1500,
      stock: 200, 
      category: 'Minuman',
      description: 'Segarkan harimu dengan es teh manis ukuran besar, pasangan wajib untuk setiap menu Warmindo.',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
      supplier: { name: 'Toko Plastik & Es', whatsapp: '6281122334455', email: 'ice@shop.com' }
    },
  ],
  transactions: [],
  customers: [
    { id: '1', name: 'Budi Santoso', phone: '081234567890', totalSpent: 45000, lastPurchase: '2026-03-10T10:00:00Z' },
    { id: '2', name: 'Ani Wijaya', phone: '085678901234', totalSpent: 125000, lastPurchase: '2026-04-15T14:30:00Z' },
    { id: '3', name: 'Eko Prasetyo', phone: '089912345678', totalSpent: 22000, lastPurchase: '2026-04-01T12:00:00Z', notes: 'Suka pedas mampus' }
  ],
  cart: [],
  stockMovements: [],
  isAuthenticated: false,

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
  clearTransactions: () => set({ transactions: [], stockMovements: [] }),

  addTransaction: (transaction, customerPhone) => set((state) => {
    // Update Stock
    const updatedProducts = state.products.map((p) => {
      const cartItem = transaction.items.find((item) => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    });

    // Handle Customer Data if phone provided
    let updatedCustomers = [...state.customers];
    if (customerPhone) {
      const existingCustomer = state.customers.find(c => c.phone === customerPhone);
      if (existingCustomer) {
        updatedCustomers = state.customers.map(c => 
          c.phone === customerPhone 
            ? { ...c, totalSpent: c.totalSpent + transaction.total, lastPurchase: transaction.date }
            : c
        );
      } else {
        // Simple new customer entry (name unknown yet)
        updatedCustomers.push({
          id: Math.random().toString(36).substr(2, 9),
          name: 'Pelanggan Baru',
          phone: customerPhone,
          totalSpent: transaction.total,
          lastPurchase: transaction.date
        });
      }
    }

    return {
      transactions: [transaction, ...state.transactions],
      products: updatedProducts,
      customers: updatedCustomers
    };
  }),

  addCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers] })),
  updateCustomer: (customer) => set((state) => ({
    customers: state.customers.map((c) => (c.id === customer.id ? customer : c)),
  })),

  login: (password) => {
    if (password === 'admin123') {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false }),
}));
