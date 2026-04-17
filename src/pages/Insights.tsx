import React, { useMemo } from 'react';
import { useStore } from '../store';
import { generateBusinessInsights } from '../services/insightService';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Package,
  ExternalLink,
  MessageSquare,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function Insights() {
  const { transactions, products, customers } = useStore();
  
  const insights = useMemo(() => 
    generateBusinessInsights(transactions, products, customers),
    [transactions, products, customers]
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Business Insights</h1>
          <p className="text-slate-500 font-medium">Laporan otomatis & prediksi cerdas untuk UMKM Anda</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-lg shadow-slate-200">30 Hari Terakhir</button>
          <button className="px-4 py-2 text-slate-500 hover:text-slate-900 text-sm font-bold">90 Hari</button>
        </div>
      </div>

      {/* Financial Overview (Laba Rugi Otomatis) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Omzet" 
          value={formatCurrency(insights.financials.totalRevenue)} 
          icon={<DollarSign className="text-emerald-600" />} 
          color="emerald"
        />
        <StatCard 
          label="Biaya Modal (COGS)" 
          value={formatCurrency(insights.financials.totalCogs)} 
          icon={<Package className="text-orange-600" />} 
          color="orange"
        />
        <StatCard 
          label="Laba Bersih" 
          value={formatCurrency(insights.financials.netProfit)} 
          icon={<TrendingUp className="text-indigo-600" />} 
          color="indigo"
          isHighlight
        />
        <StatCard 
          label="Margin Keuntungan" 
          value={`${insights.financials.profitMargin}%`} 
          icon={<PieChart className="text-blue-600" />} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction: Restock Now */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Prediksi Restok (AI)</h2>
                  <p className="text-sm text-slate-500 font-medium">Berdasarkan kecepatan penjualan harian</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {insights.stockPredictions.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-bold italic">Semua stok diprediksi aman untuk saat ini.</p>
              ) : (
                insights.stockPredictions.map((pred) => (
                  <div key={pred.productId} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 transition-all group">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{pred.productName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${pred.isHighRisk ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                          {pred.daysToZero} Hari Lagi
                        </span>
                        <span className="text-xs text-slate-500 font-medium italic">{pred.restockAdvice}</span>
                      </div>
                    </div>
                    
                    {/* Supplier Integration */}
                    <div className="flex gap-2">
                       <a 
                        href={`https://wa.me/${products.find(p => p.id === pred.productId)?.supplier?.whatsapp}?text=Halo, saya ingin restock ${pred.productName} sebanyak 50 unit.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white text-emerald-600 rounded-xl border border-slate-200 hover:border-emerald-600 shadow-sm transition-all"
                        title="Hubungi Supplier"
                      >
                        <MessageSquare size={18} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Operational Rush Hours */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Analisis Jam Sibuk</h2>
                <p className="text-sm text-slate-500 font-medium">Rekomendasi penempatan staf</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.operationalInsights.peakHours.map((hour, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{hour.timeRange}</p>
                   <p className="text-lg font-black text-slate-900 mt-1">Sangat Sibuk</p>
                   <span className="text-[10px] font-black uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded inline-block mt-2">
                    {hour.label} Priority
                   </span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
              <AlertCircle className="text-indigo-600 shrink-0" size={20} />
              <p className="text-sm font-bold text-indigo-800">{insights.operationalInsights.staffingRecommendation}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Categories & CRM Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={120} />
             </div>
             <h3 className="text-lg font-black mb-4">Tren Kategori</h3>
             <div className="space-y-6 relative z-10">
               {insights.categoryExpansion.map((cat, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{cat.category}</span>
                      <span className="text-emerald-400 font-black">+{cat.growthPercentage}%</span>
                    </div>
                    <p className="text-xs text-slate-400 italic">{cat.actionPriority}</p>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-orange-500 rounded-[2rem] p-8 text-white shadow-xl shadow-orange-100">
             <h3 className="text-lg font-black mb-4 flex items-center gap-2">
               <Users size={20} />
               CRM Insight
             </h3>
             <p className="text-sm font-medium text-orange-100 mb-6">Deteksi pelanggan yang sudah lama tidak berkunjung.</p>
             <div className="space-y-4">
               {insights.crmInsights.atRiskCustomers.slice(0, 2).map(cust => (
                 <div key={cust.id} className="bg-orange-600/50 p-4 rounded-2xl border border-orange-400/20">
                    <p className="font-bold">{cust.name}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-80">{cust.daysSinceLastPurchase} Hari Absen</p>
                 </div>
               ))}
               <button className="w-full py-3 bg-white text-orange-600 rounded-xl font-black text-sm hover:bg-orange-50 transition-all">
                 Lihat Semua Pelanggan
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, isHighlight = false }: any) {
  return (
    <div className={`p-6 rounded-3xl border ${isHighlight ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-50 ring-2 ring-indigo-500/10' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${color}-50`}>
        {icon}
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-xl md:text-2xl font-black tracking-tight mt-1 ${isHighlight ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</p>
    </div>
  );
}
