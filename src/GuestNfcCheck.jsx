import { useState } from 'react'
import { ScanLine, Cpu, CheckCircle2, AlertCircle, X, Edit3 } from 'lucide-react'

const nfcChips = [
  {
    id: 1, id_nfc: '1234567890', id_produk: 'SK-001', nama_produk: 'Sangkar Murai No 1 Original',
    deskripsi_produk: 'Sangkar murai kayu jati ukiran', nama_pemilik: 'Sazime Official',
    tanggal_pembuatan: '2026-01-15', nomor_seri: 'SER-001-2026',
    tanggal_registrasi: '2026-02-01', gambar: []
  },
  {
    id: 2, id_nfc: '0987654321', id_produk: 'SK-002', nama_produk: 'Sangkar Lovebird Elegan',
    deskripsi_produk: 'Sangkar lovebird bahan stainless', nama_pemilik: 'Sazime Woodwork',
    tanggal_pembuatan: '2026-02-10', nomor_seri: 'SER-002-2026',
    tanggal_registrasi: '2026-02-15', gambar: []
  }
]

const GuestNfcCheck = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [checked, setChecked] = useState(false)

  const handleCheck = () => {
    if (input.length !== 10) return
    const found = nfcChips.find(c => c.id_nfc === input)
    setResult(found || null)
    setChecked(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-red-100">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-sm uppercase tracking-tight">Cek NFC</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Verifikasi chip NFC produk sangkar</p>
            </div>
          </div>
          <a href="/" className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
            Login
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-10">
        <div className="max-w-md mx-auto space-y-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ScanLine className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Periksa Chip NFC</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Masukkan 10 digit kode NFC untuk verifikasi</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kode NFC (10 Digit)</label>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0000000000"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-mono font-black text-center tracking-[0.5em] outline-none focus:border-red-500 focus:bg-white transition-colors"
                maxLength={10}
                onKeyDown={e => e.key === 'Enter' && handleCheck()}
              />
            </div>

            <button onClick={handleCheck} disabled={input.length !== 10} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <ScanLine className="w-5 h-5" /> Cek Sekarang
            </button>
          </div>

          {/* Result */}
          {checked && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
              {result ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-emerald-700 text-sm uppercase tracking-widest">Chip Terverifikasi</span>
                  </div>
                  <div className="p-6 space-y-5">
                    {result.gambar?.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {result.gambar.map((img, i) => (
                          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                            <img src={img} alt={`Gambar ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID NFC</p>
                        <p className="font-mono font-black text-slate-800 mt-1">{result.id_nfc}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Produk</p>
                        <p className="font-black text-slate-800 mt-1">{result.id_produk}</p>
                      </div>
                      <div className="col-span-2 bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Produk</p>
                        <p className="font-black text-slate-800 mt-1">{result.nama_produk}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemilik</p>
                        <p className="font-black text-slate-800 mt-1">{result.nama_pemilik}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No. Seri</p>
                        <p className="font-mono font-bold text-slate-800 mt-1">{result.nomor_seri || '-'}</p>
                      </div>
                      {result.deskripsi_produk && (
                        <div className="col-span-2 bg-slate-50 p-3 rounded-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi</p>
                          <p className="font-bold text-slate-600 mt-1 text-xs">{result.deskripsi_produk}</p>
                        </div>
                      )}
                      {result.tanggal_pembuatan && (
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl. Pembuatan</p>
                          <p className="font-bold text-slate-800 mt-1">{result.tanggal_pembuatan}</p>
                        </div>
                      )}
                      {result.tanggal_registrasi && (
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tgl. Registrasi</p>
                          <p className="font-bold text-slate-800 mt-1">{result.tanggal_registrasi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Chip Tidak Ditemukan</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      Kode NFC <span className="font-mono font-bold text-red-600">{input}</span> tidak terdaftar di sistem.
                    </p>
                  </div>
                  <button onClick={() => { setInput(''); setChecked(false); setResult(null); }} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
        SAZIME HUB &mdash; Internal Management System
      </footer>
    </div>
  )
}

export default GuestNfcCheck
