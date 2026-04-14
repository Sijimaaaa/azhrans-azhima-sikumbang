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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900">Transaksi Terakhir</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Belum ada transaksi hari ini.</div>
            ) : (
              transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                      #
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{formatCurrency(t.total)}</p>
                      <p className="text-xs text-slate-500">{new Date(t.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase">
                    {t.paymentMethod}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900">Stok Menipis</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">Kelola Stok</button>
          </div>
          <div className="divide-y divide-slate-100">
            {products.filter(p => p.stock < 10).length === 0 ? (
              <div className="p-12 text-center text-slate-400">Semua stok produk aman.</div>
            ) : (
              products.filter(p => p.stock < 10).slice(0, 5).map((p) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 overflow-hidden">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{p.stock} Tersisa</p>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1">
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
