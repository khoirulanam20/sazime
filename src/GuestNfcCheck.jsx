import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ScanLine, Cpu, CheckCircle2, AlertCircle, Loader2, Mail, UserPlus,
} from 'lucide-react'

const LS_NFC_CHIPS = 'sazime_nfc_chips'
const LS_REG_PENDING = 'sazime_pemilik_reg_pending'
const LS_PELANGGAN_SANGKAR = 'sazime_pelanggan_sangkar'

function formatVerivicationIdDisplay(digits10) {
  const s = digits10 != null ? String(digits10) : ''
  if (s.length !== 10 || !/^\d{10}$/.test(s)) return s || '—'
  return `${s.slice(0, 2)} ${s.slice(2, 5)} ${s.slice(5)}`
}

function formatTanggalVerivication(str) {
  if (!str) return '—'
  try {
    return new Date(`${str}T12:00:00`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return str
  }
}

function toCapsField(v) {
  return String(v ?? '').toUpperCase()
}

function normalizeGmailInput(v) {
  return String(v ?? '').trim().toLowerCase().replace(/\s/g, '')
}

function isValidGmailAddress(email) {
  const e = normalizeGmailInput(email)
  return /^[a-z0-9][a-z0-9._+-]*@gmail\.com$/i.test(e)
}

function migrateChip(c) {
  const gmail = c.gmail_pemilik != null && String(c.gmail_pemilik).trim()
    ? normalizeGmailInput(c.gmail_pemilik)
    : ''
  let pemilik_terkonfirmasi = c.pemilik_terkonfirmasi
  if (pemilik_terkonfirmasi === undefined) {
    pemilik_terkonfirmasi = !!(gmail || (c.nama_pemilik && String(c.nama_pemilik).trim()))
  }
  return {
    ...c,
    alamat_pemilik: c.alamat_pemilik ?? '',
    gmail_pemilik: gmail,
    pemilik_terkonfirmasi,
    tanggal_verivication_id: c.tanggal_verivication_id || c.tanggal_registrasi || '',
  }
}

const GUEST_NFC_CHIPS_FALLBACK = [
  {
    id: 1, id_nfc: '1234567890', id_produk: 'SK-001', nama_produk: 'Sangkar Murai No 1 Original',
    deskripsi_produk: 'Sangkar murai kayu jati ukiran', nama_pemilik: 'SAZIME OFFICIAL',
    alamat_pemilik: 'JL. KENARI NO 1, JAKARTA',
    gmail_pemilik: 'demo.official.sazime@gmail.com',
    pemilik_terkonfirmasi: true,
    tanggal_pembuatan: '2026-01-15', nomor_seri: 'SER-001-2026',
    tanggal_registrasi: '2026-02-01', gambar: [],
    kategori_produk: '001', verivication_id: '2600100001', tanggal_verivication_id: '2026-02-01',
  },
  {
    id: 2, id_nfc: '0987654321', id_produk: 'SK-002', nama_produk: 'Sangkar Lovebird Elegan',
    deskripsi_produk: 'Sangkar lovebird bahan stainless', nama_pemilik: 'SAZIME WOODWORK',
    alamat_pemilik: 'JL. CENDRAWASIH NO 5, BANDUNG',
    gmail_pemilik: 'demo.woodwork.sazime@gmail.com',
    pemilik_terkonfirmasi: true,
    tanggal_pembuatan: '2026-02-10', nomor_seri: 'SER-002-2026',
    tanggal_registrasi: '2026-02-15', gambar: [],
    kategori_produk: '001', verivication_id: '2600100002', tanggal_verivication_id: '2026-02-15',
  },
]

function loadGuestNfcChips() {
  try {
    const raw = localStorage.getItem(LS_NFC_CHIPS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(migrateChip)
      }
    }
  } catch { /* ignore */ }
  return GUEST_NFC_CHIPS_FALLBACK.map(migrateChip)
}

function saveGuestNfcChips(chips) {
  try {
    localStorage.setItem(LS_NFC_CHIPS, JSON.stringify(chips))
  } catch { /* ignore */ }
}

function loadPelangganSangkarGuestRaw() {
  try {
    const raw = localStorage.getItem(LS_PELANGGAN_SANGKAR)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch { /* ignore */ }
  return null
}

function savePelangganSangkarGuest(arr) {
  try {
    localStorage.setItem(LS_PELANGGAN_SANGKAR, JSON.stringify(arr))
  } catch { /* ignore */ }
}

function upsertPelangganAfterConfirm(chip) {
  const g = normalizeGmailInput(chip.gmail_pemilik || '')
  if (!g) return
  let list = loadPelangganSangkarGuestRaw()
  if (!Array.isArray(list)) list = []
  const idx = list.findIndex((x) => normalizeGmailInput(x.gmail) === g)
  const row = {
    id: idx >= 0 ? list[idx].id : Date.now(),
    nama: toCapsField(chip.nama_pemilik).trim(),
    alamat: toCapsField(chip.alamat_pemilik || '').trim(),
    gmail: g,
    terdaftar_pada: new Date().toISOString().slice(0, 10),
    sumber: 'konfirmasi_nfc',
  }
  const next = idx >= 0 ? [...list.slice(0, idx), row, ...list.slice(idx + 1)] : [...list, row]
  savePelangganSangkarGuest(next)
  window.dispatchEvent(new CustomEvent('sazime-pelanggan-updated'))
}

function loadPendingRegs() {
  try {
    return JSON.parse(localStorage.getItem(LS_REG_PENDING) || '[]')
  } catch {
    return []
  }
}

function savePendingRegs(arr) {
  localStorage.setItem(LS_REG_PENDING, JSON.stringify(arr))
}

function newRegToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
}

function findChipByScanId(chips, id10) {
  if (!id10 || !/^\d{10}$/.test(String(id10))) return null
  const s = String(id10)
  return chips.find((c) => String(c.verivication_id) === s)
    || chips.find((c) => c.id_nfc === s)
    || null
}

function processConfirmToken(token) {
  if (!token || typeof token !== 'string') {
    return { ok: false, message: 'Tautan konfirmasi tidak valid.' }
  }
  const list = loadPendingRegs()
  const p = list.find((x) => x.token === token && x.status === 'menunggu_konfirmasi')
  if (!p) {
    return { ok: false, message: 'Tautan tidak berlaku atau registrasi sudah diproses.' }
  }
  const chips = loadGuestNfcChips()
  const idx = chips.findIndex((c) => String(c.verivication_id) === String(p.verivication_id))
  if (idx < 0) {
    return { ok: false, message: 'Produk tidak ditemukan di sistem.' }
  }
  const chip = chips[idx]
  if (p.jenis === 'pindah_tangan') {
    const prev = normalizeGmailInput(p.gmail_pemilik_sebelumnya || '')
    const cur = normalizeGmailInput(chip.gmail_pemilik || '')
    if (!prev || cur !== prev) {
      return { ok: false, message: 'Data pemilik di sistem sudah berubah. Ajukan pindah tangan lagi dari halaman scan.' }
    }
  } else if (chip.pemilik_terkonfirmasi) {
    return { ok: false, message: 'Pemilik pertama untuk produk ini sudah terkonfirmasi.' }
  }
  const nextChip = {
    ...chip,
    nama_pemilik: p.nama_pemilik_baru,
    alamat_pemilik: p.alamat_pemilik_baru,
    gmail_pemilik: normalizeGmailInput(p.gmail_pemilik_baru),
    pemilik_terkonfirmasi: true,
  }
  const nextChips = [...chips.slice(0, idx), nextChip, ...chips.slice(idx + 1)]
  saveGuestNfcChips(nextChips)
  upsertPelangganAfterConfirm(nextChip)
  savePendingRegs(list.map((x) => (x.token === token ? { ...x, status: 'selesai' } : x)))
  return {
    ok: true,
    message: 'Registrasi pemilik berhasil dikonfirmasi.',
    verivication_id: p.verivication_id,
  }
}

function extractScanIdFromString(str) {
  if (!str || typeof str !== 'string') return null
  const trimmed = str.trim()
  const fromParams = (search) => {
    try {
      const q = search.startsWith('?') ? search : `?${search}`
      const params = new URLSearchParams(q)
      const vid = params.get('vid') || params.get('verivication_id')
      if (vid && /^\d{10}$/.test(vid)) return vid
    } catch { /* ignore */ }
    return null
  }
  const mParam = trimmed.match(/[?&]vid=(\d{10})(?:&|$)/)
  if (mParam) return mParam[1]
  const mParam2 = trimmed.match(/[?&]verivication_id=(\d{10})(?:&|$)/)
  if (mParam2) return mParam2[1]

  const urlLike = trimmed.match(/\bhttps?:\/\/[^\s]+/i)
  if (urlLike) {
    try {
      const u = new URL(urlLike[0])
      const vid = u.searchParams.get('vid') || u.searchParams.get('verivication_id')
      if (vid && /^\d{10}$/.test(vid)) return vid
    } catch { /* ignore */ }
  }

  try {
    const u = new URL(trimmed)
    const vid = u.searchParams.get('vid') || u.searchParams.get('verivication_id')
    if (vid && /^\d{10}$/.test(vid)) return vid
  } catch { /* ignore */ }

  const idxQ = trimmed.indexOf('?')
  if (idxQ >= 0) {
    const v = fromParams(trimmed.slice(idxQ))
    if (v) return v
  }

  const digits = trimmed.replace(/\D/g, '')
  if (digits.length >= 10) return digits.slice(0, 10)
  return null
}

function collectPayloadTextFromNdefMessage(message) {
  const parts = []
  if (!message?.records) return ''
  for (const record of message.records) {
    if (!record?.data) continue
    try {
      const dec = new TextDecoder()
      const piece = dec.decode(record.data)
      if (piece) parts.push(piece)
    } catch {
      // ignore
    }
  }
  return parts.join(' ').trim()
}

function OwnerRegistrationForm({ chip, mode }) {
  const [nama, setNama] = useState('')
  const [alamat, setAlamat] = useState('')
  const [gmail, setGmail] = useState('')
  const [error, setError] = useState('')
  const [sentDemo, setSentDemo] = useState(null)

  const handleSubmit = () => {
    setError('')
    const n = toCapsField(nama).trim()
    const a = toCapsField(alamat).trim()
    const g = normalizeGmailInput(gmail)
    if (!n || !a || !g) {
      setError('Nama, alamat, dan Gmail wajib diisi.')
      return
    }
    if (!isValidGmailAddress(g)) {
      setError('Gunakan alamat Gmail aktif (contoh: namaanda@gmail.com).')
      return
    }
    const pendingAll = loadPendingRegs()
    const dup = pendingAll.some(
      (p) => p.status === 'menunggu_konfirmasi' && String(p.verivication_id) === String(chip.verivication_id),
    )
    if (dup) {
      setError('Masih ada pendaftaran menunggu konfirmasi email untuk produk ini.')
      return
    }

    const token = newRegToken()
    const prevGmail = mode === 'pindah_tangan' ? normalizeGmailInput(chip.gmail_pemilik || '') : ''
    if (mode === 'pindah_tangan' && !prevGmail) {
      setError('Pemilik sebelumnya belum memiliki Gmail terdaftar. Hubungi Sazime.')
      return
    }

    const emailPenerima = mode === 'pembelian_pertama' ? g : prevGmail

    const row = {
      id: Date.now(),
      token,
      verivication_id: String(chip.verivication_id),
      nama_pemilik_baru: n,
      alamat_pemilik_baru: a,
      gmail_pemilik_baru: g,
      jenis: mode === 'pembelian_pertama' ? 'pembelian_pertama' : 'pindah_tangan',
      email_penerima_konfirmasi: emailPenerima,
      gmail_pemilik_sebelumnya: mode === 'pindah_tangan' ? prevGmail : null,
      status: 'menunggu_konfirmasi',
      dibuat_pada: new Date().toISOString(),
    }
    pendingAll.push(row)
    savePendingRegs(pendingAll)

    const demoUrl = `${window.location.origin}/ceknfc?confirm=${encodeURIComponent(token)}`
    setSentDemo({
      demoUrl,
      emailPenerima,
      mode,
    })
  }

  if (sentDemo) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-emerald-900 uppercase tracking-wide text-xs">Email konfirmasi dikirim</p>
            {sentDemo.mode === 'pembelian_pertama' ? (
              <p className="text-xs text-emerald-800 font-medium mt-1">
                Sazime mengirim permintaan konfirmasi ke <span className="font-mono font-bold">{sentDemo.emailPenerima}</span>.
                Setelah Anda membuka tautan di email dan mengonfirmasi, data pemilik terdaftar di sistem.
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-medium mt-1">
                Tautan konfirmasi dikirim ke Gmail pemilik sebelumnya <span className="font-mono font-bold">{sentDemo.emailPenerima}</span>.
                Setelah beliau mengonfirmasi, Anda terdaftar sebagai pemilik baru — <span className="font-black">Sazime tidak perlu menyetujui</span>.
              </p>
            )}
            <p className="text-[10px] text-emerald-700/90 font-bold mt-2 uppercase tracking-wider">Simulasi (tanpa server email)</p>
            <p className="text-[11px] break-all font-mono bg-white/80 rounded-lg p-2 border border-emerald-100 mt-1">{sentDemo.demoUrl}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-slate-800">
        <UserPlus className="w-4 h-4 text-red-600 shrink-0" />
        <p className="font-black text-xs uppercase tracking-widest">
          {mode === 'pembelian_pertama' ? 'Registrasi pemilik pertama' : 'Pindah tangan — pemilik baru'}
        </p>
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
        {mode === 'pembelian_pertama'
          ? 'Isi biodata Anda. Gmail harus aktif — konfirmasi dari email setelah Sazime mengirim tautan.'
          : 'Isi biodata Anda sebagai pembeli baru. Konfirmasi dikirim ke Gmail pemilik sebelumnya; tanpa persetujuan Sazime.'}
      </p>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Nama</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(toCapsField(e.target.value))}
          placeholder="NAMA LENGKAP"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 uppercase placeholder:text-slate-300 placeholder:normal-case"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Alamat</label>
        <textarea
          value={alamat}
          onChange={(e) => setAlamat(toCapsField(e.target.value))}
          rows={2}
          placeholder="ALAMAT LENGKAP"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 resize-none uppercase placeholder:text-slate-300 placeholder:normal-case"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Gmail (aktif)</label>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={gmail}
          onChange={(e) => setGmail(normalizeGmailInput(e.target.value))}
          placeholder="nama@gmail.com"
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-red-500 lowercase"
        />
      </div>
      {error && <p className="text-xs font-bold text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3.5 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition"
      >
        Kirim &amp; minta konfirmasi email
      </button>
    </div>
  )
}

const GuestNfcCheck = () => {
  const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [scanError, setScanError] = useState('')
  const [confirmBanner, setConfirmBanner] = useState(null)
  const [showPindahForm, setShowPindahForm] = useState(false)
  const scanBusyRef = useRef(false)

  const resolveFromId = useCallback((id10) => {
    const chips = loadGuestNfcChips()
    const found = findChipByScanId(chips, id10)
    setResult(found)
    setPhase('done')
    setShowPindahForm(false)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const confirmToken = params.get('confirm')

    if (confirmToken) {
      const res = processConfirmToken(confirmToken)
      setConfirmBanner(res)
      params.delete('confirm')
      const qs = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
      if (res.ok && res.verivication_id) {
        resolveFromId(res.verivication_id)
      }
    }

    const p2 = new URLSearchParams(window.location.search)
    const vid = p2.get('vid') || p2.get('verivication_id')
    if (vid && /^\d{10}$/.test(vid)) {
      resolveFromId(vid)
    }
  }, [resolveFromId])

  const startNfcScan = async () => {
    if (scanBusyRef.current) return
    if (!nfcSupported) {
      setScanError('Perangkat atau browser ini tidak mendukung baca NFC. Gunakan Chrome di Android, atau buka halaman lewat tautan dari tag NFC (misalnya …/ceknfc?vid=2600100001).')
      return
    }
    setScanError('')
    setResult(null)
    setPhase('scanning')
    scanBusyRef.current = true

    try {
      const ndef = new window.NDEFReader()
      const onReading = ({ message }) => {
        scanBusyRef.current = false
        const payload = collectPayloadTextFromNdefMessage(message)
        const id10 = extractScanIdFromString(payload)
        if (!id10) {
          setScanError('Tag terbaca tetapi tidak berisi kode verifikasi. Pastikan tag memuat URL atau teks dengan Verivication ID (10 digit), misalnya tautan ke halaman ini dengan parameter ?vid=.')
          setPhase('idle')
          return
        }
        resolveFromId(id10)
      }
      const onReadingError = () => {
        scanBusyRef.current = false
        setScanError('Gagal membaca tag NFC. Dekatkan ponsel ke chip dan coba lagi.')
        setPhase('idle')
      }
      ndef.addEventListener('reading', onReading)
      ndef.addEventListener('readingerror', onReadingError)
      await ndef.scan()
    } catch (e) {
      scanBusyRef.current = false
      const msg = e?.name === 'NotAllowedError'
        ? 'Izin NFC ditolak atau dibatalkan.'
        : (e?.message || 'Tidak dapat memulai pembacaan NFC.')
      setScanError(msg)
      setPhase('idle')
    }
  }

  const reset = () => {
    setPhase('idle')
    setResult(null)
    setScanError('')
    setConfirmBanner(null)
    setShowPindahForm(false)
    window.history.replaceState({}, '', window.location.pathname)
  }

  const showVerified = result && result.verivication_id && /^\d{10}$/.test(String(result.verivication_id))
  const tanggalVid = showVerified
    ? (result.tanggal_verivication_id || result.tanggal_registrasi || '')
    : ''

  const perluRegistrasiPertama = showVerified && !result.pemilik_terkonfirmasi
  const pemilikSudahKonfirmasi = showVerified && result.pemilik_terkonfirmasi

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-red-100">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-sm uppercase tracking-tight">Verifikasi Sangkar Sazime</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Akses lewat scan chip NFC</p>
            </div>
          </div>
          <a href="/" className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition">
            Login
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="max-w-md mx-auto space-y-8">
          {confirmBanner && (
            <div
              className={`rounded-2xl border p-4 text-sm font-bold ${
                confirmBanner.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-100 text-red-800'
              }`}
            >
              {confirmBanner.ok ? <CheckCircle2 className="w-5 h-5 inline mr-2 align-text-bottom" /> : <AlertCircle className="w-5 h-5 inline mr-2 align-text-bottom" />}
              {confirmBanner.message}
              <button
                type="button"
                onClick={() => setConfirmBanner(null)}
                className="block mt-3 text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-800"
              >
                Tutup
              </button>
            </div>
          )}

          {phase !== 'done' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  {phase === 'scanning' ? (
                    <Loader2 className="w-7 h-7 text-red-600 animate-spin" />
                  ) : (
                    <ScanLine className="w-7 h-7 text-red-600" />
                  )}
                </div>
                <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Tempel &amp; Scan NFC</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Tanpa mengetik kode: tempel chip ke ponsel, lalu ketuk tombol di bawah. Data sangkar akan tampil otomatis jika tag memuat Verivication ID.
                </p>
              </div>

              <button
                type="button"
                onClick={startNfcScan}
                disabled={phase === 'scanning'}
                className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {phase === 'scanning' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Menunggu tag…
                  </>
                ) : (
                  <>
                    <ScanLine className="w-5 h-5" /> Scan NFC
                  </>
                )}
              </button>

              {scanError && (
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs font-bold text-amber-900">
                  {scanError}
                </div>
              )}

              {!nfcSupported && (
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  <span className="font-black text-slate-700">Tips:</span> Tag NFC idealnya diprogram dengan tautan seperti{' '}
                  <span className="font-mono text-slate-600 break-all">{`${typeof window !== 'undefined' ? window.location.origin : ''}/ceknfc?vid=2600100001`}</span>
                  {' '}sehingga pembeli cukup membuka tautan atau scan dengan ponsel yang mendukung NFC.
                </p>
              )}
            </div>
          )}

          {phase === 'done' && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
              {showVerified ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-emerald-700 text-sm uppercase tracking-widest">Produk Sazime Terverifikasi</span>
                  </div>
                  <div className="p-6 space-y-5">
                    <ul className="space-y-4 text-sm">
                      <li className="flex gap-3">
                        <span className="text-red-600 font-black shrink-0">•</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verivication ID</p>
                          <p className="font-mono font-black text-slate-900 text-lg tracking-wide mt-0.5">{formatVerivicationIdDisplay(result.verivication_id)}</p>
                          <p className="text-[11px] font-mono text-slate-500">{result.verivication_id}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-600 font-black shrink-0">•</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jenis sangkar</p>
                          <p className="font-black text-slate-900 mt-0.5">{result.nama_produk}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-red-600 font-black shrink-0">•</span>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal dibuat Verivication ID</p>
                          <p className="font-bold text-slate-900 mt-0.5">{formatTanggalVerivication(tanggalVid)}</p>
                        </div>
                      </li>
                    </ul>

                    {pemilikSudahKonfirmasi && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pemilik terkonfirmasi</p>
                        <p className="font-black text-slate-900">{result.nama_pemilik}</p>
                        <p className="text-slate-600 font-medium leading-snug">{result.alamat_pemilik || '—'}</p>
                        <p className="font-mono text-slate-700 text-[11px]">{result.gmail_pemilik || '—'}</p>
                      </div>
                    )}

                    {perluRegistrasiPertama && (
                      <OwnerRegistrationForm
                        chip={result}
                        mode="pembelian_pertama"
                      />
                    )}

                    {pemilikSudahKonfirmasi && (
                      <div className="space-y-3">
                        {!showPindahForm ? (
                          <button
                            type="button"
                            onClick={() => setShowPindahForm(true)}
                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition"
                          >
                            Saya pemilik baru (pindah tangan)
                          </button>
                        ) : (
                          <OwnerRegistrationForm
                            chip={result}
                            mode="pindah_tangan"
                          />
                        )}
                      </div>
                    )}

                    <button type="button" onClick={reset} className="w-full py-3.5 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">
                      Scan produk lain
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Data tidak ditemukan</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {result
                        ? 'Produk ini belum memiliki Verivication ID di sistem, atau chip belum terdaftar.'
                        : 'Tag tidak cocok dengan data terdaftar. Pastikan Anda membeli sangkar resmi Sazime.'}
                    </p>
                  </div>
                  <button type="button" onClick={reset} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition w-full">
                    Coba scan lagi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100">
        SAZIME HUB &mdash; Internal Management System
      </footer>
    </div>
  )
}

export default GuestNfcCheck
