import { Transaction, Product, CartItem } from '../types';

export interface InsightReport {
  generatedAt: string;
  analysisPeriod: string;
  stockPredictions: {
    productId: string;
    productName: string;
    currentStock: number;
    daysToZero: number;
    isHighRisk: boolean;
    restockAdvice: string;
  }[];
  operationalInsights: {
    peakHours: {
      timeRange: string;
      avgTransactions: number;
      label: 'Low' | 'Normal' | 'High' | 'Critical';
    }[];
    staffingRecommendation: string;
  };
  categoryExpansion: {
    category: string;
    growthPercentage: number;
    trendStatus: 'Booming' | 'Stable' | 'Declining';
    actionPriority: string;
  }[];
  financials: {
    totalRevenue: number;
    totalCogs: number;
    netProfit: number;
    profitMargin: number;
  };
  crmInsights: {
    atRiskCustomers: {
      id: string;
      name: string;
      phone: string;
      daysSinceLastPurchase: number;
      suggestedPromo: string;
    }[];
  };
}

/**
 * Service to generate business insights based on transaction history and current stock.
 */
export const generateBusinessInsights = (
  transactions: Transaction[],
  products: Product[],
  customers: any[] = [],
  periodDays: number = 30
): InsightReport => {
  const now = new Date();
  const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  // 1. Filter transactions for the analysis period
  const periodTransactions = transactions.filter(t => new Date(t.date) >= periodStart);

  // 2. PRODUCT VELOCITY & STOCK PREDICTION
  const salesMap: Record<string, number> = {};
  periodTransactions.forEach(t => {
    t.items.forEach(item => {
      salesMap[item.id] = (salesMap[item.id] || 0) + item.quantity;
    });
  });

  const stockPredictions = products.map(product => {
    const totalSold = salesMap[product.id] || 0;
    const dailyVelocity = totalSold / periodDays;
    
    // Default to 999 if no sales (infinite days)
    let daysToZero = dailyVelocity > 0 ? Math.floor(product.stock / dailyVelocity) : 999;
    
    // Limit to reasonable number if stock is huge or velocity is tiny
    if (daysToZero > 99) daysToZero = 99;

    const isHighRisk = daysToZero <= 7;
    
    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      daysToZero,
      isHighRisk,
      restockAdvice: isHighRisk 
        ? `Stok kritis! Estimasi habis dalam ${daysToZero} hari. Segera order penambahan stok.` 
        : `Stok masih aman untuk ${daysToZero} hari ke depan.`
    };
  }).filter(p => p.isHighRisk || p.daysToZero < 14); // Only show relevant risks

  // 3. OPERATIONAL HOURS ANALYSIS
  const hourMap: Record<number, number> = {};
  transactions.forEach(t => {
    const hour = new Date(t.date).getHours();
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  const peakHours = Object.entries(hourMap)
    .map(([hour, count]) => {
      const h = parseInt(hour);
      const avg = count / (transactions.length > 0 ? transactions.length / 5 : 1); // Mock relative weight
      
      let label: 'Low' | 'Normal' | 'High' | 'Critical' = 'Normal';
      if (avg > 0.4) label = 'Critical';
      else if (avg > 0.25) label = 'High';
      else if (avg < 0.1) label = 'Low';

      return {
        timeRange: `${h.toString().padStart(2, '0')}:00 - ${(h + 1).toString().padStart(2, '0')}:00`,
        avgTransactions: parseFloat(avg.toFixed(2)),
        label
      };
    })
    .sort((a, b) => b.avgTransactions - a.avgTransactions)
    .slice(0, 3);

  // 4. CATEGORY GROWTH ANALYSIS
  // Splitting period into current half and previous half to find "growth"
  const halfPeriod = periodDays / 2;
  const midPoint = new Date(now.getTime() - halfPeriod * 24 * 60 * 60 * 1000);
  
  const currentSales: Record<string, number> = {};
  const previousSales: Record<string, number> = {};
  
  periodTransactions.forEach(t => {
    const isCurrent = new Date(t.date) >= midPoint;
    t.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      if (isCurrent) currentSales[item.category] = (currentSales[item.category] || 0) + itemTotal;
      else previousSales[item.category] = (previousSales[item.category] || 0) + itemTotal;
    });
  });

  const categories = Array.from(new Set(products.map(p => p.category)));
  const categoryExpansion = categories.map(cat => {
    const current = currentSales[cat] || 0;
    const previous = previousSales[cat] || 0;
    
    let growth = 0;
    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      growth = 100; // New category or period growth
    }

    let status: 'Booming' | 'Stable' | 'Declining' = 'Stable';
    if (growth > 10) status = 'Booming';
    else if (growth < -5) status = 'Declining';

    return {
      category: cat,
      growthPercentage: parseFloat(growth.toFixed(1)),
      trendStatus: status,
      actionPriority: status === 'Booming' 
        ? `Permintaan naik tajam (${growth.toFixed(1)}%). Tambahkan variasi produk di kategori ini.` 
        : `Kategori ${cat} terpantau stabil.`
    };
  }).sort((a, b) => b.growthPercentage - a.growthPercentage);

  return {
    generatedAt: now.toISOString(),
    analysisPeriod: `Analisis ${periodDays} Hari Terakhir`,
    stockPredictions: stockPredictions.sort((a, b) => a.daysToZero - b.daysToZero),
    operationalInsights: {
      peakHours,
      staffingRecommendation: peakHours.some(h => h.label === 'Critical') 
        ? "Diperlukan staf tambahan pada jam puncak untuk menjaga kecepatan layanan." 
        : "Jumlah staf saat ini memadai."
    },
    categoryExpansion: categoryExpansion.slice(0, 3),
    financials: (() => {
      let totalRevenue = 0;
      let totalCogs = 0;
      
      periodTransactions.forEach(t => {
        totalRevenue += t.total;
        t.items.forEach(item => {
          // Find the product to get its COGS
          const product = products.find(p => p.id === item.id);
          const cogs = product ? product.costPrice : item.price * 0.6; // Fallback to 60%
          totalCogs += cogs * item.quantity;
        });
      });

      const netProfit = totalRevenue - totalCogs;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        totalRevenue,
        totalCogs,
        netProfit,
        profitMargin: parseFloat(profitMargin.toFixed(1))
      };
    })(),
    crmInsights: {
      atRiskCustomers: customers
        .map(c => {
          const lastDate = new Date(c.lastPurchase);
          const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: c.id,
            name: c.name,
            phone: c.phone,
            daysSinceLastPurchase: diffDays,
            suggestedPromo: `Halo ${c.name}, sudah ${diffDays} hari sejak kunjungan terakhirmu. Ada diskon khusus 15% untuk Indomie favoritmu hari ini di WarmindoPro!`
          };
        })
        .filter(c => c.daysSinceLastPurchase >= 14 && c.daysSinceLastPurchase <= 60) // Not too old, not too recent
        .sort((a, b) => b.daysSinceLastPurchase - a.daysSinceLastPurchase)
        .slice(0, 5)
    }
  };
};
