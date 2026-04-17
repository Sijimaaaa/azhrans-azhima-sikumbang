export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  costPrice: number;
  category: string;
  image?: string;
  description?: string;
  supplier?: {
    name: string;
    whatsapp: string;
    email: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'qris';
  cashReceived?: number;
  change?: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  lastPurchase: string;
  notes?: string;
}

export type Page = 'dashboard' | 'products' | 'inventory' | 'pos' | 'transactions' | 'webstore' | 'login' | 'insights' | 'crm';
