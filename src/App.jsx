import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  LayoutDashboard, Store, ScanLine, Settings, LogOut, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Search, Filter, Plus,
  Download, ArrowLeft, Package, ShoppingBag, ExternalLink, ChevronDown,
  Wallet, FileSpreadsheet, Edit3, X, Eye, Calendar, Share2, RefreshCw,
  Camera, Zap, Key, User, Truck, MapPin, CreditCard, Clock, FileText,
  CheckSquare, Square, QrCode, Keyboard, Phone, Printer, Menu, Save,
  Database, Receipt, BarChart3, ChevronLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';

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

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuGroups = [
    {
      title: 'Menu Utama',
      items: [{ id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }]
    },
    {
      title: 'Kasir & Toko Fisik',
      items: [

        { id: 'pos', icon: Receipt, label: 'POS (Kasir)' },
        { id: 'database-produk-offline', icon: Database, label: 'Produk Offline' },
        { id: 'pengeluaran', icon: TrendingDown, label: 'Pengeluaran' }
      ]
    },
    {
      title: 'Toko Online',
      items: [

        { id: 'toko', icon: Store, label: 'Toko & Pesanan' },
        { id: 'database-produk', icon: Package, label: 'Database Online' },
        { id: 'status-pengiriman', icon: Truck, label: 'Status Pengiriman' },
        { id: 'cek-resi', icon: ScanLine, label: 'Cek Resi' }
      ]
    },
    {
      title: 'Keuangan',
      items: [
        { id: 'rekap-cashflow', icon: BarChart3, label: 'Rekap Cashflow' },
        { id: 'rekap-setoran', icon: Wallet, label: 'Rekap Setoran' }
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { id: 'tambah-user', icon: User, label: 'Tambah User' },
        { id: 'pengaturan', icon: Settings, label: 'Pengaturan' }
      ]
    }
  ];

  return (
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

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{group.title}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group ${activeMenu === item.id || (activeMenu === 'toko-detail' && item.id === 'toko')
                  ? `${THEME.primary} text-white shadow-lg shadow-red-900/20`
                  : 'hover:bg-white/10 text-slate-400 hover:text-white'
                  }`}
              >
                <item.icon className={`w-4 h-4 mr-3 transition-transform ${activeMenu === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold text-xs tracking-wide">{item.label}</span>
              </button>
            ))}
          </div>
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
};

const BottomNavbar = ({ activeMenu, setActiveMenu }) => (
  <nav className={`lg:hidden fixed bottom-0 left-0 right-0 ${THEME.bottomNav} text-white flex justify-around p-2 z-[60] pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.15)] overflow-x-auto`}>
    {[
      { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
      { id: 'pos', icon: Receipt, label: 'POS' }, // NEW
      { id: 'database-produk-offline', icon: Database, label: 'Prd. Off' }, // NEW
      { id: 'toko', icon: Store, label: 'Toko' },
      { id: 'database-produk', icon: Package, label: 'Prd. On' },
      // { id: 'status-pengiriman', icon: Truck, label: 'Kirim' },
      { id: 'rekap-setoran', icon: Wallet, label: 'Setor' },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => setActiveMenu(item.id)}
        className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 min-w-[20%] relative ${activeMenu === item.id || (activeMenu === 'toko-detail' && item.id === 'toko')
          ? 'opacity-100'
          : 'opacity-60 hover:opacity-100'
          }`}
      >
        <div className={`transition-all duration-300 ${activeMenu === item.id ? '-translate-y-1' : ''}`}>
          <item.icon className={`w-6 h-6 ${activeMenu === item.id ? 'scale-110 drop-shadow-md' : ''}`} />
        </div>
        <span className={`text-[9px] font-bold mt-1 uppercase tracking-tight truncate max-w-full transition-all ${activeMenu === item.id ? 'opacity-100 font-black' : 'opacity-0 h-0 overflow-hidden'}`}>
          {item.label}
        </span>
        {activeMenu === item.id && (
          <span className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></span>
        )}
      </button>
    ))}
  </nav>
);

const TopBar = ({ activeMenu, activeView, setActiveView, totalBalance }) => (
  <header className={`h-16 md:h-20 ${THEME.headerMobile} md:bg-white md:backdrop-blur-md md:border-b md:border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
    {/* Mobile Left */}
    <div className="flex items-center md:hidden">
      <div className="w-8 h-8 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center mr-3">
        <span className="font-black text-white text-lg">S</span>
      </div>
      <h2 className="font-black text-white tracking-tight text-lg uppercase truncate max-w-[200px]">
        {activeMenu === 'dashboard' ? 'DASHBOARD' : activeMenu.replace(/-/g, ' ')}
      </h2>
    </div>

    {/* Desktop Left */}
    <div className="hidden md:flex items-center">
      <h1 className="font-black text-slate-800 text-3xl italic tracking-tighter uppercase">DASHBOARD</h1>
    </div>

    {/* Right Section */}
    <div className="flex items-center space-x-4 md:space-x-6">
      <div className="flex flex-col items-end mr-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Saldo Keuangan</span>
        <h2 className="font-black text-slate-900 tracking-tight text-xl">
          Rp {(totalBalance || 0).toLocaleString()}
        </h2>
      </div>

      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg shadow-red-200 ring-2 ring-white">
        S
      </div>
    </div>
  </header>
);

const OfflineProductView = ({ products, onAddProduct, onEditProduct }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', stock: 0, unit: 'pcs', price: 0 });
  const [editProduct, setEditProduct] = useState(null);

  const handleSave = () => {
    onAddProduct({ ...newProduct, id: Date.now() });
    setShowAddModal(false);
    setNewProduct({ name: '', sku: '', stock: 0, unit: 'pcs', price: 0 });
  };

  const handleEditClick = (product) => {
    setEditProduct({ ...product });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    onEditProduct(editProduct);
    setShowEditModal(false);
    setEditProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 bg-red-50 rounded-lg">
            <Database className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-sm">Database Produk Offline</h3>
            <p className="text-[10px] text-slate-500 font-bold">Kelola stok produk toko fisik</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> <span className="hidden md:inline">Tambah Produk</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Nama Produk</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4 text-center">Stok</th>
                <th className="px-6 py-4 text-right">Harga Satuan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-bold italic text-xs">
                    Belum ada data produk offline
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{p.name}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{p.sku}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-black">{p.stock} {p.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-700">Rp {Number(p.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-slate-400 hover:text-red-600 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg text-slate-800 font-black tracking-tight uppercase italic flex items-center">
                <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                Tambah Produk
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Contoh: Pakan Burung Premium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Kode</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="SKU-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="pcs">Pcs</option>
                    <option value="pack">Pack</option>
                    <option value="dus">Dus</option>
                    <option value="box">Box</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={!newProduct.name || !newProduct.price}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg text-slate-800 font-black tracking-tight uppercase italic flex items-center">
                <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
                Edit Produk
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Produk</label>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Contoh: Pakan Burung Premium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Kode</label>
                  <input
                    type="text"
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="SKU-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                  <select
                    value={editProduct.unit}
                    onChange={(e) => setEditProduct({ ...editProduct, unit: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="pcs">Pcs</option>
                    <option value="pack">Pack</option>
                    <option value="dus">Dus</option>
                    <option value="box">Box</option>
                    <option value="kg">Kg</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok</label>
                  <input
                    type="number"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <button
                onClick={handleEditSave}
                disabled={!editProduct.name || !editProduct.price}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                Update Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateOrderView = ({ offlineProducts, onAddOrder, onBack }) => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState(() => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = today.toTimeString().split(' ')[0].replace(/:/g, '');
    return {
      billNumber: `INV-${dateStr}-${timeStr}`,
      customerName: '',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Cash',
      discount: 0,
      splitCash: 0,
      splitTransfer: 0,
      paid: 0
    };
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setSearchTerm('');
    setIsSearching(false);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal - formData.discount;

  const effectivePaid = formData.paymentMethod === 'Split (Cash + Transfer)'
    ? (formData.splitCash || 0) + (formData.splitTransfer || 0)
    : formData.paid;

  const remaining = total - effectivePaid;

  const handleSave = () => {
    const finalPaid = formData.paymentMethod === 'Split (Cash + Transfer)'
      ? (formData.splitCash || 0) + (formData.splitTransfer || 0)
      : formData.paid;

    const finalRemaining = total - finalPaid;

    onAddOrder({
      id: formData.billNumber,
      ...formData,
      paid: finalPaid,
      items: cart,
      total,
      remaining: finalRemaining,
      status: finalRemaining <= 0 ? 'Lunas' : 'Belum Lunas'
    });
    onBack();
  };

  const filteredProducts = offlineProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Form Nota Pelanggan</h3>
            <p className="text-xs text-slate-500 font-medium">Buat transaksi baru</p>
          </div>
        </div>
      </div>

      {/* Body - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Nota Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-50 rounded-lg">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Informasi Nota</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Tagihan</label>
                <input
                  type="text"
                  value={formData.billNumber}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-mono font-bold border border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hari Tanggal</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Pelanggan</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-xl text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Nama Customer"
              />
            </div>
          </div>

          {/* Input Barang Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-50 rounded-lg">
                <Package className="w-4 h-4 text-red-600" />
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Input Barang</h4>
            </div>

            {/* Search Product */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cari Produk</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setIsSearching(true); }}
                  placeholder="Ketik nama produk atau SKU..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all focus:bg-white"
                />
                {isSearching && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-20 max-h-60 overflow-y-auto">
                    {filteredProducts.map(p => (
                      <button key={p.id} onClick={() => addToCart(p)} className="w-full text-left px-4 py-3 hover:bg-red-50 flex justify-between items-center border-b border-slate-50 last:border-0 group">
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-red-700">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{p.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-red-600 text-xs">Rp {Number(p.price).toLocaleString()}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">Stok: {p.stock}</p>
                        </div>
                      </button>
                    ))}
                    {filteredProducts.length === 0 && <div className="p-4 text-center text-slate-400 text-xs font-bold italic">Produk tidak ditemukan</div>}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 italic font-medium ml-1">Tips: Ketik nama produk untuk menambahkan ke keranjang.</p>
            </div>

            {/* Product Details Grid (Placeholder for detailed input if needed) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">L (M)</label>
                <input type="number" disabled className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 text-slate-400 cursor-not-allowed" placeholder="-" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">P (M)</label>
                <input type="number" disabled className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 text-slate-400 cursor-not-allowed" placeholder="-" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qty</label>
                <input type="number" disabled className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 text-slate-400 cursor-not-allowed" placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga</label>
                <input type="number" disabled className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 text-slate-400 cursor-not-allowed" placeholder="-" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Satuan</label>
                <input type="text" disabled className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold border border-slate-200 text-slate-400 cursor-not-allowed" placeholder="-" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diskon Global (Rp)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-white rounded-xl text-sm font-bold border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>

          {/* Cart Items */}
          {cart.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Daftar Barang ({cart.length})</h4>
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50 hover:border-red-200 transition-colors group">
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.sku} • {item.qty} {item.unit} × Rp {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 h-8">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2.5 h-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-l-lg transition">-</button>
                        <span className="w-8 text-center text-xs font-black text-slate-800">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2.5 h-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-r-lg transition">+</button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="font-black text-slate-800 text-sm">Rp {(item.price * item.qty).toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">Keranjang masih kosong</p>
              <p className="text-xs text-slate-400 mt-1">Cari produk di atas untuk mulai transaksi</p>
            </div>
          )}
        </div>

        {/* Right Column - Summary Panel (Dark) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white sticky top-6 shadow-2xl shadow-slate-900/20">
            {/* Total Tagihan */}
            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tagihan</p>
              <h2 className="text-4xl font-black tracking-tight text-white">Rp {total.toLocaleString()}</h2>
            </div>

            {/* Terbayar */}
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Bayar</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl text-sm font-bold border border-slate-700 focus:ring-2 focus:ring-red-500 outline-none text-white appearance-none"
                >
                  <option>Cash</option>
                  <option>Transfer</option>
                  <option>QRIS</option>
                  <option>Split (Cash + Transfer)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal Bayar</label>
                {formData.paymentMethod === 'Split (Cash + Transfer)' ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs uppercase">Cash</span>
                      <input
                        type="number"
                        value={formData.splitCash}
                        onChange={e => setFormData({ ...formData, splitCash: parseInt(e.target.value) || 0 })}
                        className="w-full pl-16 pr-4 py-3 bg-slate-800 rounded-xl text-lg font-black border border-slate-700 focus:ring-2 focus:ring-red-500 outline-none text-white text-right placeholder-slate-600"
                        placeholder="0"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs uppercase">Transfer</span>
                      <input
                        type="number"
                        value={formData.splitTransfer}
                        onChange={e => setFormData({ ...formData, splitTransfer: parseInt(e.target.value) || 0 })}
                        className="w-full pl-20 pr-4 py-3 bg-slate-800 rounded-xl text-lg font-black border border-slate-700 focus:ring-2 focus:ring-red-500 outline-none text-white text-right placeholder-slate-600"
                        placeholder="0"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="number"
                    value={formData.paid}
                    onChange={e => setFormData({ ...formData, paid: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl text-2xl font-black border border-slate-700 focus:ring-2 focus:ring-red-500 outline-none text-white text-right placeholder-slate-600"
                    placeholder="0"
                  />
                )}
              </div>
            </div>

            {/* Sisa Tagihan */}
            <div className="pt-6 border-t border-slate-700 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Kembalian / Sisa</span>
                <span className={`text-xl font-black ${remaining <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Rp {Math.abs(remaining).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Status</span>
                <span className={`text-xs font-black uppercase px-2 py-1 rounded ${remaining <= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {remaining <= 0 ? 'Lunas' : 'Belum Lunas'}
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={cart.length === 0 || !formData.customerName}
              className="w-full py-5 bg-red-600 text-white rounded-xl font-black shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:shadow-[0_20px_25px_-12px_rgba(220,38,38,0.6)] hover:-translate-y-1 transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Simpan Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const POSView = ({ offlineProducts, onAddOrder, orders, onCreateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg"><Receipt className="w-5 h-5 text-red-600" /></div>
          <div>
            <h3 className="font-black text-slate-800 text-sm">Point of Sales (POS)</h3>
            <p className="text-[10px] text-slate-500 font-bold">Kasir toko offline</p>
          </div>
        </div>
        <button onClick={onCreateOrder} className="bg-red-600 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Buat Nota
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
              <tr>
                <th className="px-6 py-4">No.
                  Nota</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4 text-center">Item</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-400 font-bold italic text-xs">Belum ada transaksi</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{order.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.customerName}</td>
                    <td className="px-6 py-4 text-center"><span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black">{order.items.length} Item</span></td>
                    <td className="px-6 py-4 text-right font-black text-red-600">Rp {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${order.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-center"><button className="text-slate-400 hover:text-red-600"><FileText className="w-4 h-4" /></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpenseView = ({ expenses, onAddExpense }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: 'Operasional',
    description: '',
    paymentMethod: 'Cash',
    amount: 0,
    paid: 0
  });

  const remaining = formData.amount - formData.paid;

  const handleSave = () => {
    onAddExpense({
      id: `EXP-${Date.now()}`,
      ...formData,
      remaining
    });
    setShowModal(false);
    setFormData({ date: new Date().toISOString().slice(0, 10), category: 'Operasional', description: '', paymentMethod: 'Cash', amount: 0, paid: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg"><TrendingDown className="w-5 h-5 text-red-600" /></div>
          <div>
            <h3 className="font-black text-slate-800 text-sm">Pengeluaran</h3>
            <p className="text-[10px] text-slate-500 font-bold">Catat semua pengeluaran toko</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Pengeluaran
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Nominal Tagihan</th>
                <th className="px-6 py-4 text-right">Dibayar</th>
                <th className="px-6 py-4 text-right">Sisa Tagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-bold italic text-xs">Belum ada data pengeluaran</td></tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{exp.date}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${exp.category === 'Operasional' ? 'bg-blue-100 text-blue-700' : exp.category === 'Luar Biasa' ? 'bg-purple-100 text-purple-700' : exp.category === 'Saving' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{exp.category}</span></td>
                    <td className="px-6 py-4 font-bold text-slate-800">{exp.description}</td>
                    <td className="px-6 py-4 text-right font-black text-slate-700">Rp {(exp.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">Rp {(exp.paid || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-black text-amber-500">Rp {(exp.remaining || 0).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg text-slate-800 font-black tracking-tight uppercase italic flex items-center">
                <span className="w-1 h-6 bg-red-600 mr-3 rounded-full"></span> Tambah Pengeluaran
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>Operasional Pokok</option>
                  <option>Operasional Luar Biasa</option>
                  <option>Gaji Karyawan</option>
                  <option>Gaji Direksi</option>
                  <option>Pengembangan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keterangan</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" rows="2" placeholder="Contoh: Bayar Listrik"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagihan (Rp)</label><input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dibayar (Rp)</label><input type="number" value={formData.paid} onChange={e => setFormData({ ...formData, paid: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" /></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Bayar</label>
                <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500">
                  <option>Cash</option>
                  <option>Transfer</option>
                </select>
              </div>
              <button onClick={handleSave} disabled={!formData.description || !formData.amount} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                Simpan Pengeluaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CashflowRecapView = ({
  orders, offlineOrders, expenses,
  stores, allStores, perStoreSummary,
  setSelectedStore, setShowModal,
  totalSetoran, totalSudahDibayar, sisaTagihan,
  filterStore, setFilterStore,
  startDate, setStartDate,
  endDate, setEndDate,
  dateFilterMode, setDateFilterMode
}) => {
  const [activeTab, setActiveTab] = useState('online'); // online, offline, expenses

  const handleExportExcel = () => {
    let data = [];
    let fileName = '';

    if (activeTab === 'online') {
      fileName = 'Rekap_Penjualan_Online';
      data = stores.map(t => ({
        'Nama Toko': t.name,
        'Marketplace': t.platform,
        'Total Setoran': (perStoreSummary[t.name]?.totalSetoran ?? t.totalSetoran) || 0,
        'Sudah Dibayar': perStoreSummary[t.name]?.sudahDibayar || 0,
        'Sisa Tagihan': ((perStoreSummary[t.name]?.totalSetoran ?? t.totalSetoran) - (perStoreSummary[t.name]?.sudahDibayar ?? 0)) || 0
      }));
    } else if (activeTab === 'offline') {
      fileName = 'Rekap_Penjualan_Offline';
      // Group offline orders by ID for detail list or by method for summary? 
      // The view shows summary by method. Let's export summary by method to match the view.
      const grouped = offlineOrders.reduce((acc, curr) => {
        acc[curr.paymentMethod] = acc[curr.paymentMethod] || { total: 0, remaining: 0, count: 0 };
        acc[curr.paymentMethod].total += curr.total;
        acc[curr.paymentMethod].remaining += curr.remaining;
        acc[curr.paymentMethod].count += 1;
        return acc;
      }, {});
      data = Object.entries(grouped).map(([method, stats]) => ({
        'Metode Bayar': method,
        'Total Setoran': stats.total,
        'Setoran Belum Dibayar': stats.remaining,
        'Jumlah Transaksi': stats.count
      }));
    } else if (activeTab === 'expenses') {
      fileName = 'Rekap_Pengeluaran';
      data = expenses.map(e => ({
        'Tanggal': e.date,
        'Kategori': e.category,
        'Keterangan': e.description,
        'Nominal': e.amount,
        'Status': e.remaining > 0 ? 'Belum Lunas' : 'Lunas'
      }));
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const renderOnline = () => (
    <div className="space-y-6">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-tight">Detail Transaksi</h3>
          <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
        </div>
        <div className="overflow-x-auto">
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
              {stores.map((t) => (
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

  const renderOffline = () => {
    // Group Offline Orders by Payment Method (to mimic Rekap Setoran structure)
    const grouped = offlineOrders.reduce((acc, curr) => {
      acc[curr.paymentMethod] = acc[curr.paymentMethod] || { total: 0, remaining: 0, count: 0 };
      acc[curr.paymentMethod].total += curr.total;
      acc[curr.paymentMethod].remaining += curr.remaining;
      acc[curr.paymentMethod].count += 1;
      return acc;
    }, {});

    const offlineTotals = offlineOrders.reduce((acc, curr) => {
      acc.total += curr.total;
      acc.paid += curr.paidAmount;
      acc.remaining += curr.remaining;
      return acc;
    }, { total: 0, paid: 0, remaining: 0 });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Penjualan Offline</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {offlineTotals.total.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Diterima</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">Rp {offlineTotals.paid.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum Dibayar</p>
            <h3 className="text-2xl font-black text-amber-500 mt-2">Rp {offlineTotals.remaining.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Data Penjualan Offline (POS)</h3>
            <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md">
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Nama Toko</th>
                  <th className="px-6 py-4">Metode Bayar</th>
                  <th className="px-6 py-4">Total Setoran</th>
                  <th className="px-6 py-4">Setoran Belum Dibayar</th>
                  <th className="px-6 py-4 text-center">Jumlah Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(grouped).length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-bold italic text-xs">Belum ada transaksi offline</td></tr>
                ) : (
                  Object.entries(grouped).map(([method, stats], idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-black text-slate-800 uppercase">Toko Fisik (Offline)</td>
                      <td className="px-6 py-4 uppercase font-black tracking-tight">{method}</td>
                      <td className="px-6 py-4 font-black text-emerald-600">Rp {stats.total.toLocaleString()}</td>
                      <td className="px-6 py-4 font-black text-amber-500">Rp {stats.remaining.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-500">{stats.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderExpenses = () => {
    const expenseTotals = expenses.reduce((acc, curr) => {
      acc.total += curr.amount;
      acc.paid += curr.paid;
      acc.remaining += curr.remaining;
      return acc;
    }, { total: 0, paid: 0, remaining: 0 });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pengeluaran</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">Rp {expenseTotals.total.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Terbayar</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">Rp {expenseTotals.paid.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sisa Tagihan (Hutang)</p>
            <h3 className="text-2xl font-black text-red-600 mt-2">Rp {expenseTotals.remaining.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-tight">Data Pengeluaran</h3>
            <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md">
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                <tr><th className="px-6 py-4">Tanggal</th><th className="px-6 py-4">Kategori</th><th className="px-6 py-4">Keterangan</th><th className="px-6 py-4 text-right">Nominal</th><th className="px-6 py-4 text-center">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length === 0 ? <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-400 font-bold italic text-xs">Belum ada data pengeluaran</td></tr> : expenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{e.date}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${e.category === 'Operasional' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{e.category}</span></td>
                    <td className="px-6 py-4 font-bold text-slate-800">{e.description}</td>
                    <td className="px-6 py-4 text-right font-black text-red-600">Rp {e.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center"><span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${e.remaining > 0 ? 'bg-amber-100 text-amber-500' : 'bg-emerald-100 text-emerald-700'}`}>{e.remaining > 0 ? 'Belum Lunas' : 'Lunas'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg"><BarChart3 className="w-5 h-5 text-red-600" /></div>
          <div><h3 className="font-black text-slate-800 text-sm">Rekap Cashflow</h3><p className="text-[10px] text-slate-500 font-bold">Laporan keuangan terpadu</p></div>
        </div>
      </div>

      <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
        {[{ id: 'online', l: 'Penjualan Online' }, { id: 'offline', l: 'Penjualan Offline' }, { id: 'expenses', l: 'Pengeluaran' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-red-600' : 'text-slate-400 hover:text-slate-600'}`}>{tab.l}</button>
        ))}
      </div>

      <FilterBar
        filterStore={filterStore} setFilterStore={setFilterStore}
        startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate}
        dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
        stores={allStores}
      />

      <div className="animate-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'online' && renderOnline()}
        {activeTab === 'offline' && renderOffline()}
        {activeTab === 'expenses' && renderExpenses()}
      </div>
    </div>
  );
};

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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center h-full">
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
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${dateFilterMode === m.k ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-emerald-100' : 'text-slate-500 hover:text-slate-700'
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
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
    <div
      className={`bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full ${['order-detail', 'store-orders', 'edit-order'].includes(type) ? 'max-w-2xl' : 'max-w-md'
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
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${data.platform === 'Shopee' ? 'bg-orange-100 text-orange-700' : 'bg-black text-white'}`}>
                    {data.platform}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${data.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {data.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Waktu Pesanan</p>
                <p className="font-bold text-slate-700">{data.waktuDibuat || '2025-11-01 10:40'}</p>
                {data.waktuPembayaran && (
                  <p className="text-xs text-slate-500 mt-0.5">Dibayar: {data.waktuPembayaran}</p>
                )}
                <p className="text-xs text-slate-500 mt-0.5">Platform: {data.platform}</p>
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
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{data.produk}</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Variasi: {data.variasi}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Harga Satuan</p>
                        <p className="font-bold text-slate-700">Rp {data.hargaAwal?.toLocaleString() || '0'}</p>
                      </div>
                      {data.beratProduk && (
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Berat</p>
                          <p className="font-bold text-slate-700">{data.beratProduk}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Pembayaran</p>
                    <p className="font-black text-red-600 text-base">Rp {data.totalBayar?.toLocaleString() || '0'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Jumlah</p>
                    <p className="font-bold text-slate-800 text-lg">{data.jumlah}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Total Bayar</p>
                    <p className="font-black text-emerald-700 text-lg">Rp {data.totalBayar?.toLocaleString() || '0'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {data.totalDiskon > 0 && (
                      <p className="text-xs text-amber-600 font-medium">Diskon: Rp {data.totalDiskon?.toLocaleString() || '0'}</p>
                    )}
                    {data.perkiraanOngkosKirim > 0 && (
                      <p className="text-xs text-blue-600 font-medium">Ongkir: Rp {data.perkiraanOngkosKirim?.toLocaleString() || '0'}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Total Akhir</p>
                    <p className="font-black text-red-600 text-base">Rp {data.totalBayar?.toLocaleString() || '0'}</p>
                  </div>
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
        ) : type === 'import' ? (
          <div className="space-y-5">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                Upload file Excel (.xlsx atau .xls) untuk mengimport data pesanan. Pastikan format kolom sesuai dengan template.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pilih File Excel</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium ml-1">
                  Format: .xlsx atau .xls, maksimal 10MB
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Template Kolom:</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-medium">
                  <span>• No. Pesanan</span>
                  <span>• Tanggal Pesanan</span>
                  <span>• Nama Produk</span>
                  <span>• Variasi</span>
                  <span>• Jumlah</span>
                  <span>• Harga Total</span>
                  <span>• Nama Penerima</span>
                  <span>• No. Telepon</span>
                  <span>• Alamat</span>
                  <span>• Kota</span>
                  <span>• Metode Pembayaran</span>
                  <span>• Jasa Kirim</span>
                  <span>• No. Resi</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition">
                Batal
              </button>
              <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition uppercase tracking-widest text-sm">
                Import Data
              </button>
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
  const [totalBalance, setTotalBalance] = useState(0);
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

  // Global Product Prices Management
  const [globalProductPrices, setGlobalProductPrices] = useState({});

  // New Features State
  const [offlineProducts, setOfflineProducts] = useState([
    { id: 1, name: 'Pakan Burung Lovebird Premium', sku: 'PBLP-001', stock: 50, unit: 'pcs', price: 25000 },
    { id: 2, name: 'Vitamin Burung Gacor', sku: 'VBG-002', stock: 30, unit: 'btl', price: 45000 },
    { id: 3, name: 'Kandang Besi Kotak', sku: 'KBK-003', stock: 20, unit: 'pcs', price: 150000 },
    { id: 4, name: 'Batu Gosok Paruh', sku: 'BGP-004', stock: 100, unit: 'pcs', price: 15000 },
    { id: 5, name: 'Tangkringan Kayu Jati', sku: 'TKJ-005', stock: 75, unit: 'pcs', price: 25000 },
  ]);
  const [offlineOrders, setOfflineOrders] = useState([
    {
      id: 'OFF-001',
      customerName: 'Budi Santoso',
      date: '2026-01-20',
      paymentMethod: 'Cash',
      subtotal: 75000,
      discount: 5000,
      total: 70000,
      paidAmount: 70000,
      remaining: 0,
      status: 'Lunas',
      items: [{ id: 1, name: 'Pakan Burung Lovebird Premium', price: 25000, qty: 3, total: 75000 }]
    },
    {
      id: 'OFF-002',
      customerName: 'Ani Wijaya',
      date: '2026-01-24',
      paymentMethod: 'Transfer',
      subtotal: 90000,
      discount: 0,
      total: 90000,
      paidAmount: 50000,
      remaining: 40000,
      status: 'Belum Lunas',
      items: [{ id: 2, name: 'Vitamin Burung Gacor', price: 45000, qty: 2, total: 90000 }]
    },
    {
      id: 'OFF-003',
      customerName: 'Toko Sejahtera',
      date: '2026-02-05',
      paymentMethod: 'Cash',
      subtotal: 300000,
      discount: 0,
      total: 300000,
      paidAmount: 300000,
      remaining: 0,
      status: 'Lunas',
      items: [{ id: 3, name: 'Kandang Besi Kotak', price: 150000, qty: 2, total: 300000 }]
    },
    {
      id: 'OFF-004',
      customerName: 'Budi Santoso',
      date: '2026-02-06',
      paymentMethod: 'Transfer',
      subtotal: 75000,
      discount: 0,
      total: 75000,
      paidAmount: 75000,
      remaining: 0,
      status: 'Lunas',
      items: [{ id: 4, name: 'Batu Gosok Paruh', price: 15000, qty: 5, total: 75000 }]
    },
    {
      id: 'OFF-005',
      customerName: 'Ani Wijaya',
      date: '2026-02-07',
      paymentMethod: 'Cash',
      subtotal: 100000,
      discount: 0,
      total: 100000,
      paidAmount: 100000,
      remaining: 0,
      status: 'Lunas',
      items: [{ id: 5, name: 'Tangkringan Kayu Jati', price: 25000, qty: 4, total: 100000 }]
    },
    {
      id: 'OFF-003',
      customerName: 'Toko Sejahtera',
      date: '2026-01-25',
      paymentMethod: 'Cash',
      subtotal: 500000,
      discount: 20000,
      total: 480000,
      paidAmount: 480000,
      remaining: 0,
      status: 'Lunas',
      items: [
        { id: 1, name: 'Pakan Burung Lovebird Premium', price: 25000, qty: 10, total: 250000 },
        { id: 2, name: 'Vitamin Burung Gacor', price: 45000, qty: 5, total: 225000 }
      ]
    },
    {
      id: 'OFF-004',
      customerName: 'Doni Bird',
      date: '2026-01-26',
      paymentMethod: 'Cash',
      subtotal: 1000000,
      discount: 50000,
      total: 950000,
      paidAmount: 950000,
      remaining: 0,
      status: 'Lunas',
      items: [
        { id: 3, name: 'Sangkar Murai No 1 - Sazime Original', price: 350000, qty: 2, total: 700000 },
        { id: 4, name: 'Cangkir Cepuk Pakan Mika', price: 25000, qty: 12, total: 300000 }
      ]
    }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2026-01-21', category: 'Operasional Pokok', description: 'Listrik & Air Januari', amount: 500000, paid: 500000, remaining: 0, paymentMethod: 'Transfer' },
    { id: 2, date: '2026-01-23', category: 'Pengembangan', description: 'Tabungan Pengembangan', amount: 1000000, paid: 1000000, remaining: 0, paymentMethod: 'Cash' },
    { id: 3, date: '2026-01-24', category: 'Gaji Karyawan', description: 'Gaji Staff Admin', amount: 3500000, paid: 3500000, remaining: 0, paymentMethod: 'Transfer' },
    { id: 4, date: '2026-01-25', category: 'Gaji Direksi', description: 'Withdraw Owner', amount: 5000000, paid: 5000000, remaining: 0, paymentMethod: 'Transfer' },
    { id: 5, date: '2026-01-26', category: 'Operasional Luar Biasa', description: 'Perbaikan Atap Toko', amount: 1500000, paid: 1500000, remaining: 0, paymentMethod: 'Cash' },
    { id: 6, date: '2026-02-01', category: 'Belanja Bahan', description: 'Kayu Jati', amount: 2000000, paid: 2000000, remaining: 0, paymentMethod: 'Transfer' },
  ]);

  const handleAddOfflineProduct = (product) => {
    setOfflineProducts(prev => [...prev, product]);
  };

  const handleEditOfflineProduct = (updatedProduct) => {
    setOfflineProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };


  const handleAddOfflineOrder = (order) => {
    setOfflineOrders(prev => [order, ...prev]);
    // Decrease stock
    order.items.forEach(item => {
      setOfflineProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: p.stock - item.qty } : p));
    });
  };

  const handleAddExpense = (expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  // Mock Data
  const stores = [
    { id: 1, name: 'Sazime Official Store', platform: 'Shopee', totalOrders: 450, totalSetoran: 12500000, omset: 65000000, status: 'Active' },
    { id: 2, name: 'Sazime Woodwork', platform: 'TikTok Shop', totalOrders: 320, totalSetoran: 8200000, omset: 42000000, status: 'Active' },
    { id: 3, name: 'Sazime Second Store', platform: 'Shopee', totalOrders: 110, totalSetoran: 2100000, omset: 12000000, status: 'Inactive' },
    { id: 4, name: 'Sazime Bird Paradise', platform: 'Tokopedia', totalOrders: 285, totalSetoran: 6800000, omset: 35000000, status: 'Active' },
    { id: 5, name: 'Sazime Premium Cages', platform: 'Lazada', totalOrders: 195, totalSetoran: 5200000, omset: 28000000, status: 'Active' },
    { id: 6, name: 'Sazime Grosir', platform: 'Shopee', totalOrders: 620, totalSetoran: 18500000, omset: 95000000, status: 'Active' },
    { id: 7, name: 'Sazime Mini Store', platform: 'TikTok Shop', totalOrders: 85, totalSetoran: 1200000, omset: 6500000, status: 'Active' },
    { id: 8, name: 'Sazime Bird Accessories', platform: 'Tokopedia', totalOrders: 175, totalSetoran: 4100000, omset: 22000000, status: 'Active' },
    { id: 9, name: 'Sazime Luxury Woodwork', platform: 'Shopee', totalOrders: 95, totalSetoran: 2800000, omset: 15000000, status: 'Inactive' },
    { id: 10, name: 'Sazime Express Store', platform: 'Lazada', totalOrders: 245, totalSetoran: 7200000, omset: 38000000, status: 'Active' },
  ];

  const products = [
    { id: 1, name: 'Sangkar Murai No 1 - Sazime Original', sku: 'SMNSO', stock: 45, hargaSetoran: 350000 },
    { id: 2, name: 'Sangkar Kotak Jati - Premium', sku: 'SKJP', stock: 12, hargaSetoran: 210000 },
    { id: 3, name: 'Cangkir Cepuk Pakan Mika', sku: 'CCPM', stock: 120, hargaSetoran: 25000 },
    { id: 4, name: 'Sangkar Kenari Deluxe', sku: 'SKD', stock: 28, hargaSetoran: 180000 },
    { id: 5, name: 'Tempat Makan Burung Otomatis', sku: 'TMBO', stock: 85, hargaSetoran: 75000 },
    { id: 6, name: 'Sarang Buatan Lovebird', sku: 'SBL', stock: 65, hargaSetoran: 45000 },
    { id: 7, name: 'Kandang Ayam Hias', sku: 'KAH', stock: 18, hargaSetoran: 280000 },
    { id: 8, name: 'Mainan Burung Kayu', sku: 'MBK', stock: 95, hargaSetoran: 15000 },
    { id: 9, name: 'Sangkar Cages Parrot', sku: 'SCP', stock: 22, hargaSetoran: 420000 },
    { id: 10, name: 'Botol Minum Burung Stainless', sku: 'BMBS', stock: 150, hargaSetoran: 35000 },
    { id: 11, name: 'Lampu Pemanas Kandang', sku: 'LPK', stock: 40, hargaSetoran: 95000 },
    { id: 12, name: 'Batu Gosok Paruh', sku: 'BGP', stock: 200, hargaSetoran: 8000 },
    { id: 13, name: 'Vitamin Burung Cair', sku: 'VBC', stock: 75, hargaSetoran: 55000 },
    { id: 14, name: 'Pakan Burung Premium', sku: 'PBP', stock: 300, hargaSetoran: 120000 },
    { id: 15, name: 'Sangkar Lovebird Elegan', sku: 'SLE', stock: 35, hargaSetoran: 195000 },
  ];

  // Initialize global product prices after products are defined
  useEffect(() => {
    const prices = {};
    products.forEach(product => {
      prices[product.name] = product.hargaSetoran;
    });
    setGlobalProductPrices(prices);
  }, []);

  const [orders, setOrders] = useState([
    {
      id: '251101K28MAGVY', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      orderSubstatus: 'Selesai', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'SPXID05015085787B', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Tiba di Tujuan',
      produk: 'HITAM - METABOLISME KHUSUS BURUNG PEMAKAN SERANGGA SEPERTI MURAI, KACER, CUCAK IJO, CENDET, ANIS, DLL - SAZIME METASUS OBAT METABOLISME OIL',
      variasi: 'Default', jumlah: 1, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'Default',
      hargaAwal: 50000, hargaSetelahDiskon: 50000,
      totalHargaProduk: 50000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '100 gr', jumlahProdukDiPesan: 2, totalBerat: '200 gr',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 14160,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 8000, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 106340, perkiraanOngkosKirim: 8000, setoran: 50000,
      username: 'herypurnomo123', namaPenerima: 'H******o',
      noTelepon: '******75', alamat: 'Jalan Diman, Cluster Payangan Village No. 5D, RT. 004/07, Kp. Payangan, Jatisari, Jatiasih, Kota Bekasi,, KOTA BEKASI, JATIASIH, JAWA BARAT, ID, 17426',
      kota: 'KOTA BEKASI', provinsi: 'JAWA BARAT',
      metodePembayaran: 'Online Payment', waktuDibuat: '2025-11-01 07:15', waktuPembayaran: '2025-11-01 07:14',
      waktuPengirimanDiatur: '2025-11-01 17:48', waktuPesananDikirimSebelum: '2025-11-03 23:59',
      waktuPesananSelesai: '2025-11-03 12:23', sudahDibayar: 50000,
      catatan: '', buyerMessage: '',
      // Field Tokopedia/TikTok
      skuId: '', sellerSku: '', variation: 'Default',
      skuUnitOriginalPrice: 50000, skuSubtotalBeforeDiscount: 50000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 50000,
      shippingFeeAfterDiscount: 8000, originalShippingFee: 16000,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 8000,
      paymentPlatformDiscount: 0, buyerServiceFee: 1700, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '', shippedTime: '', deliveredTime: '',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: '',
      deliveryOption: 'Antar ke Counter', shippingProviderName: 'SPX',
      zipcode: '17426', country: 'Indonesia',
      districts: 'JATIASIH', villages: 'JATISARI', detailAddress: 'Jalan Diman, Cluster Payangan Village No. 5D, RT. 004/07, Kp. Payangan',
      additionalAddress: '', weightKg: 0.1, productCategory: '',
      packageId: '', purchaseChannel: 'Shopee', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    {
      id: '581430173941663545', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      orderSubstatus: 'Selesai', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'JX6451529061', jasaKirim: 'Pengiriman standar', kurirStatus: 'Dalam Perjalanan',
      produk: 'SAZIME GURAH 10 MENIT LANGSUNG PLONG KELUAR SEMUA LENDIRNYA', variasi: 'Default', jumlah: 1, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'Default',
      hargaAwal: 68000, hargaSetelahDiskon: 68000,
      totalHargaProduk: 68000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '0.1 kg', jumlahProdukDiPesan: 1, totalBerat: '0.1 kg',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 0,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 1000, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 70700, perkiraanOngkosKirim: 16000, setoran: 68000,
      username: 'k***dasepsm286', namaPenerima: 'D**** D*****',
      noTelepon: '(+62)819******53', alamat: 'Jl. Sudirman No 123',
      kota: 'BANDUNG', provinsi: 'JAWA BARAT',
      metodePembayaran: 'PayLater', waktuDibuat: '30/11/2025 23:34:31', waktuPembayaran: '30/11/2025 23:34:44',
      waktuPengirimanDiatur: '01/12/2025 07:40:22', waktuPesananDikirimSebelum: '',
      waktuPesananSelesai: '03/12/2025 09:05:42', sudahDibayar: 68000,
      catatan: '', buyerMessage: '',
      // Field Tokopedia/TikTok
      skuId: '1732080356919313617', sellerSku: '', variation: 'Default',
      skuUnitOriginalPrice: 68000, skuSubtotalBeforeDiscount: 68000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 68000,
      shippingFeeAfterDiscount: 1000, originalShippingFee: 16000,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 15000,
      paymentPlatformDiscount: 0, buyerServiceFee: 1700, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '01/12/2025 07:40:22', shippedTime: '01/12/2025 20:46:23', deliveredTime: '03/12/2025 09:05:42',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: 'ID Pickup Warehouse',
      deliveryOption: 'Pengiriman standar', shippingProviderName: 'J&T Express',
      zipcode: '', country: 'Indonesia',
      districts: '*******', villages: '*********', detailAddress: 'Jl. Sudirman No 123',
      additionalAddress: '*********************************************************************************************', weightKg: 0.1, productCategory: 'Layanan Kesehatan Burung',
      packageId: '1177653750403139385', purchaseChannel: 'TikTok', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    // Data Dummy Pesanan Tahun 2026
    {
      id: '260101A4BXZYQW', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      orderSubstatus: 'Selesai', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'SPXID01234567890A', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 2 - (8cm)', jumlah: 1, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'No. 2 - (8cm)',
      hargaAwal: 265000, hargaSetelahDiskon: 265000,
      totalHargaProduk: 265000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '500 gr', jumlahProdukDiPesan: 1, totalBerat: '500 gr',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 0,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 0, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 265000, perkiraanOngkosKirim: 0, setoran: 220000,
      username: 'bird_lover_2026', namaPenerima: 'A*****i',
      noTelepon: '******89', alamat: 'Jl. Sudirman No 123',
      kota: 'JAKARTA SELATAN', provinsi: 'DKI JAKARTA',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-01 08:30', waktuPembayaran: '2026-01-01 08:30',
      waktuPengirimanDiatur: '2026-01-01 09:00', waktuPesananDikirimSebelum: '',
      waktuPesananSelesai: '2026-01-03 14:30', sudahDibayar: 220000,
      catatan: 'Paket untuk ulang tahun', buyerMessage: 'Paket untuk ulang tahun',
      // Field Tokopedia/TikTok
      skuId: '', sellerSku: '', variation: 'No. 2 - (8cm)',
      skuUnitOriginalPrice: 265000, skuSubtotalBeforeDiscount: 265000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 265000,
      shippingFeeAfterDiscount: 0, originalShippingFee: 0,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 0,
      paymentPlatformDiscount: 0, buyerServiceFee: 0, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '2026-01-01 09:00', shippedTime: '2026-01-02 10:00', deliveredTime: '2026-01-03 14:30',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: '',
      deliveryOption: 'Reguler (Cashless)', shippingProviderName: 'SPX',
      zipcode: '', country: 'Indonesia',
      districts: '', villages: '', detailAddress: 'Jl. Sudirman No 123',
      additionalAddress: '', weightKg: 0.5, productCategory: 'Kandang Burung',
      packageId: '', purchaseChannel: 'Shopee', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    {
      id: '260102C7DYXWVU', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Proses',
      orderSubstatus: 'Sedang Diproses', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'SPXID01234567891B', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Medium (40x30x25cm)', jumlah: 2, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'Medium (40x30x25cm)',
      hargaAwal: 210000, hargaSetelahDiskon: 210000,
      totalHargaProduk: 420000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '2 kg', jumlahProdukDiPesan: 2, totalBerat: '4 kg',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 0,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 0, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 420000, perkiraanOngkosKirim: 0, setoran: 380000,
      username: 'cage_collector', namaPenerima: 'Citra Dewi',
      noTelepon: '08134567890', alamat: 'Jl. Malioboro No 56',
      kota: 'YOGYAKARTA', provinsi: 'DAERAH ISTIMEWA YOGYAKARTA',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-02 14:15', waktuPembayaran: '',
      waktuPengirimanDiatur: '', waktuPesananDikirimSebelum: '',
      waktuPesananSelesai: '', sudahDibayar: 0,
      catatan: 'Cat kayu jati asli', buyerMessage: 'Cat kayu jati asli',
      // Field Tokopedia/TikTok
      skuId: '', sellerSku: '', variation: 'Medium (40x30x25cm)',
      skuUnitOriginalPrice: 210000, skuSubtotalBeforeDiscount: 420000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 420000,
      shippingFeeAfterDiscount: 0, originalShippingFee: 0,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 0,
      paymentPlatformDiscount: 0, buyerServiceFee: 0, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '', shippedTime: '', deliveredTime: '',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: '',
      deliveryOption: 'Hemat Kargo', shippingProviderName: 'SPX',
      zipcode: '', country: 'Indonesia',
      districts: '', villages: '', detailAddress: 'Jl. Malioboro No 56',
      additionalAddress: '', weightKg: 4.0, productCategory: 'Kandang Burung',
      packageId: '', purchaseChannel: 'TikTok', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    {
      id: '260103E9FZYTWS', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      orderSubstatus: 'Selesai', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'SPXID01234567892C', jasaKirim: 'Express-SPX Express', kurirStatus: 'Dalam Perjalanan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 3 - (10cm)', jumlah: 1, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'No. 3 - (10cm)',
      hargaAwal: 285000, hargaSetelahDiskon: 285000,
      totalHargaProduk: 285000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '600 gr', jumlahProdukDiPesan: 1, totalBerat: '600 gr',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 0,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 0, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 285000, perkiraanOngkosKirim: 0, setoran: 240000,
      username: 'shopee_customer_001', namaPenerima: 'D*****o',
      noTelepon: '******45', alamat: 'Jl. Gatot Subroto Kav 45',
      kota: 'JAKARTA PUSAT', provinsi: 'DKI JAKARTA',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-03 11:20', waktuPembayaran: '2026-01-03 11:20',
      waktuPengirimanDiatur: '2026-01-03 12:00', waktuPesananDikirimSebelum: '',
      waktuPesananSelesai: '2026-01-05 16:45', sudahDibayar: 240000,
      catatan: 'Kirim sebelum tanggal 5 Januari', buyerMessage: 'Kirim sebelum tanggal 5 Januari',
      // Field Tokopedia/TikTok
      skuId: '', sellerSku: '', variation: 'No. 3 - (10cm)',
      skuUnitOriginalPrice: 285000, skuSubtotalBeforeDiscount: 285000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 285000,
      shippingFeeAfterDiscount: 0, originalShippingFee: 0,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 0,
      paymentPlatformDiscount: 0, buyerServiceFee: 0, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '2026-01-03 12:00', shippedTime: '2026-01-04 08:30', deliveredTime: '2026-01-05 16:45',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: '',
      deliveryOption: 'Express', shippingProviderName: 'SPX',
      zipcode: '', country: 'Indonesia',
      districts: '', villages: '', detailAddress: 'Jl. Gatot Subroto Kav 45',
      additionalAddress: '', weightKg: 0.6, productCategory: 'Kandang Burung',
      packageId: '', purchaseChannel: 'Shopee', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    {
      id: '260104G2HAVURQ', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      orderSubstatus: 'Selesai', cancelationReturnType: '',
      normalOrPreOrder: 'Normal',
      resi: 'SPXID01234567893D', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Tiba di Tujuan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 6 Hitam', jumlah: 5, returnedQuantity: 0,
      skuInduk: '', nomorReferensiSku: '', namaVariasi: 'Segi 6 Hitam',
      hargaAwal: 50000, hargaSetelahDiskon: 50000,
      totalHargaProduk: 250000, totalDiskon: 0, diskonDariPenjual: 0, diskonDariShopee: 0,
      beratProduk: '100 gr', jumlahProdukDiPesan: 5, totalBerat: '500 gr',
      voucherDitanggungPenjual: 0, cashbackKoin: 0, voucherDitanggungShopee: 0,
      paketDiskon: 'N', paketDiskonShopee: 0, paketDiskonPenjual: 0,
      potonganKoinShopee: 0, diskonKartuKredit: 0,
      ongkosKirimDibayarPembeli: 0, estimasiPotonganBiayaPengiriman: 0, ongkosKirimPengembalian: 0,
      totalBayar: 250000, perkiraanOngkosKirim: 0, setoran: 210000,
      username: 'bird_shop_owner', namaPenerima: 'Eko Prasetyo',
      noTelepon: '08234567891', alamat: 'Jl. Ahmad Yani No 78',
      kota: 'SEMARANG', provinsi: 'JAWA TENGAH',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-04 16:45', waktuPembayaran: '',
      waktuPengirimanDiatur: '2026-01-05 08:00', waktuPesananDikirimSebelum: '',
      waktuPesananSelesai: '2026-01-07 11:30', sudahDibayar: 180000,
      catatan: 'Untuk toko burung grosir', buyerMessage: 'Untuk toko burung grosir',
      // Field Tokopedia/TikTok
      skuId: '', sellerSku: '', variation: 'Segi 6 Hitam',
      skuUnitOriginalPrice: 50000, skuSubtotalBeforeDiscount: 250000,
      skuPlatformDiscount: 0, skuSellerDiscount: 0, skuSubtotalAfterDiscount: 250000,
      shippingFeeAfterDiscount: 0, originalShippingFee: 0,
      shippingFeeSellerDiscount: 0, shippingFeePlatformDiscount: 0,
      paymentPlatformDiscount: 0, buyerServiceFee: 0, handlingFee: 0,
      shippingInsurance: 0, itemInsurance: 0,
      orderRefundAmount: 0, rtsTime: '2026-01-05 08:00', shippedTime: '2026-01-06 09:15', deliveredTime: '2026-01-07 11:30',
      cancelledTime: '', cancelBy: '', cancelReason: '',
      fulfillmentType: 'Fulfillment by seller', warehouseName: '',
      deliveryOption: 'Reguler (Cashless)', shippingProviderName: 'SPX',
      zipcode: '', country: 'Indonesia',
      districts: '', villages: '', detailAddress: 'Jl. Ahmad Yani No 78',
      additionalAddress: '', weightKg: 0.5, productCategory: 'Peralatan Burung',
      packageId: '', purchaseChannel: 'TikTok', sellerNote: '',
      checkedStatus: 'Unchecked', checkedMarkedBy: '', invoiceNumber: ''
    },
    {
      id: '260105I5JBWTPM', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Proses',
      resi: 'SPXID01234567894E', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Large (50x40x35cm)', jumlah: 1,
      totalBayar: 380000, setoran: 320000, username: 'premium_customer', namaPenerima: 'F*****a',
      noTelepon: '******67', alamat: 'Jl. Diponegoro No 234', kota: 'BANDUNG',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-05 09:30', sudahDibayar: 0,
      catatan: 'Pakai bubble wrap ekstra'
    },
    {
      id: '260106K8LCXQON', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'SPXID01234567895F', jasaKirim: 'Express-SPX Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 1 - (6cm)', jumlah: 3,
      totalBayar: 690000, setoran: 570000, username: 'reseller_bird', namaPenerima: 'Gita Sari',
      noTelepon: '08345678901', alamat: 'Jl. Pahlawan No 89', kota: 'MALANG',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-06 13:10', sudahDibayar: 570000,
      catatan: 'Reseller - diskon khusus'
    },
    {
      id: '260107M1MDYRNL', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567896G', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Dalam Perjalanan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 8 Bening', jumlah: 2,
      totalBayar: 140000, setoran: 120000, username: 'shopee_regular', namaPenerima: 'H*****i',
      noTelepon: '******23', alamat: 'Jl. Veteran No 156', kota: 'PALEMBANG',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-07 15:25', sudahDibayar: 120000,
      catatan: 'Customer tetap'
    },
    {
      id: '260108O4NEZQMK', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Proses',
      resi: 'SPXID01234567897H', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Dalam Proses',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Small (30x25x20cm)', jumlah: 4,
      totalBayar: 720000, setoran: 600000, username: 'bulk_buyer', namaPenerima: 'Indah Permata',
      noTelepon: '08456789012', alamat: 'Jl. Sudirman No 345', kota: 'MEDAN',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-08 10:45', sudahDibayar: 0,
      catatan: 'Pembelian grosir'
    },
    {
      id: '260109Q7OFARLJ', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567898I', jasaKirim: 'Express-SPX Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 2 - (8cm)', jumlah: 1,
      totalBayar: 265000, setoran: 220000, username: 'loyal_customer', namaPenerima: 'J*****a',
      noTelepon: '******78', alamat: 'Jl. Thamrin No 67', kota: 'JAKARTA BARAT',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-09 12:15', sudahDibayar: 220000,
      catatan: 'Repeat order'
    },
    {
      id: '260110S0PGZTKI', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'SPXID01234567899J', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Dalam Perjalanan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 6 Hitam', jumlah: 1,
      totalBayar: 65000, setoran: 55000, username: 'first_time', namaPenerima: 'Kartika Sari',
      noTelepon: '08567890123', alamat: 'Jl. Gajah Mada No 89', kota: 'DENPASAR',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-10 14:30', sudahDibayar: 55000,
      catatan: 'Pertama kali beli'
    },
    {
      id: '260111U3QHBYJH', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Proses',
      resi: 'SPXID01234567900K', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Medium (40x30x25cm)', jumlah: 1,
      totalBayar: 210000, setoran: 180000, username: 'woodwork_fan', namaPenerima: 'L*****o',
      noTelepon: '******34', alamat: 'Jl. Hasanuddin No 123', kota: 'MAKASSAR',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-11 16:20', sudahDibayar: 0,
      catatan: 'Untuk hadiah ulang tahun'
    },
    {
      id: '260112W6RIAXIG', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'SPXID01234567901L', jasaKirim: 'Express-SPX Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 3 - (10cm)', jumlah: 2,
      totalBayar: 520000, setoran: 440000, username: 'premium_shop', namaPenerima: 'Mega Putri',
      noTelepon: '08678901234', alamat: 'Jl. Sudirman No 456', kota: 'BALIKPAPAN',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-12 11:45', sudahDibayar: 440000,
      catatan: 'Untuk toko premium'
    },
    {
      id: '260113Y9SJZWIF', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567902M', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Dalam Perjalanan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 8 Bening', jumlah: 4,
      totalBayar: 240000, setoran: 200000, username: 'bulk_shopper', namaPenerima: 'N*****i',
      noTelepon: '******56', alamat: 'Jl. Pahlawan No 234', kota: 'PEKANBARU',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-13 13:30', sudahDibayar: 200000,
      catatan: 'Stock untuk bulan depan'
    },
    {
      id: '260114A2TKYVHE', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Proses',
      resi: 'SPXID01234567903N', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Dalam Proses',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Large (50x40x35cm)', jumlah: 1,
      totalBayar: 380000, setoran: 320000, username: 'luxury_buyer', namaPenerima: 'Olivia Grace',
      noTelepon: '08789012345', alamat: 'Jl. Malioboro No 78', kota: 'YOGYAKARTA',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-14 15:15', sudahDibayar: 0,
      catatan: 'Premium quality only'
    },
    {
      id: '260115C5ULXUHD', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567904O', jasaKirim: 'Express-SPX Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 1 - (6cm)', jumlah: 1,
      totalBayar: 245000, setoran: 200000, username: 'fast_delivery', namaPenerima: 'P*****a',
      noTelepon: '******78', alamat: 'Jl. Sudirman No 567', kota: 'SURABAYA',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-15 10:00', sudahDibayar: 200000,
      catatan: 'Express delivery please'
    },
    // Data Dummy Tambahan - Lebih Banyak Variasi Produk dan Toko
    {
      id: '260116E8VMYVIE', storeName: 'Sazime Bird Paradise', platform: 'Tokopedia', status: 'Proses',
      resi: 'JNE01234567905P', jasaKirim: 'YES Regular', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Kenari Deluxe', variasi: 'Medium - 30x20x15cm', jumlah: 1,
      totalBayar: 195000, setoran: 165000, username: 'bird_enthusiast', namaPenerima: 'Q*****i',
      noTelepon: '******12', alamat: 'Jl. Malioboro No 123', kota: 'YOGYAKARTA',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-16 14:30', sudahDibayar: 0,
      catatan: 'Pakai kotak ekstra kuat'
    },
    {
      id: '260117G1WNZWJD', storeName: 'Sazime Premium Cages', platform: 'Lazada', status: 'Selesai',
      resi: 'LEX01234567906Q', jasaKirim: 'Lazada Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Tempat Makan Burung Otomatis', variasi: '500ml - Putih', jumlah: 2,
      totalBayar: 165000, setoran: 130000, username: 'premium_shopper', namaPenerima: 'R*****a',
      noTelepon: '******34', alamat: 'Jl. Thamrin No 456', kota: 'JAKARTA PUSAT',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-17 09:15', sudahDibayar: 130000,
      catatan: 'Customer premium'
    },
    {
      id: '260118I4XOYXKC', storeName: 'Sazime Grosir', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567907R', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Dalam Perjalanan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 6 Hitam', jumlah: 10,
      totalBayar: 275000, setoran: 225000, username: 'grosir_customer', namaPenerima: 'S*****o',
      noTelepon: '******56', alamat: 'Jl. Sudirman No 789', kota: 'BANDUNG',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-18 16:45', sudahDibayar: 200000,
      catatan: 'Grosir murah untuk toko burung'
    },
    {
      id: '260119K7YPZYLB', storeName: 'Sazime Mini Store', platform: 'TikTok Shop', status: 'Proses',
      resi: 'TTK01234567908S', jasaKirim: 'TikTok Standard', kurirStatus: 'Sedang Dipacking',
      produk: 'Mainan Burung Kayu', variasi: 'Set Lengkap - 5pcs', jumlah: 1,
      totalBayar: 45000, setoran: 35000, username: 'mini_store_buyer', namaPenerima: 'T*****i',
      noTelepon: '******78', alamat: 'Jl. Veteran No 234', kota: 'SEMARANG',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-19 11:20', sudahDibayar: 0,
      catatan: 'Toko kecil tapi loyal'
    },
    {
      id: '260120M0ZQAXMA', storeName: 'Sazime Bird Accessories', platform: 'Tokopedia', status: 'Selesai',
      resi: 'JNE01234567909T', jasaKirim: 'YES Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Botol Minum Burung Stainless', variasi: '250ml - Silver', jumlah: 5,
      totalBayar: 195000, setoran: 160000, username: 'accessories_shop', namaPenerima: 'U*****a',
      noTelepon: '******90', alamat: 'Jl. Pahlawan No 567', kota: 'SURABAYA',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-20 13:10', sudahDibayar: 160000,
      catatan: 'Toko aksesoris burung'
    },
    {
      id: '260121O3ARBWLZ', storeName: 'Sazime Express Store', platform: 'Lazada', status: 'Selesai',
      resi: 'LEX01234567910U', jasaKirim: 'Lazada Express', kurirStatus: 'Dalam Perjalanan',
      produk: 'Lampu Pemanas Kandang', variasi: '25W - Infrared', jumlah: 1,
      totalBayar: 125000, setoran: 95000, username: 'express_customer', namaPenerima: 'V*****o',
      noTelepon: '******12', alamat: 'Jl. Diponegoro No 890', kota: 'MEDAN',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-21 15:30', sudahDibayar: 95000,
      catatan: 'Kirim hari ini juga'
    },
    {
      id: '260122Q6BSCVMY', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Proses',
      resi: 'SPXID01234567911V', jasaKirim: 'Reguler (Cashless)-SPX Standard', kurirStatus: 'Sedang Dipacking',
      produk: 'Batu Gosok Paruh', variasi: 'Natural Stone - Large', jumlah: 3,
      totalBayar: 27000, setoran: 21000, username: 'natural_stone', namaPenerima: 'W*****i',
      noTelepon: '******34', alamat: 'Jl. Hasanuddin No 123', kota: 'MAKASSAR',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-22 10:45', sudahDibayar: 0,
      catatan: 'Batu alami untuk paruh'
    },
    {
      id: '260123S9CTDUNX', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'TTK01234567912W', jasaKirim: 'TikTok Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Vitamin Burung Cair', variasi: '500ml - Complete Formula', jumlah: 2,
      totalBayar: 125000, setoran: 100000, username: 'vitamin_buyer', namaPenerima: 'X*****a',
      noTelepon: '******56', alamat: 'Jl. Sudirman No 456', kota: 'PALEMBANG',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-23 12:15', sudahDibayar: 100000,
      catatan: 'Vitamin lengkap untuk burung'
    },
    {
      id: '260124U2DUEVOW', storeName: 'Sazime Bird Paradise', platform: 'Tokopedia', status: 'Selesai',
      resi: 'JNE01234567913X', jasaKirim: 'YES Regular', kurirStatus: 'Dalam Perjalanan',
      produk: 'Pakan Burung Premium', variasi: '5kg - Campuran Premium', jumlah: 1,
      totalBayar: 145000, setoran: 120000, username: 'premium_feed', namaPenerima: 'Y*****o',
      noTelepon: '******78', alamat: 'Jl. Thamrin No 789', kota: 'PEKANBARU',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-24 14:20', sudahDibayar: 110000,
      catatan: 'Pakan premium untuk burung kesayangan'
    },
    {
      id: '260125W5EVFWNV', storeName: 'Sazime Premium Cages', platform: 'Lazada', status: 'Proses',
      resi: 'LEX01234567914Y', jasaKirim: 'Lazada Standard', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Lovebird Elegan', variasi: 'Luxury - Gold Frame', jumlah: 1,
      totalBayar: 225000, setoran: 190000, username: 'luxury_buyer', namaPenerima: 'Z*****i',
      noTelepon: '******90', alamat: 'Jl. Malioboro No 345', kota: 'YOGYAKARTA',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-25 16:30', sudahDibayar: 0,
      catatan: 'Frame emas untuk lovebird'
    },
    {
      id: '260126Y8FWGXMU', storeName: 'Sazime Grosir', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567915Z', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Tiba di Tujuan',
      produk: 'Kandang Ayam Hias', variasi: 'Large - 100x80x60cm', jumlah: 1,
      totalBayar: 320000, setoran: 270000, username: 'ayam_hias_grosir', namaPenerima: 'A*****a',
      noTelepon: '******11', alamat: 'Jl. Sudirman No 567', kota: 'JAKARTA SELATAN',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-26 11:45', sudahDibayar: 270000,
      catatan: 'Kandang besar untuk ayam hias'
    },
    {
      id: '260127A1GXHYLT', storeName: 'Sazime Mini Store', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'TTK01234567916A', jasaKirim: 'TikTok Standard', kurirStatus: 'Dalam Perjalanan',
      produk: 'Sarang Buatan Lovebird', variasi: 'Premium - Kayu Jati', jumlah: 2,
      totalBayar: 105000, setoran: 85000, username: 'sarang_lovebird', namaPenerima: 'B*****o',
      noTelepon: '******22', alamat: 'Jl. Pahlawan No 890', kota: 'BALIKPAPAN',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-27 13:20', sudahDibayar: 85000,
      catatan: 'Sarang kayu jati untuk lovebird'
    },
    {
      id: '260128C4HYIZKS', storeName: 'Sazime Bird Accessories', platform: 'Tokopedia', status: 'Proses',
      resi: 'JNE01234567917B', jasaKirim: 'YES Express', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Cages Parrot', variasi: 'Extra Large - 80x60x100cm', jumlah: 1,
      totalBayar: 480000, setoran: 400000, username: 'parrot_owner', namaPenerima: 'C*****i',
      noTelepon: '******33', alamat: 'Jl. Veteran No 123', kota: 'DENPASAR',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-28 15:10', sudahDibayar: 0,
      catatan: 'Sangkar besar untuk parrot'
    },
    {
      id: '260129E7IZJAJR', storeName: 'Sazime Express Store', platform: 'Lazada', status: 'Selesai',
      resi: 'LEX01234567918C', jasaKirim: 'Lazada Express', kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original', variasi: 'No. 2 - (8cm)', jumlah: 2,
      totalBayar: 520000, setoran: 420000, username: 'murai_lover', namaPenerima: 'D*****a',
      noTelepon: '******44', alamat: 'Jl. Diponegoro No 456', kota: 'MANADO',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-29 10:30', sudahDibayar: 420000,
      catatan: 'Dua sangkar murai sekaligus'
    },
    {
      id: '260130G0JAKBIQ', storeName: 'Sazime Official Store', platform: 'Shopee', status: 'Selesai',
      resi: 'SPXID01234567919D', jasaKirim: 'Express-SPX Express', kurirStatus: 'Dalam Perjalanan',
      produk: 'Tempat Makan Burung Otomatis', variasi: '750ml - Hitam', jumlah: 1,
      totalBayar: 95000, setoran: 75000, username: 'auto_feeder', namaPenerima: 'E*****o',
      noTelepon: '******55', alamat: 'Jl. Hasanuddin No 789', kota: 'PALANGKARAYA',
      metodePembayaran: 'COD', waktuDibuat: '2026-01-30 12:45', sudahDibayar: 70000,
      catatan: 'Tempat makan otomatis praktis'
    },
    {
      id: '260131I3KBLCHP', storeName: 'Sazime Woodwork', platform: 'TikTok Shop', status: 'Proses',
      resi: 'TTK01234567920E', jasaKirim: 'TikTok Express', kurirStatus: 'Sedang Dipacking',
      produk: 'Sangkar Kotak Jati - Premium', variasi: 'Small (30x25x20cm)', jumlah: 3,
      totalBayar: 690000, setoran: 570000, username: 'jati_lover', namaPenerima: 'F*****i',
      noTelepon: '******66', alamat: 'Jl. Sudirman No 234', kota: 'BANJARMASIN',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-01-31 14:15', sudahDibayar: 0,
      catatan: 'Sangkar jati premium'
    },
    {
      id: '260201K6LCNIGO', storeName: 'Sazime Bird Paradise', platform: 'Tokopedia', status: 'Selesai',
      resi: 'JNE01234567921F', jasaKirim: 'YES Regular', kurirStatus: 'Tiba di Tujuan',
      produk: 'Cangkir Cepuk Pakan Mika', variasi: 'Segi 8 Bening', jumlah: 4,
      totalBayar: 120000, setoran: 100000, username: 'cepuk_specialist', namaPenerima: 'G*****a',
      noTelepon: '******77', alamat: 'Jl. Thamrin No 567', kota: 'MATARAM',
      metodePembayaran: 'COD', waktuDibuat: '2026-02-01 16:30', sudahDibayar: 100000,
      catatan: 'Cepuk bening berkualitas'
    },
    {
      id: '260202M9MDQJFN', storeName: 'Sazime Premium Cages', platform: 'Lazada', status: 'Selesai',
      resi: 'LEX01234567922G', jasaKirim: 'Lazada Standard', kurirStatus: 'Dalam Perjalanan',
      produk: 'Botol Minum Burung Stainless', variasi: '500ml - Gold', jumlah: 1,
      totalBayar: 55000, setoran: 45000, username: 'gold_bottle', namaPenerima: 'H*****o',
      noTelepon: '******88', alamat: 'Jl. Malioboro No 890', kota: 'PONTIANAK',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-02-02 11:20', sudahDibayar: 45000,
      catatan: 'Botol minum stainless gold'
    },
    {
      id: '260203O2NERKEM', storeName: 'Sazime Grosir', platform: 'Shopee', status: 'Proses',
      resi: 'SPXID01234567923H', jasaKirim: 'Hemat Kargo-SPX Hemat', kurirStatus: 'Sedang Dipacking',
      produk: 'Mainan Burung Kayu', variasi: 'Single - Bell Toy', jumlah: 20,
      totalBayar: 350000, setoran: 280000, username: 'toy_grosir', namaPenerima: 'I*****i',
      noTelepon: '******99', alamat: 'Jl. Pahlawan No 123', kota: 'AMBON',
      metodePembayaran: 'COD', waktuDibuat: '2026-02-03 13:45', sudahDibayar: 0,
      catatan: 'Grosir mainan burung'
    },
    {
      id: '260204Q5OFSLDL', storeName: 'Sazime Mini Store', platform: 'TikTok Shop', status: 'Selesai',
      resi: 'TTK01234567924I', jasaKirim: 'TikTok Standard', kurirStatus: 'Tiba di Tujuan',
      produk: 'Lampu Pemanas Kandang', variasi: '50W - Ceramic', jumlah: 1,
      totalBayar: 145000, setoran: 115000, username: 'heater_mini', namaPenerima: 'J*****a',
      noTelepon: '******10', alamat: 'Jl. Veteran No 456', kota: 'KUPANG',
      metodePembayaran: 'Transfer', waktuDibuat: '2026-02-04 15:30', sudahDibayar: 115000,
      catatan: 'Lampu pemanas keramik'
    }
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

  const filteredOfflineOrders = useMemo(() => offlineOrders.filter(o => {
    return (filterStore === 'All') && // Only show if "All" is selected, or we could add a "Toko Fisik" option
      (!startDate || o.date >= startDate) && (!endDate || o.date <= endDate);
  }), [offlineOrders, filterStore, startDate, endDate]);

  const filteredExpenses = useMemo(() => expenses.filter(e => {
    return (filterStore === 'All') &&
      (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate);
  }), [expenses, filterStore, startDate, endDate]);

  const filteredStores = useMemo(() => {
    return filterStore === 'All' ? stores : stores.filter(s => s.name === filterStore);
  }, [filterStore, stores]);

  const perStoreSummary = useMemo(() => {
    const map = {};
    stores.forEach((s) => {
      map[s.name] = { totalSetoran: 0, sudahDibayar: 0 };
    });
    filteredOrders.forEach((o) => {
      if (!map[o.storeName]) map[o.storeName] = { totalSetoran: 0, sudahDibayar: 0 };
      // Gunakan harga setoran global jika tersedia, jika tidak gunakan o.setoran
      const setoranPrice = globalProductPrices[o.produk] !== undefined ? globalProductPrices[o.produk] : o.setoran;
      map[o.storeName].totalSetoran += setoranPrice || 0;
      map[o.storeName].sudahDibayar += o.sudahDibayar || 0;
    });
    return map;
  }, [filteredOrders, stores, globalProductPrices]);

  const totalSetoran = useMemo(() => filteredStores.reduce((acc, s) => acc + (perStoreSummary[s.name]?.totalSetoran || s.totalSetoran), 0), [filteredStores, perStoreSummary]);

  const totalSudahDibayar = useMemo(
    () => filteredOrders.reduce((acc, curr) => acc + (curr.sudahDibayar || 0), 0),
    [filteredOrders]
  );

  const sisaTagihan = totalSetoran - totalSudahDibayar;

  // Calculate Global Total Balance (Profit) for Header
  const calculatedTotalBalance = useMemo(() => {
    // 1. Online Revenue
    const totalOmzet = filteredOrders.reduce((sum, o) => sum + (o.totalBayar || 0), 0);

    // 2. Setoran (Net Income from Online)
    let totalSetoranVal = 0;
    filteredOrders.forEach(o => {
      const setoranVal = globalProductPrices[o.produk] !== undefined ? globalProductPrices[o.produk] : (o.setoran || 0);
      totalSetoranVal += setoranVal;
    });

    // 3. Offline Income
    const offlineIncome = filteredOfflineOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 4. Expenses
    const offlineExpense = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const onlineFees = totalOmzet - totalSetoranVal;
    const totalExpense = offlineExpense + onlineFees;

    // 5. Profit = (Total Setoran + Offline Income) - (Offline Expense + Online Fees)?
    // Wait, onlineFees are already deducted from Total Omzet to get Setoran.
    // So "Income" = Setoran + Offline Income.
    // "Expense" = Offline Expense.
    // Profit = (Setoran + Offline Income) - Offline Expense.
    // Let's verify with Dashboard logic.
    // Dashboard: totalProfit = (offlineIncome - offlineExpense) + totalSetoran;
    // Yes, that matches.
    return (offlineIncome - offlineExpense) + totalSetoranVal;
  }, [filteredOrders, filteredOfflineOrders, filteredExpenses, globalProductPrices]);

  useEffect(() => {
    setTotalBalance(calculatedTotalBalance);
  }, [calculatedTotalBalance]);

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

  /* Shared Dashboard Layout Component */
  const SavingProfitModal = ({ currentSaving, onSave, onClose }) => {
    const [value, setValue] = useState(currentSaving);

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Edit Saving Profit</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Jumlah Saving Profit</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <button
              onClick={() => onSave(value)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardLayout = ({ title, totalIncome, totalExpense, totalProfit, incomeBreakdown, expenseBreakdown, chartData, topProductsOnline, topProductsOffline, filterBar, activeView, bankBalance, cashBalance, savingProfit, onEditSaving, setTotalBalance }) => {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 font-sans">


        {/* Top Section: Filter & Financial Balance */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <div className="xl:col-span-2 min-w-0">
            {filterBar}
          </div>

          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Saldo Keuangan</h3>
                <h2 className="text-slate-800 text-3xl font-black tracking-tight">Rp {(bankBalance + cashBalance).toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">Bank Transfer</span>
                </div>
                <span className="font-black text-slate-800">Rp {bankBalance.toLocaleString()}</span>
              </div>
              <div className="w-full h-px bg-slate-50"></div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs">Uang Tunai</span>
                </div>
                <span className="font-black text-slate-800">Rp {cashBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>


        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Card 1: Estimasi Profit Bersih */}
          <div className="md:col-span-3 bg-emerald-600 p-6 rounded-[1.5rem] shadow-lg shadow-emerald-200 relative overflow-hidden group flex flex-col justify-center min-h-[160px]">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
              <TrendingUp className="w-24 h-24 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">Estimasi Profit Bersih</h3>
              <h2 className="text-white text-3xl font-black tracking-tight leading-tight">Rp {(totalProfit || 0).toLocaleString()}</h2>
            </div>
          </div>

          {/* Card 2: Total Penjualan */}
          <div className="md:col-span-3 bg-emerald-500 p-0 rounded-[1.5rem] shadow-lg shadow-emerald-200 overflow-hidden relative group flex flex-col">
            <div className="bg-emerald-600/30 p-4 text-center border-b border-white/10">
              <h3 className="text-white/90 text-[10px] font-black uppercase tracking-widest mb-1">Total Penjualan</h3>
              <h2 className="text-white text-2xl font-black tracking-tight">Rp {totalIncome.toLocaleString()}</h2>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 flex-1 relative">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm flex flex-col justify-center">
                <p className="text-[8px] text-emerald-100 font-black uppercase tracking-wider mb-0.5">Online Lunas</p>
                <p className="text-xs font-black text-white truncate">Rp {incomeBreakdown.onlinePaid.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm flex flex-col justify-center">
                <p className="text-[8px] text-emerald-100 font-black uppercase tracking-wider mb-0.5">Offline Lunas</p>
                <p className="text-xs font-black text-white truncate">Rp {incomeBreakdown.offlinePaid.toLocaleString()}</p>
              </div>
              <div className="bg-orange-500/20 p-2 rounded-xl backdrop-blur-sm flex flex-col justify-center border border-orange-400/30">
                <p className="text-[8px] text-orange-200 font-black uppercase tracking-wider mb-0.5">Online Belum Lunas</p>
                <p className="text-xs font-black text-orange-100 truncate">Rp {incomeBreakdown.onlineUnpaid.toLocaleString()}</p>
              </div>
              <div className="bg-orange-500/20 p-2 rounded-xl backdrop-blur-sm flex flex-col justify-center border border-orange-400/30">
                <p className="text-[8px] text-orange-200 font-black uppercase tracking-wider mb-0.5">Offline Belum Lunas</p>
                <p className="text-xs font-black text-orange-100 truncate">Rp {incomeBreakdown.offlineUnpaid.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Card 3: Total Pengeluaran */}
          <div className="md:col-span-4 bg-red-600 p-0 rounded-[1.5rem] shadow-lg shadow-red-200 overflow-hidden relative group flex flex-col">
            <div className="bg-red-700/30 p-4 text-center border-b border-white/10">
              <h3 className="text-white/90 text-[10px] font-black uppercase tracking-widest mb-1">Total Pengeluaran</h3>
              <h2 className="text-white text-2xl font-black tracking-tight">Rp {totalExpense.toLocaleString()}</h2>
            </div>
            <div className="p-3 grid grid-cols-3 gap-2 flex-1 overflow-y-auto custom-scrollbar">
              {[
                { label: 'Belanja Bahan', value: expenseBreakdown.belanjaBahan },
                { label: 'Operasional Pokok', value: expenseBreakdown.operasionalPokok },
                { label: 'Ops. Luar Biasa', value: expenseBreakdown.operasionalLuarBiasa },
                { label: 'Gaji Karyawan', value: expenseBreakdown.gajiKaryawan },
                { label: 'Gaji Direksi', value: expenseBreakdown.gajiDireksi },
                { label: 'Pengembangan', value: expenseBreakdown.pengembangan }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 p-1.5 rounded-lg flex flex-col justify-center">
                  <p className="text-[8px] text-red-100 font-bold uppercase tracking-wider mb-0.5 truncate">{item.label}</p>
                  <p className="text-[10px] font-black text-white">Rp {item.value.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Saving Profit */}
          <div className="md:col-span-2 bg-blue-900 p-6 rounded-[1.5rem] shadow-xl shadow-blue-200 text-white relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Saving Profit</p>
              <h2 className="text-xl font-black tracking-tight mb-4">Rp {savingProfit.toLocaleString()}</h2>
            </div>
            {activeView === 'owner' && (
              <button
                onClick={onEditSaving}
                className="relative z-10 bg-blue-600 hover:bg-white hover:text-blue-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all w-max flex items-center gap-2 shadow-lg"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            )}
          </div>
        </div>



        {/* Bottom Section: Chart & Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Trend Chart */}
          <div className="xl:col-span-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" /> Trend Keuangan
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> In
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Out
                </div>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} dy={10} interval={dateFilterMode === 'month' ? 2 : 0} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} itemStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="v" name="Pemasukan" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="e" name="Pengeluaran" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Online & Offline */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Online */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <span className="text-emerald-500">🏆</span> Produk <span className="text-emerald-500">ONLINE</span> Terlaris
              </h3>
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
                {topProductsOnline.map((product, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 flex items-center justify-center rounded text-[9px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</span>
                        <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover:text-emerald-600 transition-colors truncate max-w-[120px]">{product.name}</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{product.qty} items</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-amber-500 w-[90%]' : idx === 1 ? 'bg-slate-400 w-[70%]' : 'bg-slate-300 w-[40%]'}`}></div>
                    </div>
                    {/* <p className="text-right text-[9px] font-black text-slate-800">Rp {product.revenue.toLocaleString()}</p> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Offline */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <span className="text-red-500">🏆</span> Produk <span className="text-red-500">OFFLINE</span> Terlaris
              </h3>
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
                {topProductsOffline.map((product, idx) => (
                  <div key={idx} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 flex items-center justify-center rounded text-[9px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</span>
                        <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-tight group-hover:text-red-600 transition-colors truncate max-w-[120px]">{product.name}</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400">{product.qty} items</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-amber-500 w-[90%]' : idx === 1 ? 'bg-slate-400 w-[70%]' : 'bg-slate-300 w-[40%]'}`}></div>
                    </div>
                    {/* <p className="text-right text-[9px] font-black text-slate-800">Rp {product.revenue.toLocaleString()}</p> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getChartLabels = () => {
    if (dateFilterMode === 'day') return Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
    if (dateFilterMode === 'month') {
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  };

  const processChartData = (onlineData, offlineData, expenseData, mode) => {
    const labels = getChartLabels();
    const data = labels.map(name => ({ name, v: 0, e: 0 }));

    const updateData = (dateStr, amount, type) => {
      if (!dateStr) return;
      const date = new Date(dateStr);
      let index = -1;

      if (mode === 'day') index = date.getHours();
      else if (mode === 'month') index = date.getDate() - 1;
      else index = date.getMonth();

      if (index >= 0 && index < data.length) {
        if (type === 'income') data[index].v += amount;
        else data[index].e += amount;
      }
    };

    // Process Online Orders
    onlineData.forEach(o => {
      // Use setoran as net income (if needed) or totalBayar as revenue.
      // Expense = totalBayar - setoran
      if (o.waktuDibuat) {
        updateData(o.waktuDibuat, o.totalBayar || 0, 'income');
        updateData(o.waktuDibuat, (o.totalBayar || 0) - (o.setoran || 0), 'expense');
      }
    });

    // Process Offline Orders
    offlineData.forEach(o => {
      if (o.date) {
        updateData(o.date, o.total || 0, 'income');
      }
    });

    // Process Expenses (Offline/Operational)
    expenseData.forEach(e => {
      if (e.date) {
        updateData(e.date, e.amount || 0, 'expense');
      }
    });

    return data;
  };

  const getTopProductsMerged = (onlineData, offlineData) => {
    const productMap = {};

    // Process Online
    onlineData.forEach(o => {
      const name = o.produk;
      if (!productMap[name]) productMap[name] = { name, sold: 0, revenue: 0 };
      productMap[name].sold += o.jumlah || 0;
      productMap[name].revenue += o.totalHargaProduk || o.totalBayar || 0;
    });

    // Process Offline
    offlineData.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const name = item.name;
          if (!productMap[name]) productMap[name] = { name, sold: 0, revenue: 0 };
          productMap[name].sold += item.qty || 0;
          productMap[name].revenue += (item.price * item.qty) || 0;
        });
      }
    });

    return Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  };


  // State for Saving Profit
  const [savingProfit, setSavingProfit] = useState(20000000);
  const [showSavingModal, setShowSavingModal] = useState(false);

  const Dashboard = ({ setTotalBalance }) => {
    // 1. Online Metrics
    const onlineRevenue = useMemo(() => filteredOrders.reduce((sum, o) => sum + (o.totalBayar || 0), 0), [filteredOrders]);
    const { totalSetoran, totalSudahDibayarOnline } = useMemo(() => {
      let setoran = 0;
      let dibayar = 0;
      filteredOrders.forEach(o => {
        const setoranVal = globalProductPrices[o.produk] !== undefined ? globalProductPrices[o.produk] : (o.setoran || 0);
        setoran += setoranVal;
        dibayar += (o.sudahDibayar || 0); // Use the actual field
      });
      return { totalSetoran: setoran, totalSudahDibayarOnline: dibayar };
    }, [filteredOrders, globalProductPrices]);
    const onlineUnpaid = totalSetoran - totalSudahDibayarOnline;

    // 2. Offline Metrics
    const offlineIncome = useMemo(() => filteredOfflineOrders.reduce((sum, o) => sum + (o.total || 0), 0), [filteredOfflineOrders]);
    const offlinePaid = useMemo(() => filteredOfflineOrders.reduce((sum, o) => sum + (o.paidAmount || 0), 0), [filteredOfflineOrders]);
    const offlineUnpaid = useMemo(() => filteredOfflineOrders.reduce((sum, o) => sum + (o.remaining || 0), 0), [filteredOfflineOrders]);

    // 3. Totals
    const totalIncome = onlineRevenue + offlineIncome;

    // Income Breakdown
    const incomeBreakdown = {
      onlinePaid: totalSudahDibayarOnline,
      offlinePaid: offlinePaid,
      onlineUnpaid: onlineUnpaid,
      offlineUnpaid: offlineUnpaid
    };

    // 4. Expenses Breakdown
    const expenseBreakdown = useMemo(() => {
      const breakdown = {
        belanjaBahan: 0,
        operasionalPokok: 0,
        operasionalLuarBiasa: 0,
        gajiKaryawan: 0,
        gajiDireksi: 0,
        pengembangan: 0
      };
      filteredExpenses.forEach(e => {
        if (e.category === 'Belanja Bahan') breakdown.belanjaBahan += e.amount;
        else if (e.category === 'Operasional Pokok') breakdown.operasionalPokok += e.amount;
        else if (e.category === 'Operasional Luar Biasa') breakdown.operasionalLuarBiasa += e.amount;
        else if (e.category === 'Gaji Karyawan') breakdown.gajiKaryawan += e.amount;
        else if (e.category === 'Gaji Direksi') breakdown.gajiDireksi += e.amount;
        else if (e.category === 'Pengembangan') breakdown.pengembangan += e.amount;
        else if (e.category === 'Operasional') breakdown.operasionalPokok += e.amount; // fallback for old data
      });
      return breakdown;
    }, [filteredExpenses]);
    const totalExpense = Object.values(expenseBreakdown).reduce((a, b) => a + b, 0);

    // 5. Profit
    // Profit = (Total Setoran Online + Offline Income) - Total Expense
    const totalProfit = (totalSetoran + offlineIncome) - totalExpense;

    // 6. Financial Balance Calculation
    // Bank Transfer = Online Paid (All assumed Transfer/Marketplace) + Offline Transfer Paid - Expenses Transfer
    // Cash = Offline Cash Paid - Expenses Cash
    const { bankBalance, cashBalance } = useMemo(() => {
      // Online Paid (Marketplace is usually transfer/balance) -> Treat as Bank
      const onlineIn = totalSudahDibayarOnline;

      // Offline
      const offlineInTransfer = filteredOfflineOrders.filter(o => o.paymentMethod === 'Transfer').reduce((sum, o) => sum + (o.paidAmount || 0), 0);
      const offlineInCash = filteredOfflineOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.paidAmount || 0), 0);

      // Expenses
      const expenseTransfer = filteredExpenses.filter(e => e.paymentMethod === 'Transfer').reduce((sum, e) => sum + (e.amount || 0), 0);
      const expenseCash = filteredExpenses.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + (e.amount || 0), 0);

      const bank = onlineIn + offlineInTransfer - expenseTransfer;
      const cash = offlineInCash - expenseCash;

      return { bankBalance: bank, cashBalance: cash };
    }, [totalSudahDibayarOnline, filteredOfflineOrders, filteredExpenses]);

    // Update Global Balance
    useEffect(() => {
      if (setTotalBalance) {
        setTotalBalance(bankBalance + cashBalance);
      }
    }, [bankBalance, cashBalance, setTotalBalance]);

    // 7. Data needed for charts
    const chartData = useMemo(() => processChartData(filteredOrders, filteredOfflineOrders, filteredExpenses, dateFilterMode), [filteredOrders, filteredOfflineOrders, filteredExpenses, dateFilterMode]);

    // 8. Top Products
    const topProductsOnline = useMemo(() => {
      const productSales = {};
      filteredOrders.forEach(o => {
        if (!productSales[o.produk]) productSales[o.produk] = 0;
        productSales[o.produk] += (o.jumlah || 1);
      });
      return Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));
    }, [filteredOrders]);

    const topProductsOffline = useMemo(() => {
      const productSales = {};
      filteredOfflineOrders.forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.name]) productSales[item.name] = 0;
          productSales[item.name] += item.qty;
        });
      });
      return Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));
    }, [filteredOfflineOrders]);

    return (
      <DashboardLayout
        title="Dashboard Utama"
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalProfit={totalProfit}
        incomeBreakdown={incomeBreakdown}
        expenseBreakdown={expenseBreakdown}
        chartData={chartData}
        topProductsOnline={topProductsOnline}
        topProductsOffline={topProductsOffline}
        activeView={activeView}
        filterBar={
          <FilterBar
            filterStore={filterStore} setFilterStore={setFilterStore}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={endDate}
            dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
            stores={stores}
          />
        }
        bankBalance={bankBalance}
        cashBalance={cashBalance}
        savingProfit={savingProfit}
        onEditSaving={() => setShowSavingModal(true)}
      />
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
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Orders</p>
                <p className="text-lg font-black text-slate-800">{t.totalOrders}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Setoran</p>
                <p className="text-lg font-black text-red-600 truncate">{(t.totalSetoran / 1000000).toFixed(1)} jt</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Dibayar</p>
                <p className="text-lg font-black text-emerald-600 truncate">
                  {((perStoreSummary[t.name]?.sudahDibayar || 0) / 1000000).toFixed(1)} jt
                </p>
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

    // Hitung jumlah barang dari total pesanan untuk setiap produk
    const productQuantities = useMemo(() => {
      const quantities = {};
      storeOrders.forEach(order => {
        if (!quantities[order.produk]) {
          quantities[order.produk] = 0;
        }
        quantities[order.produk] += order.jumlah;
      });
      return quantities;
    }, [storeOrders]);

    // Filter produk yang hanya ada dalam pesanan toko ini
    const storeProducts = useMemo(() => {
      return products
        .filter(product => productQuantities[product.name])
        .map(product => ({
          ...product,
          totalQuantity: productQuantities[product.name]
        }));
    }, [products, productQuantities]);

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
            <button onClick={() => setShowModal('import')} className="flex-1 md:flex-none items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-lg transition">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Import Excel
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
                          {order.variasi && order.variasi !== 'Default' && (
                            <span className="text-[10px] text-slate-500 italic">{order.variasi}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex flex-col items-start">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${order.kurirStatus.includes('Tiba') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{order.kurirStatus}</span>
                          <span className="text-[10px] font-mono mt-1 text-slate-400">{order.resi}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-emerald-600">
                        Rp {order.setoran?.toLocaleString() || '0'}
                      </td>
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
                      <td colSpan="6" className="text-center py-8 text-slate-400 italic text-xs">Tidak ada data pesanan pada periode ini.</td>
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
                    <th className="px-3 py-3 sm:px-6 sm:py-4">Jumlah</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 text-right">Harga Setoran</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm text-slate-900">
                  {storeProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 sm:px-6 sm:py-4 font-bold">{p.name}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 font-mono text-xs">{p.sku}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">{p.totalQuantity}</td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-right font-black text-red-600">
                        {p.hargaSetoran ? `Rp ${p.hargaSetoran.toLocaleString()}` : '-'}
                      </td>
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

  const DatabaseProduk = () => {
    const [selectedSku, setSelectedSku] = useState('');
    const [hargaSetoranInput, setHargaSetoranInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSkuDropdown, setShowSkuDropdown] = useState(false);

    // Filter produk berdasarkan search term
    const filteredProducts = useMemo(() => {
      if (!searchTerm) return products;
      return products.filter(product =>
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [products, searchTerm]);

    // Hanya tampilkan produk yang sudah memiliki harga setoran global
    const productsWithPrices = useMemo(() => {
      return products.filter(product =>
        globalProductPrices[product.name] !== undefined &&
        globalProductPrices[product.name] !== null
      ).map(product => ({
        ...product,
        hargaSetoran: globalProductPrices[product.name]
      }));
    }, [products, globalProductPrices]);

    const handleSelectSku = (product) => {
      setSelectedSku(product.sku);
      setSearchTerm(product.sku);
      setShowSkuDropdown(false);
    };

    const handleSaveHargaSetoran = () => {
      if (selectedSku && hargaSetoranInput !== '') {
        const selectedProduct = products.find(p => p.sku === selectedSku);
        if (selectedProduct) {
          const newPrice = parseInt(hargaSetoranInput) || 0;
          setGlobalProductPrices(prev => ({
            ...prev,
            [selectedProduct.name]: newPrice
          }));

          // Reset form
          setSelectedSku('');
          setSearchTerm('');
          setHargaSetoranInput('');
        }
      }
    };

    const handleEditProduct = (product) => {
      setSelectedSku(product.sku);
      setSearchTerm(product.sku);
      setHargaSetoranInput(product.hargaSetoran.toString());
    };

    const handleDeleteProduct = (product) => {
      setGlobalProductPrices(prev => {
        const newPrices = { ...prev };
        delete newPrices[product.name];
        return newPrices;
      });
    };

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Database Produk</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Kelola harga setoran produk secara global untuk semua toko.</p>
          </div>
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600">
            Total Produk: {productsWithPrices.length}
          </div>
        </div>

        {/* Form Input Harga Setoran */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">Input Harga Setoran</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SKU Selector dengan Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih SKU</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSkuDropdown(true);
                  }}
                  onFocus={() => setShowSkuDropdown(true)}
                  placeholder="Cari SKU atau nama produk..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                />
                {showSkuDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSkuDropdown(false)} />
                    <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSelectSku(product)}
                            className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-colors border-b border-slate-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-mono text-sm font-bold text-slate-800">{product.sku}</div>
                              <div className="text-xs text-slate-400">
                                Stok: {product.stock}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-slate-400 text-sm italic">
                          Tidak ada produk ditemukan
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Input Harga Setoran */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga Setoran</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={hargaSetoranInput}
                  onChange={(e) => setHargaSetoranInput(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex items-end">
              <button
                onClick={handleSaveHargaSetoran}
                disabled={!selectedSku || !hargaSetoranInput}
                className={`w-full px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition ${selectedSku && hargaSetoranInput
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Simpan Harga
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Produk dengan Harga Setoran */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full table-scroll pb-2">
            <table className="w-full text-left whitespace-nowrap min-w-max">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                <tr>
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">SKU</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">Jumlah</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4">Harga Setoran Global</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-900">
                {productsWithPrices.map((product, index) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="font-mono text-sm font-bold text-slate-800">{product.sku}</span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-black">
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="font-black text-red-600">
                        Rp {product.hargaSetoran.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Edit Harga Setoran"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus dari Database"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {productsWithPrices.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 italic text-sm">
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                          <Package className="w-8 h-8 text-slate-300" />
                        </div>
                        <p>Belum ada produk dengan harga setoran</p>
                        <p className="text-xs">Gunakan form di atas untuk menambah produk</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

  const TambahUser = () => {
    const [formData, setFormData] = useState({
      nama: '',
      email: '',
      password: '',
      role: '',
      noTelepon: '',
      alamat: ''
    });

    const [users, setUsers] = useState([
      { id: 1, nama: 'Owner', email: 'admin@sazime.com', role: 'Owner', noTelepon: '081234567890', alamat: 'Jakarta' },
      { id: 2, nama: 'Admin', email: 'sales1@sazime.com', role: 'Admin', noTelepon: '081234567891', alamat: 'Jakarta' }
    ]);

    const roles = [
      { value: 'owner', label: 'Owner' },
      { value: 'admin', label: 'Admin' }
    ];

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.nama || !formData.email || !formData.password || !formData.role) {
        alert('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Format email tidak valid');
        return;
      }
      if (formData.password.length < 6) {
        alert('Password minimal 6 karakter');
        return;
      }

      const newUser = {
        id: users.length + 1,
        nama: formData.nama,
        email: formData.email,
        role: roles.find(r => r.value === formData.role)?.label || formData.role,
        noTelepon: formData.noTelepon,
        alamat: formData.alamat
      };
      setUsers(prev => [...prev, newUser]);

      setFormData({
        nama: '',
        email: '',
        password: '',
        role: '',
        noTelepon: '',
        alamat: ''
      });
      alert('User berhasil ditambahkan!');
    };

    const roleBadgeClass = (role) => {
      if (!role) return 'bg-slate-100 text-slate-700';
      if (role.toLowerCase().includes('owner')) return 'bg-pink-100 text-pink-700';
      if (role.toLowerCase().includes('admin')) return 'bg-blue-100 text-blue-700';
      if (role.toLowerCase().includes('kasir')) return 'bg-emerald-100 text-emerald-700';
      return 'bg-slate-100 text-slate-700';
    };

    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-0 animate-in slide-in-from-right-4 duration-300">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Tambah User Baru</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Kelola pengguna sistem SAZIME Print</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">Form User Baru</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Nama Lengkap *</label>
                  <input type="text" value={formData.nama} onChange={(e) => handleInputChange('nama', e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Masukkan email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Masukkan password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" required minLength="6" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Role *</label>
                  <select value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" required>
                    <option value="">Pilih Role</option>
                    {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">No. Telepon</label>
                  <input type="tel" value={formData.noTelepon} onChange={(e) => handleInputChange('noTelepon', e.target.value)} placeholder="Masukkan nomor telepon" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Alamat</label>
                  <input type="text" value={formData.alamat} onChange={(e) => handleInputChange('alamat', e.target.value)} placeholder="Masukkan alamat" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div className="pt-4 text-right">
                <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl font-black shadow-lg hover:bg-red-700 transition">
                  <Plus className="w-4 h-4" /> Tambah User
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Daftar User</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Telepon</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{user.nama}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${roleBadgeClass(user.role)}`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.noTelepon}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{user.alamat}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-slate-400 hover:text-red-600 p-2"><Edit3 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        <TopBar activeMenu={activeMenu} activeView={activeView} setActiveView={setActiveView} totalBalance={totalBalance} />

        <main className="flex-1 p-4 md:p-8 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {activeMenu === 'dashboard' && <Dashboard setTotalBalance={setTotalBalance} />}


          {activeMenu === 'pos' && <POSView offlineProducts={offlineProducts} onAddOrder={handleAddOfflineOrder} orders={offlineOrders} onCreateOrder={() => setActiveMenu('pos-create')} />}
          {activeMenu === 'pos-create' && <CreateOrderView offlineProducts={offlineProducts} onAddOrder={handleAddOfflineOrder} onBack={() => setActiveMenu('pos')} />}
          {activeMenu === 'database-produk-offline' && <OfflineProductView products={offlineProducts} onAddProduct={handleAddOfflineProduct} onEditProduct={handleEditOfflineProduct} />}
          {activeMenu === 'pengeluaran' && <ExpenseView expenses={expenses} onAddExpense={handleAddExpense} />}
          {activeMenu === 'rekap-cashflow' && (
            <CashflowRecapView
              orders={orders}
              offlineOrders={filteredOfflineOrders}
              expenses={filteredExpenses}
              stores={filteredStores}
              allStores={stores}
              perStoreSummary={perStoreSummary}
              setSelectedStore={setSelectedStore}
              setShowModal={setShowModal}
              totalSetoran={totalSetoran}
              totalSudahDibayar={totalSudahDibayar}
              sisaTagihan={sisaTagihan}
              filterStore={filterStore} setFilterStore={setFilterStore}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              dateFilterMode={dateFilterMode} setDateFilterMode={setDateFilterMode}
            />
          )}
          {activeMenu === 'toko' && <TokoList />}
          {activeMenu === 'toko-detail' && <TokoDetail />}
          {activeMenu === 'database-produk' && <DatabaseProduk />}
          {activeMenu === 'tambah-user' && <TambahUser />}
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

      {showSavingModal && (
        <SavingProfitModal
          currentSaving={savingProfit}
          onSave={(val) => { setSavingProfit(val); setShowSavingModal(false); }}
          onClose={() => setShowSavingModal(false)}
        />
      )}

      {showModal && !showSavingModal && (
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