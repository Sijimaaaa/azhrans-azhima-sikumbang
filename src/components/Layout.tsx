import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes,
  ShoppingCart, 
  History, 
  Menu, 
  X,
  User,
  Bell,
  Search,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Page } from '../types';
import { useStore } from '../store';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setPage: (page: Page) => void;
}

export default function Layout({ children, currentPage, setPage }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Kelola Produk', icon: Package },
    { id: 'inventory', label: 'Inventaris', icon: Boxes },
    { id: 'pos', label: 'Kasir / PoS', icon: ShoppingCart },
    { id: 'transactions', label: 'Riwayat Transaksi', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-50 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-slate-100 bg-slate-50/50",
          isSidebarOpen ? "justify-between" : "justify-center"
        )}>
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Package size={18} />
              </div>
              <span className="font-black text-lg tracking-tighter text-slate-900">PoS<span className="text-indigo-600">Pro</span></span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              className={cn(
                "w-full flex items-center rounded-xl transition-all duration-200 group relative",
                isSidebarOpen ? "gap-3 px-3 py-3" : "justify-center py-3 px-0",
                currentPage === item.id 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(
                "shrink-0",
                currentPage === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => setPage('webstore')}
            className={cn(
              "w-full flex items-center rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all duration-200 group",
              isSidebarOpen ? "gap-3 px-3 py-3" : "justify-center py-3 px-0"
            )}
            title="Lihat Toko"
          >
            <Globe size={20} className="shrink-0 text-emerald-500" />
            {isSidebarOpen && <span className="font-bold">Lihat Toko</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setPage('webstore')}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-bold">Kembali ke Beranda</span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all group relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin UMKM</p>
                <p className="text-xs text-slate-500 mt-1">Owner</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 focus:ring-2 focus:ring-indigo-500">
                <User size={20} />
              </div>
              
              {/* Logout Tooltip/Dropdown Prototype */}
              <button 
                onClick={() => {
                  logout();
                  setPage('login');
                }}
                className="absolute -bottom-12 right-0 bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-xl flex items-center gap-2 text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap z-[60]"
              >
                <LogOut size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Keluar Sesi</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
