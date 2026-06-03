import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HelpGuideModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('peran');

  if (!isOpen) return null;

  const currentRole = user?.role || 'Kasir';

  // Role permissions checklist
  const permissions = {
    Owner: [
      { name: 'Transaksi Kasir (POS)', allowed: true },
      { name: 'Tambah Barang Baru', allowed: true },
      { name: 'Edit & Hapus Barang', allowed: true },
      { name: 'Tambah & Bayar Utang', allowed: true },
      { name: 'Hapus Catatan Utang', allowed: true },
      { name: 'Manajemen Pengguna (User)', allowed: true },
    ],
    Manager: [
      { name: 'Transaksi Kasir (POS)', allowed: true },
      { name: 'Tambah Barang Baru', allowed: true },
      { name: 'Edit & Hapus Barang', allowed: true },
      { name: 'Tambah & Bayar Utang', allowed: true },
      { name: 'Hapus Catatan Utang', allowed: true },
      { name: 'Manajemen Pengguna (User)', allowed: false, note: 'Hanya diakses Owner' },
    ],
    Kasir: [
      { name: 'Transaksi Kasir (POS)', allowed: true },
      { name: 'Tambah Barang Baru', allowed: true },
      { name: 'Edit & Hapus Barang', allowed: false, note: 'Butuh akses Manager/Owner' },
      { name: 'Tambah & Bayar Utang', allowed: true },
      { name: 'Hapus Catatan Utang', allowed: false, note: 'Butuh akses Manager/Owner' },
      { name: 'Manajemen Pengguna (User)', allowed: false, note: 'Hanya diakses Owner' },
    ]
  };

  const activePermissions = permissions[currentRole] || permissions['Kasir'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-outline-variant animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">help</span>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Panduan & Bantuan Sistem</h2>
              <p className="text-xs text-on-surface-variant">Penjelasan cara kerja dan fungsi tombol WarungPOS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-variant text-on-surface-variant rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant bg-surface-container-lowest overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('peran')}
            className={`flex-1 min-w-[120px] py-3 text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'peran'
                ? 'border-primary text-primary bg-surface-container-low/30'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">badge</span>
            Hak Akses Anda
          </button>
          <button
            onClick={() => setActiveTab('kasir')}
            className={`flex-1 min-w-[120px] py-3 text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'kasir'
                ? 'border-primary text-primary bg-surface-container-low/30'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
            Kasir (POS)
          </button>
          <button
            onClick={() => setActiveTab('inventaris')}
            className={`flex-1 min-w-[120px] py-3 text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'inventaris'
                ? 'border-primary text-primary bg-surface-container-low/30'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            Inventaris
          </button>
          <button
            onClick={() => setActiveTab('utang')}
            className={`flex-1 min-w-[120px] py-3 text-center text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'utang'
                ? 'border-primary text-primary bg-surface-container-low/30'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/20'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Utang & Kontak
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: PERAN & HAK AKSES */}
          {activeTab === 'peran' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  {user?.full_name?.charAt(0).toUpperCase() || 'K'}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{user?.full_name || 'Staf Kasir'}</h4>
                  <p className="text-xs text-on-surface-variant">Username: @{user?.username || 'kasir'}</p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary text-on-primary font-bold text-[10px] uppercase rounded-full tracking-wider shadow-sm">
                    {currentRole}
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Wewenang Fitur Anda:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activePermissions.map((perm) => (
                    <div 
                      key={perm.name}
                      className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                        perm.allowed 
                          ? 'bg-surface-container-lowest border-outline-variant/50' 
                          : 'bg-error/5 border-error/20 opacity-70'
                      }`}
                    >
                      <span className={`material-symbols-outlined shrink-0 text-[20px] ${perm.allowed ? 'text-primary' : 'text-error'}`}>
                        {perm.allowed ? 'check_circle' : 'cancel'}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface leading-tight">{perm.name}</p>
                        {!perm.allowed && (
                          <p className="text-[10px] text-error font-medium mt-0.5">{perm.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KASIR (POS) */}
          {activeTab === 'kasir' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-on-surface">Panduan Transaksi Kasir</h4>
                <p className="text-xs text-on-surface-variant">Langkah melayani transaksi belanja pelanggan secara cepat.</p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Mode Grosir */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">sell</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Mode Harga Grosir (Toggle)</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Aktifkan sakelar/toggle **Mode Harga Grosir** di atas daftar keranjang jika pelanggan membeli grosir. Sistem akan otomatis menerapkan harga grosir untuk produk yang mendukung.
                    </p>
                  </div>
                </div>

                {/* Scan Barcode */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">barcode_scanner</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Pencarian & Barcode Scan</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Gunakan kolom input pencarian untuk mengetikkan nama barang, SKU, atau langsung hubungkan scanner barcode ke komputer untuk mencari barang secara otomatis.
                    </p>
                  </div>
                </div>

                {/* Metode Bayar */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-error/10 text-error rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Pilihan Pembayaran Lengkap</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Sistem mendukung pembayaran **Tunai** (dengan bantuan hitung kembalian & tombol cepat), **QRIS** (kode QR untuk e-wallet), **Transfer Bank** (dengan copy rekening), dan **Hutang** (bon belanja jatuh tempo).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVENTARIS */}
          {activeTab === 'inventaris' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-on-surface">Panduan Mengelola Inventaris</h4>
                <p className="text-xs text-on-surface-variant">Menyusun katalog dan memantau stok warung Anda.</p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Tambah Barang */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Skema Multi-Harga & Satuan</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Saat menginput barang baru, Anda wajib mengisi **Harga Modal** (untuk menghitung laba kotor), **Harga Eceran** (penjualan standar), dan **Harga Grosir** (potongan harga). Tentukan juga satuannya (Pcs/Box/Dus/Liter/Kg).
                    </p>
                  </div>
                </div>

                {/* Filter Peringatan */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-error/10 text-error rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">warning</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Penyaringan Stok Menipis</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Jika stok berada di bawah batas **Minimum Stok**, sistem memberi sinyal merah. Ketuk kartu **Stok Menipis** di bagian atas halaman untuk menampilkan barang-barang yang hampir habis secara instan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UTANG & KONTAK */}
          {activeTab === 'utang' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-on-surface">Panduan Manajemen Utang</h4>
                <p className="text-xs text-on-surface-variant">Melacak dan memproses pembayaran utang/bon pelanggan.</p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Detail Pelanggan */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">info</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Tombol Detail Pelanggan</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Tekan tombol **Detail** di aksi tabel utang untuk membuka rincian utang, sisa tagihan, tanggal jatuh tempo, serta catatan pribadi berupa **Alamat Lengkap** dan **Nomor WhatsApp** pelanggan.
                    </p>
                  </div>
                </div>

                {/* Bayar Utang */}
                <div className="flex gap-4 p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/60">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 h-10 w-10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">price_check</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-on-surface uppercase tracking-wide">Pembayaran Utang Bertahap</h5>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Tekan tombol **Bayar** lalu ketikkan jumlah cicilan uang yang dibayar. Sistem mendukung pencatatan pembayaran sebagian (mencicil) hingga lunas secara otomatis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end bg-surface-container-lowest">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
