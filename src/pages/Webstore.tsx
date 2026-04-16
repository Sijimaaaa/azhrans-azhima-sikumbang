import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { 
  ShoppingCart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  MapPin, 
  Clock,
  MessageCircle,
  Mail,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from '../types';

interface WebstoreProps {
  setPage: (page: Page) => void;
}

export default function Webstore({ setPage }: WebstoreProps) {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(products.map(p => p.category)))];
  
  const filteredProducts = products.filter(p => 
    selectedCategory === 'Semua' || p.category === selectedCategory
  );

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let message = "Halo Warmindo Pro! Saya ingin memesan:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
    });
    message += `\n*Total: ${formatCurrency(subtotal)}*\n\nMohon segera dikonfirmasi ya, terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1A1A1A] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 h-20">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <ShoppingBag size={22} />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-orange-600">Warmindo<span className="text-slate-900">Pro</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-widest text-slate-500">
            <a href="#menu" className="hover:text-orange-600 transition-colors">Menu</a>
            <a href="#about" className="hover:text-orange-600 transition-colors">Tentang Kami</a>
            <a href="#contact" className="hover:text-orange-600 transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setPage('login')}
              className="text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors uppercase tracking-widest hidden sm:block"
            >
              Admin Login
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
              Level Up Your Mie Instan
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Bukan Sekadar <br /> <span className="text-orange-600">Warmindo</span> Biasa.
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              Nikmati kelezatan mie legendaris dengan sentuhan premium. Kami menyajikan menu Warmindo paling otentik dengan kualitas bintang lima.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#menu" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-2xl shadow-orange-200">
                Lihat Menu <ChevronRight size={20} />
              </a>
              <div className="flex -space-x-3 items-center ml-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/p${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <span className="pl-6 text-sm font-bold text-slate-500">1k+ Happy Customers</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl skew-y-2">
              <img 
                src="https://images.unsplash.com/photo-1596797038530-2c396b5967d0?auto=format&fit=crop&q=80&w=1200" 
                alt="Featured Product" 
                className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-1000"
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-orange-400 font-bold text-sm uppercase mb-2">Paling Dicari</p>
                  <h3 className="text-2xl font-bold">Magelangan Spesial Suroboyo</h3>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800" 
                  alt="Our Story" 
                  className="w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-100 rounded-full -z-10"></div>
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-48 h-48 bg-white rounded-[2rem] shadow-xl p-8 flex flex-col justify-center gap-2 hidden md:flex">
                <p className="text-4xl font-black text-orange-600">10+</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tahun Pengalaman</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                Cerita Kami
              </div>
              <h2 className="text-5xl font-black tracking-tight leading-tight">
                Membawa Level Baru ke <span className="text-orange-600">Mie Instan</span> Favorit Anda.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Berawal dari sebuah warung kecil di sudut kota, Warmindo Pro lahir dari keinginan untuk menyajikan mie instan—makanan sejuta umat—dengan standar kualitas yang lebih tinggi.
              </p>
              <p className="text-lg text-slate-500 leading-relaxed">
                Kami percaya bahwa kesederhanaan mie instan bisa bertransformasi menjadi hidangan gourmet jika dimasak dengan teknik yang tepat dan bahan-bahan segar setiap harinya. Setiap porsi adalah perpaduan antara nostalgia dan inovasi.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                    <ShoppingBag size={24} />
                  </div>
                  <h4 className="font-bold">Bahan Segar</h4>
                  <p className="text-sm text-slate-500">Sayuran dan telur pilihan dari pasar lokal setiap pagi.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
                    <Clock size={24} />
                  </div>
                  <h4 className="font-bold">Pelayanan Cepat</h4>
                  <p className="text-sm text-slate-500">Kami menghargai waktu Anda seberharga rasa pesanan Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Eksplorasi Rasa Terbaik</h2>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all",
                    selectedCategory === cat 
                      ? "bg-slate-900 text-white shadow-xl" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product.id}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100 transition-all p-4"
                >
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-black text-slate-900">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div className="px-4 space-y-3 pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">{product.category}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-100 group-hover:bg-orange-400 trasition-colors"></div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight">{product.name}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold w-4 text-center">
                          {cart.find(item => item.id === product.id)?.quantity || 0}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-orange-50 hover:text-orange-600 transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer id="contact" className="bg-slate-900 py-24 px-6 text-white text-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                <ShoppingBag size={22} />
              </div>
              <span className="text-3xl font-black tracking-tighter">Warmindo<span className="text-orange-500">Pro</span></span>
            </div>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              Elevating your humble noodles experience. Temukan cita rasa Warmindo yang tak terlupakan hanya di WarmindoPro.
            </p>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all">
                <Instagram size={20} />
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all">
                <Facebook size={20} />
              </button>
              <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-emerald-600 transition-all">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">Hubungi Kami</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-slate-500" size={18} />
                <a href="mailto:hello@warmindopro.id" className="text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">hello@warmindopro.id</a>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="text-slate-500" size={18} />
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">+62 812-3456-7890</a>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="text-slate-500" size={18} />
                <a href="https://instagram.com/warmindopro" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">@warmindopro</a>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">Operasional</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="text-slate-500" size={18} />
                <span className="text-slate-300">Setiap Hari: 10:00 - 22:00</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-slate-500" size={18} />
                <span className="text-slate-300">Jl. Sudirman No. 45, Jakarta</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">Legal</h4>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 text-slate-500 text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 WarmindoPro Management System. All Rights Reserved.</p>
          <p>Powered by NextGen POS</p>
        </div>
      </footer>

      {/* Floating Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <ShoppingCart size={20} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Keranjang Anda</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                    <ShoppingBag size={80} strokeWidth={1} />
                    <p className="text-xl font-bold">Wah, keranjang kosong nih!</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-orange-600 font-bold uppercase tracking-widest text-xs border-b-2 border-orange-600 pb-1"
                    >
                      Mulai Belanja Sekarang
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-slate-900 uppercase tracking-tight leading-tight">{item.name}</h4>
                        <p className="text-orange-600 font-bold text-sm">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-slate-50 space-y-6 border-t border-slate-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 text-2xl font-black pt-4 border-t border-slate-200">
                      <span>Total Pesanan</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 text-lg"
                  >
                    <MessageCircle size={24} />
                    Pesan via WhatsApp
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
