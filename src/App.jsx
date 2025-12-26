import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard,
  Store,
  ScanLine,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  Download,
  ArrowLeft,
  Package,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Wallet,
  FileSpreadsheet,
  Edit3,
  X,
  Eye,
  ClipboardList,
  Calendar,
  Share2,
  RefreshCw,
  Camera,
  Zap,
  Key,
  User,
  Truck,
  MapPin,
  CreditCard,
  Clock,
  FileText,
  CheckSquare,
  Square,
  QrCode,
  Keyboard,
  Phone,
} from 'lucide-react';

// --- SUB-KOMPONEN UI ---

const Sidebar = ({ activeMenu, setActiveMenu }) => (
  <div className="hidden lg:flex w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex-col z-20 shadow-2xl">
    <div className="p-6 border-b border-slate-800">
      <h1 className="text-xl font-bold tracking-tight text-blue-400">
        SAZIME <span className="text-white">SalesHub</span>
      </h1>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
        Internal Management
      </p>
    </div>

    <nav className="flex-1 p-4 space-y-1">
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
          className={`flex items-center w-full p-3 rounded-xl transition-all ${
            activeMenu === item.id ||
            (activeMenu === 'toko-detail' && item.id === 'toko')
              ? 'bg-blue-600 text-white shadow-lg'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />{' '}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-800">
      <button className="flex items-center w-full p-3 text-red-400 hover:text-red-300 transition rounded-xl hover:bg-red-950/30">
        <LogOut className="w-5 h-5 mr-3" /> Keluar
      </button>
    </div>
  </div>
);

const BottomNavbar = ({ activeMenu, setActiveMenu }) => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-[60] pb-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
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
        className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
          activeMenu === item.id ||
          (activeMenu === 'toko-detail' && item.id === 'toko')
            ? 'text-blue-600'
            : 'text-slate-400'
        }`}
      >
        <item.icon
          className={`w-6 h-6 ${activeMenu === item.id ? 'scale-110' : ''}`}
        />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
          {item.label}
        </span>
      </button>
    ))}
  </div>
);

const TopBar = ({ activeMenu, activeView, setActiveView }) => (
  <div className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-6 md:px-8 sticky top-0 z-40">
    <div className="flex items-center space-x-4 uppercase tracking-tighter">
      <h2 className="font-black text-slate-800 tracking-tight italic text-lg md:text-xl">
        {activeMenu.replace('-', ' ')}
      </h2>
    </div>
    <div className="flex items-center space-x-4">
      <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveView('owner')}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${
            activeView === 'owner'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-slate-500'
          }`}
        >
          OWNER
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition ${
            activeView === 'admin'
              ? 'bg-white shadow-sm text-blue-600'
              : 'text-slate-500'
          }`}
        >
          ADMIN
        </button>
      </div>
      <div className="flex items-center space-x-2 border-l pl-4 font-bold text-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">
          S
        </div>
        <span className="text-xs hidden md:inline">Sazime User</span>
      </div>
    </div>
  </div>
);

const FilterBar = ({
  showStore = true,
  showMarketplace = true,
  showDate = true,
  filterStore,
  setFilterStore,
  filterMarketplace,
  setFilterMarketplace,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  stores,
}) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {showMarketplace && (
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Marketplace
        </label>
        <div className="relative">
          <ShoppingBag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterMarketplace}
            onChange={(e) => setFilterMarketplace(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="All">Semua Platform</option>
            <option value="Shopee">Shopee</option>
            <option value="TikTok Shop">TikTok Shop</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    )}
    {showStore && (
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Pilih Toko
        </label>
        <div className="relative">
          <Store className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="All">Semua Toko</option>
            {stores.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    )}
    {showDate && (
      <>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Dari Tanggal
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Sampai Tanggal
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </>
    )}
  </div>
);

const Modal = ({ title, type, onClose, data, products }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div
      className={`bg-white rounded-[2.5rem] w-full ${
        type === 'order-detail' || type === 'store-orders'
          ? 'max-w-2xl'
          : 'max-w-md'
      } shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col`}
    >
      <div className="p-6 border-b flex justify-between items-center bg-slate-50 font-black shrink-0">
        <h3 className="text-lg text-slate-800 tracking-tight uppercase italic">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6 overflow-y-auto">
        {type === 'order-detail' && data ? (
          <div className="space-y-6 text-sm">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-blue-500 font-bold uppercase">
                  No. Pesanan
                </p>
                <p className="font-mono font-black text-lg text-blue-900">
                  {data.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-blue-500 font-bold uppercase">
                  Waktu Pesanan
                </p>
                <p className="font-bold text-blue-900">
                  {data.waktuDibuat || '2025-11-01 10:40'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Pembeli / Penerima
                    </p>
                    <p className="font-bold text-slate-800">{data.username}</p>
                    <p className="text-xs text-slate-500">
                      {data.namaPenerima} ({data.noTelepon})
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Alamat Pengiriman
                    </p>
                    <p className="font-bold text-slate-800 leading-tight">
                      {data.alamat}, {data.kota}, {data.provinsi}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Metode Pembayaran
                    </p>
                    <p className="font-bold text-slate-800">
                      {data.metodePembayaran}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Truck className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Pengiriman
                    </p>
                    <p className="font-bold text-slate-800">{data.jasaKirim}</p>
                    <p className="text-xs text-blue-600 font-medium">
                      Status: {data.kurirStatus}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      Resi: {data.resi}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Catatan
                    </p>
                    <p className="font-bold text-slate-800 italic">
                      "{data.catatan}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                Rincian Produk
              </p>
              <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{data.produk}</p>
                  <p className="text-xs text-slate-500 italic">
                    {data.variasi} x {data.jumlah}
                  </p>
                </div>
                <p className="font-bold text-slate-800">
                  Rp {data.totalBayar.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ) : type === 'store-orders' ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Menampilkan daftar pesanan yang masuk dalam rekap periode ini.
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Tgl Selesai</th>
                    <th className="px-4 py-3 text-right">Setoran</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-mono">ORD-2025-{i}99</td>
                      <td className="px-4 py-3">2{i} Nov 2025</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">
                        Rp 150.000
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : type === 'harga-setoran' ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start space-x-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed font-bold">
                Perubahan ini akan memperbarui HARGA SETORAN untuk semua barang
                dengan nama yang sama secara GLOBAL.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Pilih Barang dari List
              </label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold cursor-pointer hover:bg-slate-100 transition">
                <option>-- Pilih Barang --</option>
                {products &&
                  products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (SKU: {p.sku})
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Harga Setoran Baru (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 350000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-bold"
              />
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black shadow-lg hover:bg-emerald-700 transition uppercase mt-4">
              Simpan Perubahan Global
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
                      className="p-4 rounded-2xl border-2 border-slate-100 font-bold text-sm text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-blue-500 transition"
              />
            </div>
            <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition">
              Simpan Toko Baru
            </button>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-500 text-xs font-black uppercase italic tracking-widest opacity-50">
              Fungsi Import Excel
            </p>
          </div>
        )}
        {type !== 'order-detail' &&
          type !== 'harga-setoran' &&
          type !== 'add-store' && (
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase shadow-lg shadow-slate-200 hover:bg-slate-800 transition tracking-widest"
            >
              Tutup
            </button>
          )}
      </div>
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedStore, setSelectedStore] = useState(null);
  const [activeView, setActiveView] = useState('owner');

  const [filterStore, setFilterStore] = useState('All');
  const [filterMarketplace, setFilterMarketplace] = useState('All');
  const [startDate, setStartDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('2025-11-30');

  const [detailTab, setDetailTab] = useState('pesanan');
  const [showModal, setShowModal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [refreshingStatus, setRefreshingStatus] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // State baru untuk mode scan
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'manual'

  // State untuk waktu terakhir cek resi massal
  const [lastBulkCheckToko, setLastBulkCheckToko] = useState(null);
  const [lastBulkCheckPengiriman, setLastBulkCheckPengiriman] = useState(null);

  // Handler untuk cek resi massal di halaman detail toko
  const handleBulkCheckToko = () => {
    setLastBulkCheckToko(new Date());
    // TODO: Implementasi logika cek resi massal
    console.log('Cek resi massal untuk toko:', selectedOrderIds);
  };

  // Handler untuk cek resi massal di halaman pengiriman
  const handleBulkCheckPengiriman = () => {
    setLastBulkCheckPengiriman(new Date());
    // TODO: Implementasi logika cek resi massal
    console.log('Cek resi massal untuk pengiriman:', selectedShippingIds);
  };

  // Format waktu untuk ditampilkan
  const formatLastCheckTime = (date) => {
    if (!date) return null;
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Data Mock Updated with store info for filtering
  const stores = [
    {
      id: 1,
      name: 'Sazime Official Store',
      platform: 'Shopee',
      totalOrders: 450,
      totalSetoran: 12500000,
      omset: 65000000,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sazime Woodwork',
      platform: 'TikTok Shop',
      totalOrders: 320,
      totalSetoran: 8200000,
      omset: 42000000,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Sazime Second Store',
      platform: 'Shopee',
      totalOrders: 110,
      totalSetoran: 2100000,
      omset: 12000000,
      status: 'Inactive',
    },
  ];

  const mockOrders = [
    {
      id: '251101K28MAGVY',
      storeName: 'Sazime Official Store',
      platform: 'Shopee',
      status: 'Selesai',
      resi: 'SPXID05015085787B',
      jasaKirim: 'Reguler (Cashless)-SPX Standard',
      kurirStatus: 'Tiba di Tujuan',
      produk: 'Sangkar Murai No 1 - Sazime Original',
      variasi: 'No. 1 - (6cm)',
      jumlah: 1,
      totalBayar: 245000,
      setoran: 200000,
      waktuSelesai: '2025-12-20 19:39',
      username: 'customer_shopee_01',
      namaPenerima: 'R******h',
      noTelepon: '******70',
      alamat: 'Jalan Pendidikan Gang Jawa, RT.4/RW.2, Dusun Jawa, Sambas',
      kota: 'KAB. SAMBAS',
      provinsi: 'KALIMANTAN BARAT',
      metodePembayaran: 'COD (Bayar di Tempat)',
      waktuDibuat: '2025-11-03 23:59',
      catatan: 'Packing kayu ya kak',
    },
    {
      id: '251126R2SVSYNX',
      storeName: 'Sazime Woodwork',
      platform: 'TikTok Shop',
      status: 'Selesai',
      resi: 'SPXID05704205283B',
      jasaKirim: 'Hemat Kargo-SPX Hemat',
      kurirStatus: 'Dalam Perjalanan',
      produk: '(GROSIR 1 PACK) Cangkir Cepuk Pakan Mika',
      variasi: 'Segi 8 Bening',
      jumlah: 3,
      totalBayar: 180000,
      setoran: 150000,
      waktuSelesai: '2025-12-21 10:40',
      username: 'grosir_bird_shop',
      namaPenerima: 'Budi Santoso',
      noTelepon: '08123456789',
      alamat: 'Jl. Merdeka No 45',
      kota: 'SURABAYA',
      provinsi: 'JAWA TIMUR',
      metodePembayaran: 'ShopeePay',
      waktuDibuat: '2025-11-26 10:40',
      catatan: 'Warna campur gan',
    },
  ];

  const products = [
    {
      id: 1,
      name: 'Sangkar Murai No 1',
      sku: 'SKR-M01',
      stock: 45,
      hargaSetoran: 350000,
    },
    {
      id: 2,
      name: 'Sangkar Kotak Jati',
      sku: 'SKR-K02',
      stock: 12,
      hargaSetoran: 210000,
    },
  ];

  const setoranTrendData = [
    { name: '1 Nov', setoran: 4500000 },
    { name: '10 Nov', setoran: 5200000 },
    { name: '20 Nov', setoran: 4800000 },
    { name: '30 Nov', setoran: 6100000 },
  ];

  // Filtering Logic for Orders
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      // Basic date filter logic (simplified for string comparison)
      const orderDate = order.waktuDibuat.split(' ')[0]; // Extract YYYY-MM-DD
      const isDateInRange =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      const isStoreMatch =
        filterStore === 'All' || order.storeName === filterStore;
      const isPlatformMatch =
        filterMarketplace === 'All' || order.platform === filterMarketplace;

      return isDateInRange && isStoreMatch && isPlatformMatch;
    });
  }, [mockOrders, startDate, endDate, filterStore, filterMarketplace]);

  const filteredData = useMemo(() => {
    let result = stores;
    if (filterStore !== 'All')
      result = result.filter((s) => s.name === filterStore);
    if (filterMarketplace !== 'All')
      result = result.filter((s) => s.platform === filterMarketplace);
    return result;
  }, [filterStore, filterMarketplace, stores]);

  const totalSetoranGlobal = useMemo(
    () => filteredData.reduce((acc, curr) => acc + curr.totalSetoran, 0),
    [filteredData]
  );

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setActiveMenu('toko-detail');
  };

  const handleShowOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowModal('order-detail');
  };

  const handleAddStore = () => {
    setShowModal('add-store');
  };

  const toggleSelectOrder = (id) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((oid) => oid !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === mockOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(mockOrders.map((o) => o.id));
    }
  };

  // --- HALAMAN KONTEN ---

  const DashboardContent = () => (
    <div className="space-y-6">
      <FilterBar
        filterStore={filterStore}
        setFilterStore={setFilterStore}
        filterMarketplace={filterMarketplace}
        setFilterMarketplace={setFilterMarketplace}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        stores={stores}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-200 hover:shadow-lg transition-all duration-300">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Setoran Riil Filtered
          </p>
          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mt-1">
            Rp {totalSetoranGlobal.toLocaleString()}
          </h3>
          <div className="mt-4 flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4 mr-1" /> +12.4%
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-200 hover:shadow-lg transition-all duration-300">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Total Pesanan Filtered
          </p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">
            {filteredData.reduce((acc, curr) => acc + curr.totalOrders, 0)}
          </h3>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            Periode Terpilih
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-200 hover:shadow-lg transition-all duration-300">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Total Toko/Marketplace
          </p>
          <h3 className="text-3xl font-black text-blue-600 mt-1">
            {stores.length}
          </h3>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Update Resi: 10m lalu
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-slate-200 hover:shadow-lg transition-all duration-300">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Rata-rata Keranjang
          </p>
          <h3 className="text-3xl font-black text-amber-500 mt-1">Rp 145rb</h3>
          <p className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            Per Transaksi
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border shadow-sm border-slate-200">
        <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight italic">
          Grafik Pertumbuhan Setoran
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={setoranTrendData}>
              <defs>
                <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="setoran"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSetoran)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const TokoDetailContent = () => (
    <div className="space-y-6">
      <button
        onClick={() => setActiveMenu('toko')}
        className="flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Toko
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {selectedStore?.name}
            </h3>
            <p className="text-sm text-slate-500 uppercase font-black text-[10px] tracking-widest">
              {selectedStore?.platform}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowModal('import')}
            className="flex items-center px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black hover:bg-slate-200 transition border border-slate-200 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Import
            Excel
          </button>
          <button
            onClick={() => setShowModal('harga-setoran')}
            className="flex items-center px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition shadow-lg shadow-slate-200"
          >
            <Edit3 className="w-4 h-4 mr-2 text-blue-400" /> Input Harga Setoran
          </button>
        </div>
      </div>

      <FilterBar
        showStore={false}
        showMarketplace={false}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden border-slate-200">
        <div className="p-1 px-4 border-b bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex space-x-1 py-2">
            <button
              onClick={() => setDetailTab('pesanan')}
              className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition ${
                detailTab === 'pesanan'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Data Pesanan
            </button>
            <button
              onClick={() => setDetailTab('barang')}
              className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition ${
                detailTab === 'barang'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Data Barang
            </button>
          </div>
          <div className="flex items-center gap-2">
            {selectedOrderIds.length > 0 && detailTab === 'pesanan' && (
              <button
                onClick={handleBulkCheckToko}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl animate-in fade-in zoom-in hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-3 h-3 mr-2" /> Cek Resi Massal (
                {selectedOrderIds.length})
              </button>
            )}
            {detailTab === 'pesanan' && (
              <span className="text-[10px] text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                {lastBulkCheckToko ? (
                  <>Terakhir cek: {formatLastCheckTime(lastBulkCheckToko)}</>
                ) : (
                  <>Belum pernah dicek</>
                )}
              </span>
            )}
          </div>
        </div>

        {detailTab === 'pesanan' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="px-4 py-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="hover:text-blue-600"
                    >
                      {selectedOrderIds.length === mockOrders.length ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4">No. Pesanan</th>
                  <th className="px-6 py-4">Nama Produk</th>
                  <th className="px-6 py-4">Status Kurir</th>
                  <th className="px-6 py-4">Total Bayar</th>
                  <th className="px-6 py-4">Setoran</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-900 font-bold">
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-slate-50/80 transition group ${
                      selectedOrderIds.includes(order.id) ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleSelectOrder(order.id)}
                        className={
                          selectedOrderIds.includes(order.id)
                            ? 'text-blue-600'
                            : 'text-slate-300'
                        }
                      >
                        {selectedOrderIds.includes(order.id) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span
                          className="font-bold text-slate-800 text-xs truncate"
                          title={order.produk}
                        >
                          {order.produk}
                        </span>
                        <span className="text-[10px] text-slate-500 italic">
                          {order.variasi} (x{order.jumlah})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] ${
                          order.kurirStatus.includes('Update')
                            ? 'text-emerald-600'
                            : 'text-blue-500'
                        }`}
                      >
                        {order.kurirStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black">
                      Rp {order.totalBayar.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-emerald-600 font-black">
                      Rp {order.setoran.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleShowOrderDetail(order)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition shadow-sm"
                        title="Cek Resi Individu"
                      >
                        <ScanLine className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="px-6 py-4">Nama Barang</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4 text-right">Harga Setoran</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{p.sku}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">
                      Rp {p.hargaSetoran.toLocaleString()}
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

  const CekResiContent = () => (
    <div className="max-w-xl mx-auto space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">
          Validasi Resi
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Scan barcode atau input manual untuk validasi.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        {/* Custom Tab Switcher */}
        <div className="flex p-2 bg-slate-50 m-2 rounded-2xl">
          <button
            onClick={() => setScanMode('camera')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              scanMode === 'camera'
                ? 'bg-white shadow text-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center justify-center">
              <QrCode className="w-4 h-4 mr-2" /> Scanner
            </div>
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              scanMode === 'manual'
                ? 'bg-white shadow text-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center justify-center">
              <Keyboard className="w-4 h-4 mr-2" /> Input Manual
            </div>
          </button>
        </div>

        <div className="p-2">
          {scanMode === 'camera' ? (
            <div
              className="relative aspect-[3/4] bg-slate-900 rounded-[2rem] overflow-hidden shadow-inner flex flex-col items-center justify-center text-white space-y-4 group cursor-pointer m-2"
              onClick={() => setIsCameraOpen(!isCameraOpen)}
            >
              {isCameraOpen ? (
                <>
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1586769852044-692d6e671f85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center grayscale"></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[80%] h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-[scan_2s_linear_infinite]"></div>

                  <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/80 rounded-tl-lg"></div>
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/80 rounded-tr-lg"></div>
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/80 rounded-bl-lg"></div>
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/80 rounded-br-lg"></div>

                  <div className="z-10 text-center">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full mb-3 inline-block">
                      <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-xs font-bold tracking-widest uppercase text-white/80">
                      Scanning...
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCameraOpen(false);
                    }}
                    className="absolute bottom-8 px-6 py-2 bg-slate-800/80 backdrop-blur text-white rounded-full text-xs font-bold border border-white/10 hover:bg-red-600/80 transition"
                  >
                    Stop Camera
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition border border-white/20 shadow-lg">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-bold text-xs tracking-widest uppercase opacity-70">
                    Ketuk untuk Membuka Kamera
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="py-12 px-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nomor Resi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SPXID09988..."
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-mono font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-center transition placeholder:text-slate-300 uppercase"
                />
              </div>
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95">
                Validasi Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }`}</style>
    </div>
  );

  // --- COMPONENT BARU: StatusPengirimanContent ---
  const StatusPengirimanContent = () => {
    // New states for selection within this component
    const [selectedShippingIds, setSelectedShippingIds] = useState([]);

    const toggleSelectShipping = (id) => {
      if (selectedShippingIds.includes(id)) {
        setSelectedShippingIds(selectedShippingIds.filter((i) => i !== id));
      } else {
        setSelectedShippingIds([...selectedShippingIds, id]);
      }
    };

    const toggleSelectAllShipping = () => {
      if (selectedShippingIds.length === filteredOrders.length) {
        setSelectedShippingIds([]);
      } else {
        setSelectedShippingIds(filteredOrders.map((o) => o.id));
      }
    };

    const handleBulkCheckPengirimanLocal = () => {
      setLastBulkCheckPengiriman(new Date());
      // TODO: Implementasi logika cek resi massal
      console.log('Cek resi massal untuk pengiriman:', selectedShippingIds);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">
                Status Pengiriman
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pantau pergerakan paket secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {selectedShippingIds.length > 0 && (
              <button
                onClick={handleBulkCheckPengirimanLocal}
                className="flex items-center px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl animate-in fade-in zoom-in shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-3 h-3 mr-2" /> Cek Resi Masal (
                {selectedShippingIds.length})
              </button>
            )}
            <span className="text-[10px] text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
              {lastBulkCheckPengiriman ? (
                <>
                  Terakhir cek: {formatLastCheckTime(lastBulkCheckPengiriman)}
                </>
              ) : (
                <>Belum pernah dicek</>
              )}
            </span>
            <div className="relative flex-1 md:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Resi / Order ID..."
                className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* FilterBar untuk Status Pengiriman */}
        <FilterBar
          filterStore={filterStore}
          setFilterStore={setFilterStore}
          filterMarketplace={filterMarketplace}
          setFilterMarketplace={setFilterMarketplace}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          stores={stores}
        />

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b">
                <tr>
                  <th className="px-4 py-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAllShipping}
                      className="hover:text-blue-600"
                    >
                      {selectedShippingIds.length > 0 &&
                      selectedShippingIds.length === filteredOrders.length ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4">No. Pesanan</th>
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">Barang</th>
                  <th className="px-6 py-4">Jasa Kirim</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-900 font-bold">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-slate-50 transition ${
                      selectedShippingIds.includes(order.id)
                        ? 'bg-blue-50/50'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleSelectShipping(order.id)}
                        className={
                          selectedShippingIds.includes(order.id)
                            ? 'text-blue-600'
                            : 'text-slate-300'
                        }
                      >
                        {selectedShippingIds.includes(order.id) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {order.waktuDibuat}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="truncate" title={order.produk}>
                          {order.produk}
                        </span>
                        <span className="text-[10px] text-slate-400 italic">
                          {order.variasi}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center">
                        <Truck className="w-3 h-3 mr-1 text-slate-400" />
                        {order.jasaKirim}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 ml-4 block">
                        {order.resi}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase px-2 py-1 rounded-md border ${
                          order.kurirStatus.includes('Tiba')
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-blue-50 text-blue-600 border-blue-100'
                        }`}
                      >
                        {order.kurirStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleShowOrderDetail(order)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-slate-400 text-xs italic"
                    >
                      Tidak ada data pengiriman yang sesuai dengan filter.
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

  const PengaturanContent = () => (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-0">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-sm">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">
                Integrasi API Resi
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Hubungkan layanan pelacakan Binderbyte
              </p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition uppercase tracking-widest">
            Simpan API Key
          </button>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Binderbyte API Key
              </label>
              <input
                type="password"
                placeholder="Masukkan API Key 64 karakter..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: User,
            label: 'Setting Profil',
            desc: 'Ubah logo, nama, dan alamat pusat.',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex items-start space-x-4"
          >
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition shadow-sm">
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-800 tracking-tight uppercase italic">
                {item.label}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {item.desc}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 self-center group-hover:translate-x-1 transition" />
          </div>
        ))}
      </div>
    </div>
  );

  const RekapSetoranContent = () => (
    <div className="space-y-6 text-slate-900 font-medium">
      <div className="bg-slate-900 text-white p-8 rounded-[3rem] relative overflow-hidden transition-all shadow-xl shadow-slate-200">
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-1">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Pusat Informasi Dana
              </p>
              <h3 className="text-4xl font-black tracking-tighter uppercase italic">
                Rekap Setoran
              </h3>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] backdrop-blur-md border border-white/10 text-right shadow-inner">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                Dana Wajib Setor
              </p>
              <h4 className="text-4xl font-black text-emerald-400 tracking-tight">
                Rp {totalSetoranGlobal.toLocaleString()}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
            <div className="md:col-span-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">
                Pilih Toko
              </label>
              <select
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl outline-none border-none text-xs mt-1 appearance-none cursor-pointer"
              >
                <option value="All">Semua Toko</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">
                  Dari Waktu
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl outline-none border-none text-xs mt-1"
                />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">
                  Sampai Waktu
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl outline-none border-none text-xs mt-1"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowModal('export')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 px-4 rounded-2xl transition flex items-center justify-center uppercase text-[10px] tracking-widest shadow-lg shadow-blue-900/50"
              >
                <Share2 className="w-4 h-4 mr-2" /> Export
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -translate-y-32 translate-x-32"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b bg-slate-50/50">
          <h4 className="font-black text-slate-800 tracking-tight italic uppercase">
            Detail Performa Setoran
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
              <tr>
                <th className="px-8 py-5">Nama Toko</th>
                <th className="px-8 py-5">Marketplace</th>
                <th className="px-8 py-5">Total Setoran</th>
                <th className="px-8 py-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm text-slate-900 font-bold">
              {filteredData.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50 transition cursor-pointer"
                >
                  <td className="px-8 py-5 font-black uppercase tracking-tight">
                    {t.name}
                  </td>
                  <td className="px-8 py-5 uppercase font-black tracking-tighter">
                    {t.platform}
                  </td>
                  <td className="px-8 py-5 font-black text-emerald-600 tracking-tight">
                    Rp {t.totalSetoran.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => setShowModal('store-orders')}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm hover:bg-blue-100 transition"
                    >
                      Lihat List
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center text-slate-400 font-black uppercase italic tracking-widest opacity-30"
                  >
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TokoContent = ({ stores, onStoreClick, onAddStore }) => (
    <div className="space-y-6 text-slate-900 font-bold">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black tracking-tight italic uppercase text-slate-800">
          Daftar Toko
        </h3>
        <button
          onClick={onAddStore}
          className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Toko
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((toko) => (
          <div
            key={toko.id}
            onClick={() => onStoreClick(toko)}
            className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group border-b-4 border-b-transparent hover:border-b-blue-600"
          >
            <div
              className={`absolute top-0 right-0 p-1 px-4 text-[10px] font-black uppercase rounded-bl-2xl shadow-sm ${
                toko.platform === 'Shopee'
                  ? 'bg-orange-500 text-white'
                  : 'bg-black text-white'
              }`}
            >
              {toko.platform}
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition shadow-sm">
                <Store className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 tracking-tight uppercase italic group-hover:text-blue-600 transition">
                  {toko.name}
                </h4>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 tracking-widest border border-emerald-100">
                  {toko.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition shadow-inner">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Order
                </p>
                <p className="text-xl font-black text-slate-800 tracking-tighter">
                  {toko.totalOrders}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition shadow-inner">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Setoran
                </p>
                <p className="text-xl font-black text-emerald-600 tracking-tighter">
                  Rp {(toko.totalSetoran / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Card Tambah Toko */}
        <button
          onClick={onAddStore}
          className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-300 p-6 shadow-sm hover:shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[200px]"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition border border-slate-100">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
          </div>
          <h4 className="font-black text-slate-400 tracking-tight uppercase group-hover:text-blue-600 transition text-sm tracking-widest">
            Tambah Toko Baru
          </h4>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col relative">
        <TopBar
          activeMenu={activeMenu}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <main className="p-6 md:p-8 flex-1 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full">
          {activeMenu === 'dashboard' && <DashboardContent />}
          {activeMenu === 'toko' && (
            <TokoContent
              stores={stores}
              onStoreClick={handleStoreClick}
              onAddStore={handleAddStore}
            />
          )}
          {activeMenu === 'toko-detail' && <TokoDetailContent />}
          {activeMenu === 'status-pengiriman' && <StatusPengirimanContent />}
          {activeMenu === 'cek-resi' && <CekResiContent />}
          {activeMenu === 'rekap-setoran' && <RekapSetoranContent />}
          {activeMenu === 'pengaturan' && <PengaturanContent />}
        </main>
      </div>
      <BottomNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {showModal && (
        <Modal
          title={
            showModal === 'import'
              ? 'Import Data Shopee'
              : showModal === 'export'
              ? 'Ekspor Laporan'
              : showModal === 'harga-setoran'
              ? 'Update Harga Setoran'
              : showModal === 'store-orders'
              ? 'List Pesanan Toko'
              : showModal === 'add-store'
              ? 'Tambah Toko Baru'
              : 'Detail Pesanan Lengkap'
          }
          type={showModal}
          data={selectedOrder}
          products={products}
          onClose={() => {
            setShowModal(null);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default App;
