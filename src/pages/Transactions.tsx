import React, { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../lib/utils';
import { Search, Calendar, Download, Eye, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Transactions() {
  const { transactions } = useStore();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>
          <p className="text-slate-500 mt-1">Daftar semua penjualan yang telah dilakukan.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all shadow-sm">
          <Download size={20} />
          Ekspor Laporan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari ID transaksi..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Calendar size={18} />
            Pilih Tanggal
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Transaksi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Metode</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Belum ada riwayat transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((t, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={t.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-500">#{t.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{new Date(t.date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{new Date(t.date).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {t.items.length} Item ({t.items.reduce((a, b) => a + b.quantity, 0)} pcs)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{formatCurrency(t.total)}</span>
                        {t.discount > 0 && (
                          <span className="text-[10px] text-red-500 font-bold">Disc: -{formatCurrency(t.discount)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedTransaction(t)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Detail Transaksi</h2>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-left font-mono text-xs space-y-3 bg-slate-50">
                  <div className="text-center border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-sm uppercase">PoSPro UMKM</h3>
                    <p className="text-slate-500">Jl. Wirausaha No. 123</p>
                  </div>
                  
                  <div className="flex justify-between text-slate-500">
                    <span>ID: {selectedTransaction.id}</span>
                    <span>{new Date(selectedTransaction.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="border-b border-slate-200 pb-2 space-y-1">
                    {selectedTransaction.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedTransaction.subtotal)}</span>
                    </div>
                    {selectedTransaction.discount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Diskon</span>
                        <span>-{formatCurrency(selectedTransaction.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Pajak (10%)</span>
                      <span>{formatCurrency(selectedTransaction.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200">
                      <span>TOTAL</span>
                      <span>{formatCurrency(selectedTransaction.total)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span>Metode</span>
                      <span className="uppercase">{selectedTransaction.paymentMethod}</span>
                    </div>
                    {selectedTransaction.paymentMethod === 'cash' && (
                      <>
                        <div className="flex justify-between">
                          <span>Tunai</span>
                          <span>{formatCurrency(selectedTransaction.cashReceived)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Kembali</span>
                          <span>{formatCurrency(selectedTransaction.change)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <Printer size={18} />
                  Cetak
                </button>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
