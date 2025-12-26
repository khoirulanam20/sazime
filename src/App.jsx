import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard, Store, ScanLine, Settings, LogOut, ChevronRight,
  TrendingUp, AlertCircle, CheckCircle2, Search, Filter, Plus,
  Download, ArrowLeft, Package, ShoppingBag, ExternalLink, ChevronDown,
  Wallet, FileSpreadsheet, Edit3, X, Eye, Calendar, Share2, RefreshCw,
  Camera, Zap, Key, User, Truck, MapPin, CreditCard, Clock, FileText,
  CheckSquare, Square, QrCode, Keyboard, Phone, Printer, Menu, Save
} from 'lucide-react';

// --- KONFIGURASI TEMA ---
const THEME = {
  primary: 'bg-red-600',
  primaryHover: 'hover:bg-red-700',
  primaryText: 'text-red-600',
  primaryBorder: 'border-red-600',
  primaryLight: 'bg-red-50',
  primaryLightText: 'text-red-600',
  secondary: 'bg-slate-900', // Navy
  secondaryText: 'text-slate-900',
  headerMobile: 'bg-red-700',
  bottomNav: 'bg-red-700',
};

// --- SUB-KOMPONEN UI ---

const Sidebar = ({ activeMenu, setActiveMenu }) => (
  <aside className={`hidden lg:flex w-64 ${THEME.secondary} text-white h-screen fixed left-0 top-0 flex-col z-30 shadow-2xl`}>
    <div className="p-6 border-b border-slate-700/50">
      <h1 className="text-2xl font-black tracking-tighter flex items-center">
        <span className="text-red-500 mr-1">SAZIME</span>
        <span className="text-white italic">HUB</span>
      </h1>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold opacity-80">
        Internal Management System
      </p>
    </div>

    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {[
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'toko', icon: Store, label: 'Toko & Pesanan' },
        { id: 'status-pengiriman', icon: Truck, label: 'Status Pengiriman' },
        { id: 'cek-resi', icon: ScanLine, label: 'Cek Resi' },
        { id: 'rekap-setoran', icon: Wallet, label: 'Rekap Setoran' },
        { id: 'pengaturan', icon: Settings, label: 'Pengaturan' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveMenu(item.id)}
          className={`flex items-center w-full p-3.5 rounded-xl transition-all duration-200 group ${
            activeMenu === item.id || (activeMenu === 'toko-detail' && item.id === 'toko')
              ? `${THEME.primary} text-white shadow-lg shadow-red-900/20`
              : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <item.icon className={`w-5 h-5 mr-3 transition-transform ${activeMenu === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
          <span className="font-bold text-sm tracking-wide">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-700/50">
      <button className="flex items-center w-full p-3.5 text-red-400 hover:text-white transition rounded-xl hover:bg-red-600/20 group">
        <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Keluar</span>
      </button>
    </div>
  </aside>
);

const BottomNavbar = ({ activeMenu, setActiveMenu }) => (
  <nav className={`lg:hidden fixed bottom-0 left-0 right-0 ${THEME.bottomNav} text-white flex justify-around p-2 z-[60] pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.15)]`}>
    {[
      { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
      { id: 'toko', icon: Store, label: 'Toko' },
      { id: 'status-pengiriman', icon: Truck, label: 'Kirim' },
      { id: 'cek-resi', icon: ScanLine, label: 'Scan' },
      { id: 'rekap-setoran', icon: Wallet, label: 'Setor' },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => setActiveMenu(item.id)}
        className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 w-1/5 relative ${
          activeMenu === item.id || (activeMenu === 'toko-detail' && item.id === 'toko')
            ? 'opacity-100'
            : 'opacity-60 hover:opacity-100'
        }`}
      >
        <div className={`transition-all duration-300 ${activeMenu === item.id ? '-translate-y-1' : ''}`}>
           <item.icon className={`w-6 h-6 ${activeMenu === item.id ? 'scale-110 drop-shadow-md' : ''}`} />
        </div>
        <span className={`text-[9px] font-bold mt-1 uppercase tracking-tight transition-all ${activeMenu === item.id ? 'opacity-100 font-black' : 'opacity-0 h-0 overflow-hidden'}`}>
          {item.label}
        </span>
        {activeMenu === item.id && (
          <span className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></span>
        )}
      </button>
    ))}
  </nav>
);

const TopBar = ({ activeMenu, activeView, setActiveView }) => (
  <header className={`h-16 md:h-20 ${THEME.headerMobile} md:bg-white md:backdrop-blur-md md:border-b md:border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
    {/* Mobile Left */}
    <div className="flex items-center md:hidden">
       <div className="w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center mr-3">
          <span className="font-black text-white text-lg">S</span>
       </div>
       <h2 className="font-black text-white tracking-tight text-lg uppercase truncate max-w-[200px]">
        {activeMenu.replace(/-/g, ' ')}
      </h2>
    </div>

    {/* Desktop Left */}
    <div className="hidden md:flex items-center space-x-4 uppercase tracking-tighter">
      <h2 className="font-black text-slate-900 tracking-tight italic text-2xl">
        {activeMenu.replace(/-/g, ' ')}
      </h2>
    </div>

    {/* Right Section */}
    <div className="flex items-center space-x-3 md:space-x-4">
      <div className="flex bg-black/20 md:bg-slate-100 p-1 rounded-xl backdrop-blur-sm">
        <button
          onClick={() => setActiveView('owner')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
            activeView === 'owner'
              ? 'bg-white shadow-sm text-red-600'
              : 'text-white/70 md:text-slate-500 hover:text-white md:hover:text-slate-700'
          }`}
        >
          OWNER
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
            activeView === 'admin'
              ? 'bg-white shadow-sm text-red-600'
              : 'text-white/70 md:text-slate-500 hover:text-white md:hover:text-slate-700'
          }`}
        >
          ADMIN
        </button>
      </div>
      
      <div className="flex items-center space-x-2 md:border-l md:border-slate-200 md:pl-4">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white md:bg-red-600 rounded-full md:rounded-xl flex items-center justify-center text-red-600 md:text-white text-xs md:text-sm font-black shadow-sm ring-2 ring-white/20 md:ring-0">
          U
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-bold text-slate-800">Sazime User</span>
          <span className="text-[10px] text-slate-500 font-medium">Administrator</span>
        </div>
      </div>
    </div>
  </header>
);

const FilterBar = ({
  showStore = true, showDate = true,
  filterStore, setFilterStore,
  startDate, setStartDate,
  endDate, setEndDate,
  dateFilterMode, setDateFilterMode,
  stores,
}) => {
  // Generate Year Options (e.g., 2020 - 2030)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-center">
      {showStore && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Store className="w-3 h-3 mr-1" /> Pilih Toko
          </label>
          <div className="relative group">
            <select
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl text-xs font-bold py-3 pl-4 pr-10 outline-none focus:ring-2 focus:ring-red-500 transition-all appearance-none cursor-pointer text-slate-700"
            >
              <option value="All">Semua Toko</option>
              {stores.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      )}
      {showDate && (
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center">
            <Calendar className="w-3 h-3 mr-1" /> Periode Laporan
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {[{ k: 'day', l: 'Hari' }, { k: 'month', l: 'Bulan' }, { k: 'year', l: 'Tahun' }].map((m) => (
                <button
                  key={m.k}
                  onClick={() => {
                    setDateFilterMode(m.k);
                    const now = new Date();
                    if (m.k === 'day') {
                      const d = now.toISOString().slice(0, 10);
                      setStartDate(d); setEndDate(d);
                    } else if (m.k === 'month') {
                      const y = now.getFullYear();
                      const mm = String(now.getMonth() + 1).padStart(2, '0');
                      setStartDate(`${y}-${mm}-01`);
                      setEndDate(`${y}-${mm}-${String(new Date(y, now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`);
                    } else {
                      const y = now.getFullYear();
                      setStartDate(`${y}-01-01`); setEndDate(`${y}-12-31`);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    dateFilterMode === m.k ? 'bg-white shadow-sm text-red-600 ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m.l}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              {dateFilterMode === 'day' ? (
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setEndDate(e.target.value); }} className="w-full bg-slate-50 rounded-xl text-xs font-bold py-2.5 px-4 outline-none focus:ring-2 focus:ring-red-500 border border-slate-100" />
              ) : dateFilterMode === 'month' ? (
                <input type="month" value={startDate.slice(0, 7)} onChange={(e) => { const [y, m] = e.target.value.split('-'); setStartDate(`${y}-${m}-01`); setEndDate(`${y}-${m}-${new Date(y, m, 0).getDate()}`); }} className="w-full bg-slate-50 rounded-xl text-xs font-bold py-2.5 px-4 outline-none focus:ring-2 focus:ring-red-500 border border-slate-100" />
              ) : (
                // MODE TAHUN: Menggunakan Select Option
                <div className="relative group">
                  <select
                    value={startDate.slice(0, 4)}
                    onChange={(e) => { const y = e.target.value; setStartDate(`${y}-01-01`); setEndDate(`${y}-12-31`); }}
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold py-2.5 px-4 outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-red-500 transition-colors" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Modal = ({ title, type, onClose, data, products }) => (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-sm sm:p-4">
    <div
      className={`bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full ${
        ['order-detail', 'store-orders', 'edit-order'].includes(type) ? 'max-w-2xl' : 'max-w-md'
      } shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[90vh] flex flex-col`}
    >
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg text-slate-800 font-black tracking-tight uppercase italic flex items-center">
           <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
          {title}
        </h3>
        <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
        {type === 'order-detail' && data ? (
          <div className="space-y-6">
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">No. Pesanan</p>
                <p className="font-mono font-black text-lg md:text-xl text-slate-900 tracking-tight">{data.id}</p>
              </div>
              <div className="text-left sm:text-right">
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Waktu Pesanan</p>
                 <p className="font-bold text-slate-700">{data.waktuDibuat || '2025-11-01 10:40'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                {[
                  { icon: User, label: 'Pembeli', val: data.username, sub: `${data.namaPenerima} (${data.noTelepon})` },
                  { icon: MapPin, label: 'Alamat', val: `${data.alamat}, ${data.kota}` },
                  { icon: CreditCard, label: 'Pembayaran', val: data.metodePembayaran },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3 group">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                      <p className="font-bold text-slate-800 leading-tight">{item.val}</p>
                      {item.sub && <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
                    <Truck className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Ekspedisi</p>
                    <p className="font-bold text-slate-800">{data.jasaKirim}</p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 mt-1">
                      {data.kurirStatus}
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Catatan</p>
                    <p className="font-bold text-slate-800 italic text-xs">"{data.catatan || '-'}"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <p className="text-[10px] text-slate-400 font-black uppercase mb-3 tracking-widest">Item Pesanan</p>
              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{data.produk}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Variasi: {data.variasi} <span className="mx-1">•</span> Qty: {data.jumlah}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                  <p className="font-black text-red-600 text-base">Rp {data.totalBayar.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : type === 'edit-order' && data ? (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID</p>
              <p className="font-mono font-black text-lg text-slate-800">{data.id}</p>
              <p className="text-xs text-slate-500 mt-1">{data.produk}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Order</label>
                <select defaultValue={data.status} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option value="Proses">Proses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Kurir</label>
                <input type="text" defaultValue={data.kurirStatus} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal Setoran (Rp)</label>
              <input type="number" defaultValue={data.setoran} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sudah Dibayar (Rp)</label>
              <input type="number" defaultValue={data.sudahDibayar} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <div className="pt-4">
              <button onClick={onClose} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition uppercase tracking-widest text-sm flex items-center justify-center">
                <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
              </button>
            </div>
          </div>
        ) : type === 'store-orders' ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500">
              Menampilkan daftar pesanan yang masuk dalam periode laporan.
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm min-w-max">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">ORD-2025-{i}99</td>
                      <td className="px-4 py-3 text-xs text-slate-500">2{i} Nov 2025</td>
                      <td className="px-4 py-3 text-right font-black text-emerald-600">Rp 150.000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : type === 'harga-setoran' ? (
          <div className="space-y-5">
             <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Perubahan ini akan memperbarui <b>HARGA SETORAN</b> untuk semua barang dengan nama yang sama secara global.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih Barang</label>
                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>-- Pilih Barang --</option>
                  {products?.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga Setoran Baru</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                  <input type="number" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-red-500" placeholder="0" />
                </div>
              </div>
            </div>
            <button className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition uppercase tracking-widest text-sm">Simpan Harga</button>
          </div>
        ) : type === 'integrasi-api' ? (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
              <Key className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] text-red-700 leading-relaxed font-bold">
                  Masukkan API Key dari Binderbyte untuk mengaktifkan fitur pelacakan resi otomatis.
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Binderbyte API Key
              </label>
              <input
                type="password"
                placeholder="Masukkan API Key 64 karakter..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-red-500 outline-none font-bold"
              />
              <p className="text-[10px] text-slate-400 font-medium ml-1">
                API Key dapat diperoleh dari dashboard Binderbyte
              </p>
            </div>
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 transition uppercase tracking-widest text-sm">
              Simpan API Key
            </button>
          </div>
        ) : type === 'setting-profil' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 cursor-pointer hover:border-red-500 hover:bg-red-50 transition group">
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-red-600" />
                </div>
                <button className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest">
                  Upload Logo
                </button>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nama Perusahaan / Toko
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama perusahaan..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Alamat Pusat
                </label>
                <textarea
                  placeholder="Masukkan alamat lengkap..."
                  rows="3"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Kota
                  </label>
                  <input
                    type="text"
                    placeholder="Kota"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    placeholder="Provinsi"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="081234567890"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg hover:bg-red-700 transition uppercase tracking-widest text-sm">
              Simpan Perubahan
            </button>
          </div>
        ) : type === 'add-store' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Platform Marketplace
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Shopee', 'TikTok Shop', 'Tokopedia', 'Lazada'].map(
                  (platform) => (
                    <button
                      key={platform}
                      className="p-4 rounded-2xl border-2 border-slate-100 font-bold text-sm text-slate-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      {platform}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Nama Toko
              </label>
              <input
                type="text"
                placeholder="Masukkan Nama Toko..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-red-500 transition"
              />
            </div>
            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition">
              Simpan Toko Baru
            </button>
          </div>
        ) : (
           <div className="text-center py-10">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Settings className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-slate-500 font-bold">Fitur ini sedang dalam pengembangan.</p>
           </div>
        )}
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

const App = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedStore, setSelectedStore] = useState(null);
  const [activeView, setActiveView] = useState('owner');
  const [filterStore, setFilterStore] = useState('All');
  
  // Date Handling
  const _now = new Date();
  const [startDate, setStartDate] = useState(`${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-01`);
  const [endDate, setEndDate] = useState(`${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`);
  const [dateFilterMode, setDateFilterMode] = useState('month');

  // UI States
  const [detailTab, setDetailTab] = useState('pesanan');
  const [showModal, setShowModal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [scanMode, setScanMode] = useState('camera');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedShippingIds, setSelectedShippingIds] = useState([]);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [isCompactMobile, setIsCompactMobile] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', undoData: null, timerId: null });

  // Last Check States
  const [lastBulkCheckToko, setLastBulkCheckToko] = useState(null);
  const [lastBulkCheckPengiriman, setLastBulkCheckPengiriman] = useState(null);

  // Mock Data
  const stores = [
    { id: 1, name: 'Sazime Official Store', platform: 'Shopee', totalOrders: 450, totalSetoran: 12500000, omset: 65000000, status: 'Active' },
    { id: 2, name: 'Sazime Woodwork', platform: 'TikTok Shop', totalOrders: 320, totalSetoran: 8200000, omset: 42000000, status: 'Active' },
    { id: 3, name: 'Sazime Second Store', platform: 'Shopee', totalOrders: 110, totalSetoran: 2100000, omset: 12000000, status: 'Inactive' },
  ];

  const products = [
    { id: 1, name: 'Sangkar Murai No 1', sku: 'SKR-M01', stock: 45, hargaSetoran: 350000 },
    { id: 2, name: 'Sangkar Kotak Jati', sku: 'SKR-K02', stock: 12, hargaSetoran: 210000 },
  ];

  const [orders, setOrders] = useState([
    {
      id: '251101K28MAGVY', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID05015085787B', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 1 - (6cm)', jumlah: 1,
      totalBayar: 245000, setoran: 200000, username: 'customer_shopee_01', namaPenerima: 'R******h',
      noTelepon: '******70', alamat: 'Jalan Pendidikan Gang Jawa', kota: 'KAB. SAMBAS',
      metodePembayaran: 'COD', waktuDibuat: '2025-12-03 23:59', sudahDibayar: 150000,
      catatan: 'Packing kayu ya kak'
    },
    {
      id: '251126R2SVSYNX', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'SPXID05704205283B', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Dalam Perjalanan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 8 Bening', jumlah: 3,
      totalBayar: 180000, setoran: 150000, username: 'grosir_bird_shop', namaPenerima: 'Budi Santoso',
      noTelepon: '08123456789', alamat: 'Jl. Merdeka No 45', kota: 'SURABAYA',
      metodePembayaran: 'Transfer', waktuDibuat: '2025-11-26 10:40', sudahDibayar: 0,
      catatan: 'Warna campur gan'
    },
  ]);

  // Effects & Helpers
  useEffect(() => {
    const onResize = () => setIsCompactMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredOrders = useMemo(() => orders.filter(o => {
    const d = o.waktuDibuat.split(' ')[0];
    return (filterStore === 'All' || o.storeName === filterStore) &&
           (!startDate || d >= startDate) && (!endDate || d <= endDate);
  }), [orders, filterStore, startDate, endDate]);

  const filteredStores = useMemo(() => {
    return filterStore === 'All' ? stores : stores.filter(s => s.name === filterStore);
  }, [filterStore, stores]);

  const totalSetoran = useMemo(() => filteredStores.reduce((acc, s) => acc + s.totalSetoran, 0), [filteredStores]);

  const perStoreSummary = useMemo(() => {
    const map = {};
    stores.forEach((s) => {
      map[s.name] = { totalSetoran: 0, sudahDibayar: 0 };
    });
    orders.forEach((o) => {
      if (!map[o.storeName]) map[o.storeName] = { totalSetoran: 0, sudahDibayar: 0 };
      map[o.storeName].totalSetoran += o.setoran || 0;
      map[o.storeName].sudahDibayar += o.sudahDibayar || 0;
    });
    return map;
  }, [orders, stores]);
  
  const totalSudahDibayar = useMemo(
    () => orders.reduce((acc, curr) => acc + (curr.sudahDibayar || 0), 0),
    [orders]
  );

  const sisaTagihan = totalSetoran - totalSudahDibayar;

  // Actions
  const handleBulkMarkPaid = () => {
    const prevOrders = [...orders];
    setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, sudahDibayar: o.setoran } : o));
    setShowActionDropdown(false);
    
    // Toast with Undo
    if (toast.timerId) clearTimeout(toast.timerId);
    const tid = setTimeout(() => setToast({ show: false, message: '', undoData: null, timerId: null }), 5000);
    setToast({
      show: true,
      message: `${selectedOrderIds.length} pesanan ditandai lunas.`,
      undoData: prevOrders,
      timerId: tid
    });
    setSelectedOrderIds([]);
  };

  const undoAction = () => {
    if (toast.undoData) setOrders(toast.undoData);
    setToast({ show: false, message: '', undoData: null, timerId: null });
  };

  const handleBulkCheckToko = () => {
    setLastBulkCheckToko(new Date());
    setShowActionDropdown(false);
  };

  const handleBulkCheckPengiriman = () => {
     setLastBulkCheckPengiriman(new Date());
  }

  const handlePrintResi = () => {
    setShowActionDropdown(false);
    window.print();
  };

  const formatLastCheckTime = (date) => {
    if (!date) return null;
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    return '1+ jam yang lalu';
  };

  // --- CONTENT PAGES ---

  const Dashboard = () => {
    // GENERATE DYNAMIC CHART DATA
    const chartData = useMemo(() => {
      let data = [];
      if (dateFilterMode === 'day') {
        // Data per jam (00:00 - 23:00)
        for (let i = 0; i < 24; i++) {
          data.push({
            name: `${String(i).padStart(2, '0')}:00`,
            v: Math.floor(Math.random() * 500000), // Random data
          });
        }
      } else if (dateFilterMode === 'month') {
         // Data per tanggal (1 - 30)
         const daysInMonth = 30; // Simplifikasi
         for (let i = 1; i <= daysInMonth; i++) {
           data.push({
             name: `${i}`,
             v: Math.floor(Math.random() * 2000000),
           });
         }
      } else {
        // Data per bulan (Jan - Des)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        data = months.map(m => ({
          name: m,
          v: Math.floor(Math.random() * 10000000),
        }));
      }
      return data;
    }, [dateFilterMode, startDate]);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <FilterBar
          filterStore={filterStore} setFilterStore={setFilterStore}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
          stores={stores}
        />
        
        {/* Compact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4">
          {[
             { label: 'Total Setoran', val: `Rp ${(totalSetoran/1000000).toFixed(1)}jt`, fullVal: `Rp ${totalSetoran.toLocaleString()}`, icon: Wallet, color: 'text-slate-900', bg: 'bg-white' },
             { label: 'Total Pesanan', val: filteredOrders.length, fullVal: filteredOrders.length, icon: Package, color: 'text-slate-900', bg: 'bg-white' },
             { label: 'Toko Aktif', val: stores.length, fullVal: stores.length, icon: Store, color: 'text-red-600', bg: 'bg-white' },
             { label: 'Avg Keranjang', val: '145rb', fullVal: 'Rp 145.000', icon: ShoppingBag, color: 'text-slate-900', bg: 'bg-white' }
          ].map((stat, idx) => (
            <div key={idx} className={`${stat.bg} p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg ${stat.color === 'text-red-600' ? 'bg-red-50' : 'bg-slate-50'} group-hover:scale-110 transition-transform`}>
                     <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                     Filtered
                  </span>
               </div>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-0.5">{stat.label}</p>
               <h3 className={`text-xl font-black ${stat.color} tracking-tight`} title={stat.fullVal}>{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight italic flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
            Grafik Pertumbuhan ({dateFilterMode === 'day' ? 'Per Jam' : dateFilterMode === 'month' ? 'Harian' : 'Bulanan'})
          </h3>
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip contentStyle={{borderRadius:'12px', border:'none', boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}} cursor={{stroke:'#dc2626', strokeWidth:1}} />
                <Area type="monotone" dataKey="v" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const TokoList = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
       <div className="flex justify-between items-center">
         <h3 className="text-xl font-black text-slate-900 italic uppercase">Daftar Toko</h3>
         <button onClick={() => setShowModal('add-store')} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-red-700 transition flex items-center">
           <Plus className="w-4 h-4 mr-2" /> Baru
         </button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((t) => (
            <div key={t.id} onClick={() => { setSelectedStore(t); setActiveMenu('toko-detail'); }} className="bg-white group cursor-pointer rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
               <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase text-white ${t.platform === 'Shopee' ? 'bg-orange-500' : 'bg-black'}`}>
                 {t.platform}
               </div>
               <div className="flex items-center space-x-4 mb-6 mt-2">
                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <Store className="w-7 h-7 text-slate-400 group-hover:text-red-600 transition-colors" />
                 </div>
                 <div>
                   <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-red-600 transition-colors">{t.name}</h4>
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1 inline-block">{t.status}</span>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Orders</p>
                    <p className="text-lg font-black text-slate-800">{t.totalOrders}</p>
                 </div>
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Setoran</p>
                    <p className="text-lg font-black text-red-600 truncate">{(t.totalSetoran/1000000).toFixed(1)} jt</p>
                 </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const TokoDetail = () => {
    // Memastikan hanya pesanan dari toko yang dipilih yang ditampilkan
    const storeOrders = filteredOrders.filter(o => o.storeName === selectedStore?.name);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
        <button onClick={() => setActiveMenu('toko')} className="flex items-center text-slate-500 hover:text-red-600 font-bold text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                <ShoppingBag className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedStore?.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedStore?.platform}</p>
                  {detailTab === 'pesanan' && (
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      {lastBulkCheckToko ? `Terakhir cek: ${formatLastCheckTime(lastBulkCheckToko)}` : 'Belum pernah dicek resi'}
                    </p>
                  )}
              </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => setShowModal('import')} className="flex-1 md:flex-none items-center justify-center px-4 py-3 bg-slate-50 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-100 border border-slate-200 transition">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Import
              </button>
              <button onClick={() => setShowModal('harga-setoran')} className="flex-1 md:flex-none items-center justify-center px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 shadow-lg transition">
                <Edit3 className="w-4 h-4 mr-2 text-red-400" /> Harga Setoran
              </button>
          </div>
        </div>

        {/* Menambahkan FilterBar khusus untuk TokoDetail (tanpa pemilihan toko) */}
        <FilterBar
          showStore={false}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                {['pesanan', 'barang'].map(tab => (
                  <button key={tab} onClick={() => setDetailTab(tab)} className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${detailTab === tab ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              {detailTab === 'pesanan' && (
                <div className="relative">
                  <button
                    disabled={selectedOrderIds.length === 0}
                    onClick={() => setShowActionDropdown(!showActionDropdown)}
                    className={`flex items-center px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm ${selectedOrderIds.length > 0 ? 'bg-red-600 text-white shadow-red-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Aksi Masal ({selectedOrderIds.length}) <ChevronDown className="w-3 h-3 ml-2" />
                  </button>
                  {showActionDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-20 w-48 py-1 overflow-hidden">
                        <button onClick={handleBulkMarkPaid} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Lunas</button>
                        <button onClick={handleBulkCheckToko} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center border-t border-slate-50"><RefreshCw className="w-4 h-4 mr-2" /> Cek Resi</button>
                        <button onClick={handlePrintResi} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 hover:bg-red-50 hover:text-red-600 flex items-center border-t border-slate-50"><Printer className="w-4 h-4 mr-2" /> Cetak Resi</button>
                      </div>
                    </>
                  )}
                </div>
              )}
          </div>

          {detailTab === 'pesanan' ? (
            <div className="overflow-x-auto w-full table-scroll pb-2">
              <table className="w-full text-left whitespace-nowrap min-w-max">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                  <tr>
                      <th className="p-4 w-10 text-center">
                        <button onClick={() => setSelectedOrderIds(selectedOrderIds.length === storeOrders.length ? [] : storeOrders.map(o => o.id))}>
                          {selectedOrderIds.length === storeOrders.length && storeOrders.length > 0 ? <CheckSquare className="w-4 h-4 text-red-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">No. Pesanan</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">Nama Produk</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">Status Kurir</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">Setoran</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4">Sudah Dibayar</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-900">
                  {storeOrders.map(order => (
                    <tr key={order.id} className={`hover:bg-slate-50 transition-colors ${selectedOrderIds.includes(order.id) ? 'bg-red-50/30' : ''}`}>
                        <td className="p-4 text-center">
                          <button onClick={() => setSelectedOrderIds(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id])}>
                            {selectedOrderIds.includes(order.id) ? <CheckSquare className="w-4 h-4 text-red-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 font-mono text-xs">{order.id}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex flex-col max-w-[200px]">
                            <span className="truncate" title={order.produk}>{order.produk}</span>
                            <span className="text-[10px] text-slate-500 italic">{order.variasi}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex flex-col items-start">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${order.kurirStatus.includes('Tiba') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{order.kurirStatus}</span>
                              <span className="text-[10px] font-mono mt-1 text-slate-400">{order.resi}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-emerald-600">Rp {order.setoran.toLocaleString()}</td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-emerald-600">
                          {order.sudahDibayar > 0 ? (
                            <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Rp {order.sudahDibayar.toLocaleString()}</span>
                          ) : (
                            <span className="text-amber-500 text-[10px] uppercase font-bold">Belum Setor</span>
                          )}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => { setSelectedOrder(order); setShowModal('order-detail'); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Lihat Detail"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedOrder(order); setShowModal('edit-order'); }} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Edit Pesanan"><Edit3 className="w-4 h-4" /></button>
                          </div>
                        </td>
                    </tr>
                  ))}
                  {storeOrders.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-slate-400 italic text-xs">Tidak ada data pesanan pada periode ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full overflow-x-auto table-scroll pb-2">
              <table className="w-full text-left whitespace-nowrap min-w-max">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                  <tr>
                    <th className="px-3 py-3 sm:px-6 sm:py-4">Nama Barang</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4">SKU</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4">Stok</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 text-right">Harga Setoran</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm text-slate-900">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold">{p.name}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 font-mono text-xs">{p.sku}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{p.stock}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-right font-black text-red-600">Rp {p.hargaSetoran.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CekResi = () => (
    <div className="max-w-xl mx-auto py-8 animate-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Validasi Resi</h2>
        <p className="text-slate-500 text-sm font-medium mt-2">Scan barcode paket untuk update status otomatis.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
         <div className="flex p-2 bg-slate-50 m-2 rounded-2xl">
            {['camera', 'manual'].map(mode => (
              <button key={mode} onClick={() => setScanMode(mode)} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scanMode === mode ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                 <div className="flex items-center justify-center gap-2">
                    {mode === 'camera' ? <QrCode className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />} {mode}
                 </div>
              </button>
            ))}
         </div>

         <div className="p-4">
            {scanMode === 'camera' ? (
               <div onClick={() => setIsCameraOpen(!isCameraOpen)} className="aspect-[3/4] bg-slate-900 rounded-[2rem] overflow-hidden relative cursor-pointer group">
                  {!isCameraOpen ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur mb-4 group-hover:scale-110 transition-transform">
                           <Camera className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-xs tracking-widest uppercase opacity-60">Ketuk untuk Kamera</p>
                     </div>
                  ) : (
                     <>
                        <div className="absolute inset-0 bg-slate-800 animate-pulse opacity-20"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] animate-scan"></div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur rounded-full text-white text-xs font-bold border border-white/10">Scanning...</div>
                     </>
                  )}
               </div>
            ) : (
               <div className="py-12 px-6 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Resi</label>
                     <input type="text" placeholder="SPX..." className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-mono font-bold text-center uppercase outline-none focus:border-red-500 focus:bg-white transition-colors" />
                  </div>
                  <button className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition active:scale-95">
                     Cek Sekarang
                  </button>
               </div>
            )}
         </div>
      </div>
      <style>{`@keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } } .animate-scan { animation: scan 2s linear infinite; }`}</style>
    </div>
  );

  const StatusPengiriman = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Status Pengiriman</h3>
            <p className="text-xs text-slate-500 font-medium">Pantau pergerakan paket secara real-time.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari Resi / Order ID..." className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          {selectedShippingIds.length > 0 && (
            <button onClick={handleBulkCheckPengiriman} className="flex items-center px-4 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl animate-in fade-in zoom-in shadow-lg shadow-red-200 hover:bg-red-700 transition">
              <RefreshCw className="w-3 h-3 mr-2" /> Cek Resi Masal ({selectedShippingIds.length})
            </button>
          )}
          <span className="text-[10px] text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
            {lastBulkCheckPengiriman ? `Terakhir cek: ${formatLastCheckTime(lastBulkCheckPengiriman)}` : 'Belum pernah dicek'}
          </span>
        </div>
      </div>

      <FilterBar
        filterStore={filterStore} setFilterStore={setFilterStore}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
        stores={stores}
      />

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden border-slate-200">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap min-w-max">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="px-4 py-4 w-10 text-center">
                  <button onClick={() => setSelectedShippingIds(selectedShippingIds.length === filteredOrders.length ? [] : filteredOrders.map(o => o.id))}>
                    {selectedShippingIds.length > 0 && selectedShippingIds.length === filteredOrders.length ? <CheckSquare className="w-4 h-4 text-red-600" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-4">No. Pesanan</th>
                <th className="px-4 py-4">Waktu</th>
                <th className="px-4 py-4">Barang</th>
                <th className="px-4 py-4">Jasa Kirim</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-slate-900 font-bold">
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`hover:bg-slate-50 transition ${selectedShippingIds.includes(order.id) ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => setSelectedShippingIds(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id])}>
                      {selectedShippingIds.includes(order.id) ? <CheckSquare className="w-4 h-4 text-red-600" /> : <Square className="w-4 h-4 text-slate-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{order.waktuDibuat}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="truncate" title={order.produk}>{order.produk}</span>
                      <span className="text-[10px] text-slate-400 italic">{order.variasi}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div className="flex items-center"><Truck className="w-3 h-3 mr-1 text-slate-400" /> {order.jasaKirim}</div>
                    <span className="text-[10px] font-mono text-slate-400 ml-4 block">{order.resi}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] uppercase px-2 py-1 rounded-md border ${order.kurirStatus.includes('Tiba') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{order.kurirStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => { setSelectedOrder(order); setShowModal('order-detail'); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"><FileText className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RekapSetoran = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-0">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Rekap Setoran</h3>
            <p className="text-xs text-slate-500 font-medium">Pantau dana wajib setor dari semua toko.</p>
          </div>
        </div>
        <div className="w-full mt-4 md:mt-0 md:w-auto flex-1 md:ml-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Setoran</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {totalSetoran.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sudah Dibayar</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-2">Rp {totalSudahDibayar.toLocaleString()}</h3>
            </div>
            <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sisa Tagihan</p>
              <h3 className="text-2xl font-black text-amber-500 mt-2">Rp {sisaTagihan.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        filterStore={filterStore} setFilterStore={setFilterStore}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
        stores={stores}
      />

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden border-slate-200">
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap min-w-max">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Nama Toko</th>
                  <th className="px-6 py-4">Marketplace</th>
                  <th className="px-6 py-4">Total Setoran</th>
                  <th className="px-6 py-4">Setoran Belum Dibayar</th>
                  <th className="px-6 py-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-900 font-bold">
                {filteredStores.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition cursor-pointer">
                    <td className="px-6 py-4 font-black uppercase tracking-tight">{t.name}</td>
                    <td className="px-6 py-4 uppercase font-black tracking-tighter">{t.platform}</td>
                    <td className="px-6 py-4 font-black text-emerald-600 tracking-tight">Rp {(perStoreSummary[t.name]?.totalSetoran ?? t.totalSetoran).toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-amber-500 tracking-tight">Rp {(((perStoreSummary[t.name]?.totalSetoran ?? t.totalSetoran) - (perStoreSummary[t.name]?.sudahDibayar ?? 0)) || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setSelectedStore(t); setShowModal('store-orders'); }} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm hover:bg-red-100 transition">Lihat List</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );

  const Pengaturan = () => (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => setShowModal('integrasi-api')} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex items-start space-x-4 p-6 text-left">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-red-50 group-hover:text-red-600 transition shadow-sm shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-slate-800 tracking-tight uppercase italic group-hover:text-red-600 transition">Integrasi API Resi</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Hubungkan layanan pelacakan Binderbyte</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 self-center group-hover:text-red-600 group-hover:translate-x-1 transition shrink-0" />
        </button>

        <button onClick={() => setShowModal('setting-profil')} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex items-start space-x-4 p-6 text-left">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-red-50 group-hover:text-red-600 transition shadow-sm shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-slate-800 tracking-tight uppercase italic group-hover:text-red-600 transition">Setting Profil</h4>
            <p className="text-xs text-slate-500 mt-1 font-medium">Ubah logo, nama, dan alamat pusat.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 self-center group-hover:text-red-600 group-hover:translate-x-1 transition shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-red-100">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .pb-safe-area { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
      
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col relative w-full">
        <TopBar activeMenu={activeMenu} activeView={activeView} setActiveView={setActiveView} />
        
        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {activeMenu === 'dashboard' && <Dashboard />}
          {activeMenu === 'toko' && <TokoList />}
          {activeMenu === 'toko-detail' && <TokoDetail />}
          {activeMenu === 'cek-resi' && <CekResi />}
          {activeMenu === 'status-pengiriman' && <StatusPengiriman />}
          {activeMenu === 'rekap-setoran' && <RekapSetoran />}
          {activeMenu === 'pengaturan' && <Pengaturan />}
        </main>
      </div>

      <BottomNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
           <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-slate-700">
              <span className="font-bold text-sm">{toast.message}</span>
              {toast.undoData && (
                <button onClick={undoAction} className="text-xs font-black text-red-400 hover:text-red-300 uppercase tracking-wider underline decoration-2 underline-offset-2">Undo</button>
              )}
              <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
           </div>
        </div>
      )}

      {showModal && (
        <Modal
          title={showModal.replace('-', ' ')}
          type={showModal}
          data={selectedOrder}
          products={products}
          onClose={() => { setShowModal(null); setSelectedOrder(null); }}
        />
      )}
    </div>
  );
};

export default App;