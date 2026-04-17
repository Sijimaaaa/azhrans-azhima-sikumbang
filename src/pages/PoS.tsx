import { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode,
  CheckCircle2,
  Package,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PoS() {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, addTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'qris'>('cash');
  const [isSuccess, setIsSuccess] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax after discount
  const total = subtotal - discountAmount + tax;
  
  const change = paymentMethod === 'cash' && cashReceived ? Number(cashReceived) - total : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && (!cashReceived || Number(cashReceived) < total)) {
      alert('Pembayaran tunai kurang!');
      return;
    }

    const transaction = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      items: [...cart],
      subtotal,
      tax,
      discount: discountAmount,
      total,
      date: new Date().toISOString(),
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? Number(cashReceived) : undefined,
      change: paymentMethod === 'cash' ? change : undefined,
    };

    addTransaction(transaction, customerPhone || undefined);
    setLastTransaction(transaction);
    clearCart();
    setDiscount(0);
    setCashReceived('');
    setCustomerPhone('');
    setIsSuccess(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-8">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['Semua', 'Makanan', 'Minuman'].map(cat => (
              <button key={cat} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 whitespace-nowrap">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
          {filteredProducts.map((product) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={cn(
                "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-left flex flex-col group relative overflow-hidden",
                product.stock === 0 && "opacity-60 grayscale cursor-not-allowed"
              )}
            >
              <div className="w-full aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center text-slate-300 group-hover:text-indigo-200 transition-colors overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Package size={48} />
                )}
              </div>
              <h3 className="font-bold text-slate-900 leading-tight mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 mb-2">{product.category}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-bold text-indigo-600">{formatCurrency(product.price)}</span>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  product.stock < 10 ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                )}>
                  {product.stock} Stok
                </span>
              </div>
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Habis</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout */}
      <div className="w-96 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden relative">
        <AnimatePresence>
          {isSuccess && lastTransaction && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-white flex flex-col items-center p-6 overflow-y-auto"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shrink-0">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Pembayaran Berhasil!</h2>
              
              {/* Receipt Preview */}
              <div id="receipt" className="w-full mt-6 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-left font-mono text-xs space-y-3 bg-slate-50">
                <div className="text-center border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-sm uppercase">PoSPro UMKM</h3>
                  <p className="text-slate-500">Jl. Wirausaha No. 123</p>
                  <p className="text-slate-500">Telp: 0812-3456-7890</p>
                </div>
                
                <div className="flex justify-between text-slate-500">
                  <span>ID: {lastTransaction.id}</span>
                  <span>{new Date(lastTransaction.date).toLocaleDateString()}</span>
                </div>
                
                <div className="border-b border-slate-200 pb-2 space-y-1">
                  {lastTransaction.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(lastTransaction.subtotal)}</span>
                  </div>
                  {lastTransaction.discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Diskon</span>
                      <span>-{formatCurrency(lastTransaction.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Pajak (10%)</span>
                    <span>{formatCurrency(lastTransaction.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200">
                    <span>TOTAL</span>
                    <span>{formatCurrency(lastTransaction.total)}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Metode</span>
                    <span className="uppercase">{lastTransaction.paymentMethod}</span>
                  </div>
                  {lastTransaction.paymentMethod === 'cash' && (
                    <>
                      <div className="flex justify-between">
                        <span>Tunai</span>
                        <span>{formatCurrency(lastTransaction.cashReceived)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Kembali</span>
                        <span>{formatCurrency(lastTransaction.change)}</span>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="text-center pt-4 text-slate-400">
                  <p>Terima kasih atas kunjungan Anda!</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3 w-full shrink-0">
                <button 
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                >
                  <QrCode size={18} />
                  Cetak
                </button>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-900">Pesanan Baru</h2>
          <button 
            onClick={clearCart}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <ShoppingCart className="mb-4" size={48} />
              <p className="font-medium">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <Package size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-xs text-indigo-600 font-bold">{formatCurrency(item.price)}</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-white rounded-md text-slate-500 transition-colors shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-white rounded-md text-slate-500 transition-colors shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          {/* Customer Input */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="No. WA Pelanggan (Pilihan)" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            
            {/* Discount Input */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-500">Diskon (%)</span>
              <input 
                type="number" 
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-right text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-between text-sm text-slate-500">
              <span>Pajak (10%)</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'cash', icon: Banknote, label: 'Tunai' },
              { id: 'card', icon: CreditCard, label: 'Kartu' },
              { id: 'qris', icon: QrCode, label: 'QRIS' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all",
                  paymentMethod === method.id 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                )}
              >
                <method.icon size={18} />
                <span className="text-[10px] font-bold uppercase">{method.label}</span>
              </button>
            ))}
          </div>

          {/* Cash Input & Change */}
          {paymentMethod === 'cash' && cart.length > 0 && (
            <div className="space-y-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Bayar Tunai</span>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Rp</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-right text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Kembalian</span>
                <span className={cn(
                  "text-sm font-bold",
                  change < 0 ? "text-red-500" : "text-emerald-600"
                )}>
                  {formatCurrency(Math.max(0, change))}
                </span>
              </div>
            </div>
          )}

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || (paymentMethod === 'cash' && (!cashReceived || Number(cashReceived) < total))}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl",
              cart.length > 0 && (paymentMethod !== 'cash' || (cashReceived && Number(cashReceived) >= total))
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

import { ShoppingCart } from 'lucide-react';
