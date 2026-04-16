import React, { useState } from 'react';
import { useStore } from '../store';
import { Page } from '../types';
import { motion } from 'motion/react';
import { Lock, User, ShoppingBag, ArrowLeft } from 'lucide-react';

interface LoginProps {
  setPage: (page: Page) => void;
}

export default function Login({ setPage }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    if (success) {
      setPage('dashboard');
    } else {
      setError('Password salah! Gukan "admin123" untuk prototype.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center p-6 font-sans">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => setPage('webstore')}
          className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Toko
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100 p-8 border border-orange-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Admin Login</h1>
          <p className="text-slate-500 mt-2 font-medium">Masuk untuk mengelola Warung Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                disabled
                value="admin_umkm"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold"
                required
              />
            </div>
            {error && <p className="text-xs text-red-500 font-bold ml-1 italic">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
          >
            Masuk Sekarang
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-4">
            <ShoppingBag size={18} />
            <span className="font-black tracking-tighter text-lg">Warmindo<span className="text-slate-900">Pro</span></span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Prototype Admin Access v1.0</p>
          <p className="text-[9px] text-slate-400 mt-1 italic">Hint: password adalah admin123</p>
        </div>
      </motion.div>
    </div>
  );
}

// Add ChevronRight icon to imports indirectly via motion or locally
import { ChevronRight } from 'lucide-react';
