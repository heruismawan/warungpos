import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';

export default function PembayaranQRIS() {
  const navigate = useNavigate();
  const { subtotal } = useCart();

  return (
    <div className="bg-background text-on-background font-body-base h-screen w-screen flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm z-40"></div>

      <div className="relative z-50 bg-surface rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.1)] w-full max-w-2xl flex flex-col max-h-[921px] overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h2 className="font-headline-md text-headline-md text-on-surface">Pembayaran</h2>
          <button
            onClick={() => navigate('/transaksi')}
            className="text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="bg-surface-container py-6 px-6 text-center border-b border-outline-variant">
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">Total Tagihan</p>
          <p className="font-display-sm text-display-sm text-primary">Rp {subtotal.toLocaleString('id-ID')}</p>
        </div>

        <div className="flex border-b border-outline-variant px-2 bg-surface-container-lowest">
          <button
            onClick={() => navigate('/pembayaran')}
            className="flex-1 py-3 px-4 text-center font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors flex flex-col items-center gap-1 border-b-2 border-transparent focus:outline-none focus:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Tunai
          </button>
          <button className="flex-1 py-3 px-4 text-center font-body-sm text-body-sm text-primary border-b-2 border-primary flex flex-col items-center gap-1 bg-surface-container-low/50 focus:outline-none">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              qr_code_scanner
            </span>
            <span className="font-medium">E-Wallet (QRIS)</span>
          </button>
          <button
            onClick={() => navigate('/pembayaran/transfer')}
            className="flex-1 py-3 px-4 text-center font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors flex flex-col items-center gap-1 border-b-2 border-transparent focus:outline-none focus:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
            Transfer Bank
          </button>
        </div>

        <div className="p-8 flex flex-col items-center bg-surface-container-lowest">
          <div className="w-52 h-52 bg-white border border-outline-variant rounded-lg p-3 mb-5 flex items-center justify-center shadow-sm relative overflow-hidden group">
            <img
              alt="QR Code"
              className="w-full h-full object-cover rounded mix-blend-multiply opacity-90"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCh4t8nd0RCRxZkfhy075jDT4ZM_d8IjY8OhO5N9wIHKIG7usFLijXnMql4U8-c4Rw7ByqXNMGWA1CXtHBs5IQv5WIZubFLV49sOF66zXaPVvwth-Cpa8765ef28p2kXp0q8oqNtHUY6nz0tyYhx4MQ0sW9s6LxAPitoznnklvhXX9Apl02tIB-OLGXVXKz08fSdGOlVtv8NZMzD7f7Yhb32_3cC3rKfM-x_lUmHf43fYs0WJllcnc7eL5qc0LAK8U2mwfKTic9D76W"
            />
            <div className="absolute inset-0 border-[3px] border-primary rounded-lg opacity-20 m-3 pointer-events-none"></div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6 items-center justify-center max-w-[280px]">
            <span className="px-2.5 py-1 bg-[#00AED6]/10 text-[#00AED6] rounded font-label-uppercase text-label-uppercase border border-[#00AED6]/20">
              GOPAY
            </span>
            <span className="px-2.5 py-1 bg-[#4C3494]/10 text-[#4C3494] rounded font-label-uppercase text-label-uppercase border border-[#4C3494]/20">
              OVO
            </span>
            <span className="px-2.5 py-1 bg-[#118EEA]/10 text-[#118EEA] rounded font-label-uppercase text-label-uppercase border border-[#118EEA]/20">
              DANA
            </span>
            <span className="px-2.5 py-1 bg-[#E31E24]/10 text-[#E31E24] rounded font-label-uppercase text-label-uppercase border border-[#E31E24]/20">
              LinkAja
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center max-w-sm mb-1">
            Silahkan scan kode QR di atas menggunakan aplikasi e-wallet Anda
          </p>
          <p className="font-label-uppercase text-label-uppercase text-on-surface-variant text-center mb-8">
            ID: TRX-9928374
          </p>
          {/* Note: changed to redirect to success for demo purposes */}
          <button
            onClick={() => navigate('/pembayaran/berhasil', { state: { amountPaid: subtotal, change: 0, method: 'QRIS' } })}
            className="flex items-center gap-2 px-5 py-2.5 border border-outline text-on-surface-variant rounded hover:bg-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface-container-lowest"
          >
            <span className="material-symbols-outlined text-[18px] animate-spin">
              progress_activity
            </span>
            Cek Status Pembayaran (Simulate Success)
          </button>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 items-center">
          <button
            onClick={() => navigate('/transaksi')}
            className="px-5 py-2.5 border border-outline text-on-surface-variant rounded font-body-sm text-body-sm hover:bg-surface-variant hover:text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface-container-low"
          >
            Batal
          </button>
          <button
            className="px-5 py-2.5 bg-primary text-on-primary rounded font-body-sm text-body-sm opacity-50 cursor-not-allowed flex items-center gap-2"
            disabled
          >
            Konfirmasi Pembayaran
            <span className="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </div>
      </div>
    </div>
  );
}
