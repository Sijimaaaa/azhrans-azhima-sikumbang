import { useStore } from '../store';
import { formatCurrency, cn } from '../lib/utils';
import { TrendingUp, Package, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { products, transactions } = useStore();

  const totalSales = transactions.reduce((acc, curr) => acc + curr.total, 0);
  const totalProducts = products.length;
  const totalTransactions = transactions.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const stats = [
    { label: 'Total Penjualan', value: formatCurrency(totalSales), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12.5%', isUp: true },
    { label: 'Total Produk', value: totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+3', isUp: true },
    { label: 'Transaksi', value: totalTransactions, icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+5.2%', isUp: true },
    { label: 'Stok Menipis', value: lowStockProducts, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', trend: '-2', isUp: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ringkasan Bisnis</h1>
        <p className="text-slate-500 mt-1">Pantau performa UMKM Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={stat.label}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={stat.color} size={18} />
                </div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
              <div className={cn(
                "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Transaksi Terakhir</h2>
            <button className="text-xs text-indigo-600 font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Belum ada transaksi hari ini.</div>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                      #
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{formatCurrency(t.total)}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{new Date(t.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md uppercase">
                    {t.paymentMethod}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Stok Menipis</h2>
            <button className="text-xs text-indigo-600 font-bold hover:underline">Kelola Stok</button>
          </div>
          <div className="divide-y divide-slate-100">
            {products.filter(p => p.stock < 10).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Semua stok produk aman.</div>
            ) : (
              products.filter(p => p.stock < 10).slice(0, 5).map((p) => (
                <div key={p.id} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-red-600">{p.stock} Pcs</p>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 ml-auto">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${(p.stock / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
