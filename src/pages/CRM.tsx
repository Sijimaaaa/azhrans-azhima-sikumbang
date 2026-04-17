import React, { useState } from 'react';
import { useStore } from '../store';
import { generateBusinessInsights } from '../services/insightService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  History,
  TrendingUp,
  X
} from 'lucide-react';

export default function CRM() {
  const { customers, transactions, products } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const insights = generateBusinessInsights(transactions, products, customers);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-sans">Manajemen Pelanggan</h1>
          <p className="text-slate-500 font-medium">Database pelanggan & asisten pesan promosi cerdas</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-orange-600 transition-all">
          <Plus size={20} />
          Tambah Pelanggan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Customer List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama atau nomor WhatsApp..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold"
            />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Total Belanja</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kunjungan Terakhir</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-black">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{customer.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{customer.notes || 'Reguler'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                            <Phone size={14} className="text-slate-400" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                              <Mail size={14} />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-900">{formatCurrency(customer.totalSpent)}</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs font-bold text-slate-500">
                           {new Date(customer.lastPurchase).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                           <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: AI Promo Suggestions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             <div className="flex items-center gap-2 mb-6">
                <Sparkles size={24} className="text-indigo-300" />
                <h3 className="text-lg font-black tracking-tight">AI Promo Suggestion</h3>
             </div>
             <p className="text-sm font-medium text-indigo-100 mb-8 leading-relaxed">
               Kami mendeteksi beberapa pelanggan premium yang belum kembali lebih dari 14 hari. Gunakan saran pesan di bawah:
             </p>
             
             <div className="space-y-4">
               {insights.crmInsights.atRiskCustomers.map(risk => (
                 <div key={risk.id} className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{risk.name}</span>
                      <span className="text-[10px] font-black uppercase text-indigo-200">{risk.daysSinceLastPurchase} Hari Absen</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-xs italic text-indigo-50 leading-relaxed border border-white/5">
                      "{risk.suggestedPromo}"
                    </div>
                    <a 
                      href={`https://wa.me/${risk.phone.replace(/^0/, '62')}?text=${encodeURIComponent(risk.suggestedPromo)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-indigo-500 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageSquare size={14} />
                      Kirim WhatsApp
                    </a>
                 </div>
               ))}
               {insights.crmInsights.atRiskCustomers.length === 0 && (
                 <p className="text-center py-4 text-indigo-300 text-xs font-bold italic">Semua pelanggan aktif berkelanjutan.</p>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal (Simulated) */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-full"
            >
               <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 text-2xl font-black">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedCustomer.name}</h2>
                      <p className="text-slate-500 font-bold tracking-tight">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                  >
                    <X size={24} />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Belanja</p>
                        <p className="text-2xl font-black text-slate-900">{formatCurrency(selectedCustomer.totalSpent)}</p>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                           <p className="text-lg font-black text-emerald-600 uppercase tracking-tight">Active VIP</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-lg font-black flex items-center gap-2 text-slate-900 font-sans">
                        <History size={20} className="text-slate-400" />
                        Riwayat Aktivitas
                     </h3>
                     <div className="space-y-3">
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                           <div>
                              <p className="font-bold text-slate-900">Transaksi Berhasil</p>
                              <p className="text-xs text-slate-400 font-medium">{new Date(selectedCustomer.lastPurchase).toLocaleString()}</p>
                           </div>
                           <TrendingUp className="text-emerald-500" size={18} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={18} />
                    Kirim Pesan Promo
                  </button>
                  <button className="px-6 py-4 bg-white text-red-600 border border-slate-200 rounded-2xl font-bold hover:bg-red-50 transition-all">
                    Blokir
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
