import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AppTour({ isOpen, onClose }) {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState(null);

  // Define steps for each page
  const tours = {
    '/dashboard': [
      {
        selector: '#tour-sidebar',
        title: 'Menu Navigasi Toko',
        content: 'Gunakan panel navigasi kiri ini untuk berpindah ke halaman Kasir, Inventaris Barang, Utang Pelanggan, atau melihat Laporan Keuangan.',
        position: 'right'
      },
      {
        selector: '#tour-db-stats',
        title: 'Statistik Ringkasan Toko',
        content: 'Di sini Anda dapat melihat omzet penjualan hari ini, piutang aktif, peringatan stok menipis, dan perkiraan laba bulanan warung Anda secara real-time.',
        position: 'bottom'
      },
      {
        selector: '#tour-db-chart',
        title: 'Grafik Mingguan',
        content: 'Melihat tren naik turunnya penjualan Anda selama 7 hari terakhir untuk menganalisis performa harian warung.',
        position: 'top'
      },
      {
        selector: '#tour-db-recent',
        title: 'Riwayat Transaksi Terakhir',
        content: 'Daftar 5 aktivitas transaksi penjualan terbaru. Kasir dapat memantau uang masuk dan metode bayar yang baru saja selesai diproses.',
        position: 'left'
      },
      {
        selector: '#tour-help',
        title: 'Pusat Bantuan & Tur',
        content: 'Jika Anda lupa fungsi tombol di halaman mana pun, klik tombol tanda tanya (?) ini untuk membuka panduan tertulis atau mengulang tur interaktif ini.',
        position: 'bottom'
      }
    ],
    '/transaksi': [
      {
        selector: '#tour-pos-search',
        title: 'Cari Barang & Scan Barcode',
        content: 'Ketik nama barang atau langsung scan barcode produk menggunakan scanner laser fisik. Barang akan otomatis terpilih.',
        position: 'bottom'
      },
      {
        selector: '#tour-pos-cats',
        title: 'Filter Kategori',
        content: 'Ketuk kategori (seperti Mie Instan, Minuman) untuk menyaring katalog produk secara instan agar transaksi lebih cepat.',
        position: 'bottom'
      },
      {
        selector: '#tour-pos-products',
        title: 'Katalog Produk & Stok',
        content: 'Daftar barang warung Anda. Cukup ketuk ikon tambah (+) atau kartu barang untuk memasukannya ke keranjang belanja.',
        position: 'top'
      },
      {
        selector: '#tour-pos-wholesale',
        title: 'Aktifkan Harga Grosir',
        content: 'Gunakan tombol sakelar ini jika ingin menerapkan harga grosir (misal pembelian lusinan) bagi pelanggan grosir.',
        position: 'left'
      },
      {
        selector: '#tour-pos-cart',
        title: 'Keranjang Belanja & Pembayaran',
        content: 'Di sini kasir dapat mengubah jumlah kuantitas barang, melihat subtotal belanja, dan menekan tombol "Proses Bayar" untuk checkout transaksi.',
        position: 'left'
      }
    ],
    '/inventaris': [
      {
        selector: '#tour-inv-add',
        title: 'Daftarkan Barang Baru',
        content: 'Klik tombol ini untuk menambah produk baru ke toko, mengunggah foto, menentukan stok awal, dan mengisi skema multi-harga (ecer/grosir).',
        position: 'bottom'
      },
      {
        selector: '#tour-inv-stats',
        title: 'Indikator Stok Menipis',
        content: 'Menampilkan total produk aktif, estimasi nilai modal stok toko, dan stok kritis. Klik kartu "Stok Menipis" berwarna merah untuk memfilter daftar barang yang harus dipesan ulang.',
        position: 'bottom'
      },
      {
        selector: '#tour-inv-filters',
        title: 'Pencarian & Filter Cepat',
        content: 'Masukkan kata kunci SKU/nama barang atau pilih kategori tertentu untuk mempermudah pengecekan stok barang di tabel.',
        position: 'bottom'
      },
      {
        selector: '#tour-inv-table',
        title: 'Tabel Stok & Harga Barang',
        content: 'Tabel ini merinci nama barang, sisa stok, satuan, harga beli, harga ecer, dan grosir. Di sebelah kanan baris, Manager/Owner dapat mengklik ikon Pensil (Edit) atau ikon Trash (Hapus) barang.',
        position: 'top'
      }
    ],
    '/utang': [
      {
        selector: '#tour-debt-add',
        title: 'Pencatatan Utang Baru',
        content: 'Catat utang bon pelanggan secara manual jika ada transaksi utang di luar kasir POS utama.',
        position: 'bottom'
      },
      {
        selector: '#tour-debt-stats',
        title: 'Ringkasan Utang Toko',
        content: 'Tinjau total piutang Anda yang belum dibayar, serta peringatan jumlah pelanggan yang menunggak dan melewati tanggal jatuh tempo.',
        position: 'bottom'
      },
      {
        selector: '#tour-debt-table',
        title: 'Tabel Piutang & Pembayaran',
        content: 'Daftar nama pengutang. Klik tombol "Detail" untuk melihat no WhatsApp/alamat lengkap, atau klik "Bayar" untuk mencatat cicilan/pelunasan uang utang.',
        position: 'top'
      }
    ]
  };

  const steps = tours[location.pathname] || [
    {
      selector: '#tour-sidebar',
      title: 'Navigasi Menu Utama',
      content: 'Gunakan sidebar di sebelah kiri ini untuk berpindah ke modul Transaksi Kasir, Inventaris Stok Barang, Manajemen Utang, atau Laporan Keuangan.',
      position: 'right'
    },
    {
      selector: '#tour-help',
      title: 'Tombol Bantuan',
      content: 'Ikon tanda tanya ini akan memandu Anda memahami fungsi-fungsi tombol dan tur visual interaktif di halaman mana saja.',
      position: 'bottom'
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!isOpen || !currentStepData) return;

    const updatePosition = () => {
      const element = document.querySelector(currentStepData.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setCoords(null);
      }
    };

    // Delay slightly to allow any modals/overlays to close or load
    const timer = setTimeout(updatePosition, 100);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isOpen, currentStepData?.selector]);

  // Reset steps when route changes
  useEffect(() => {
    setCurrentStep(0);
  }, [location.pathname]);

  if (!isOpen || !currentStepData) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipStyle = () => {
    if (!coords) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      };
    }

    const isMobile = coords.windowWidth < 768;
    if (isMobile) {
      return {
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        zIndex: 100
      };
    }

    // Desktop positioning
    const gap = 16;
    const tooltipWidth = 320;
    
    let top = coords.top + coords.height + gap;
    let left = coords.left + (coords.width / 2) - (tooltipWidth / 2);

    // boundary protection
    if (left + tooltipWidth > coords.windowWidth) {
      left = coords.windowWidth - tooltipWidth - 24;
    }
    if (left < 24) {
      left = 24;
    }

    // if overflows bottom, place it on top
    if (top + 180 > coords.windowHeight) {
      top = coords.top - 180 - gap;
    }

    return {
      position: 'fixed',
      top: `${Math.max(16, top)}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 100
    };
  };

  return (
    <div className="fixed inset-0 z-[99] pointer-events-none">
      {/* Dark overlay with focused hole */}
      {coords && (
        <div 
          className="fixed border-2 border-primary ring-[9999px] ring-black/60 rounded-lg pointer-events-none transition-all duration-300 ease-out z-[98]"
          style={{
            top: `${coords.top - 6}px`,
            left: `${coords.left - 6}px`,
            width: `${coords.width + 12}px`,
            height: `${coords.height + 12}px`,
            boxShadow: '0 0 0 10px rgba(0, 105, 72, 0.2), 0 0 15px rgba(0, 105, 72, 0.4)'
          }}
        />
      )}

      {/* Screen blocker to intercept clicks outside highlight box */}
      <div className="fixed inset-0 bg-transparent pointer-events-auto z-[97]" onClick={onClose} />

      {/* Tooltip Card */}
      <div 
        className="pointer-events-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4"
        style={getTooltipStyle()}
      >
        {/* Progress indicator */}
        <div className="flex justify-between items-center">
          <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded-full uppercase tracking-wider">
            Langkah {currentStep + 1} dari {steps.length}
          </span>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div>
          <h4 className="font-bold text-sm text-on-surface mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {currentStepData.title}
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-outline-variant/40 mt-1">
          <button
            onClick={onClose}
            className="text-[10px] font-bold text-on-surface-variant hover:text-error uppercase tracking-wider transition-colors"
          >
            Lewati Tur
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                currentStep === 0 
                  ? 'border-outline-variant/30 text-on-surface-variant/30 cursor-not-allowed' 
                  : 'border-outline text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              Kembali
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-1 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
