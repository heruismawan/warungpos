import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './context/CartContext';

export default function PembayaranBerhasil() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, subtotal, clearCart } = useCart();

  // Get payment info from navigation state, with fallbacks
  const { amountPaid, change } = location.state || { amountPaid: subtotal, change: 0 };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleTransaksiBaru = () => {
    clearCart();
    navigate('/transaksi');
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-4 font-body-base antialiased text-on-surface">
      <main className="w-full max-w-[380px] flex flex-col gap-6">
        {/* Receipt Card */}
        <div className="relative w-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
          <div className="bg-surface-container-lowest rounded-t-xl px-6 pt-10 pb-4 flex flex-col items-center">
            {/* Success Header */}
            <div className="flex flex-col items-center text-center w-full mb-6">
              <div className="bg-primary-container rounded-full p-2 mb-4">
                <span
                  className="material-symbols-outlined text-[48px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h1 className="font-display-sm text-display-sm text-on-surface mb-2">
                Pembayaran Berhasil!
              </h1>
              <p className="font-headline-md text-headline-md text-on-surface">WarungPOS</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Jl. Retail No. 123, Jakarta
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                0812-3456-7890
              </p>
            </div>
            {/* Transaction Details */}
            <div className="w-full flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant mb-6">
              <div className="flex justify-between w-full">
                <span>Waktu</span>
                <span className="text-on-surface font-medium">
                  {new Date().toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between w-full">
                <span>No. Struk</span>
                <span className="text-on-surface font-medium">#WPOS-{Math.floor(Math.random() * 10000000)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Kasir</span>
                <span className="text-on-surface font-medium">Heru Ismawan</span>
              </div>
            </div>
            <div className="w-full border-t-2 border-dashed border-outline-variant mb-6"></div>
            {/* Items List */}
            <div className="w-full flex flex-col gap-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start w-full">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">
                      {item.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">x {item.quantity}</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full border-t-2 border-dashed border-outline-variant mb-6"></div>
            {/* Summary */}
            <div className="w-full flex flex-col gap-2 mb-6">
              <div className="flex justify-between w-full font-body-sm text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between w-full font-headline-md text-headline-md text-on-surface mt-2 pt-2 border-t border-outline-variant/30">
                <span>Total Akhir</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
            </div>
            <div className="w-full border-t-2 border-dashed border-outline-variant mb-6"></div>
            {/* Payment Method */}
            <div className="w-full flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between w-full mb-1">
                <span className="font-medium text-on-surface">Metode Pembayaran</span>
                <span className="font-medium text-on-surface">{location.state?.method || 'Tunai'}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Uang Diterima</span>
                <span>{formatRupiah(amountPaid)}</span>
              </div>
              <div className="flex justify-between w-full">
                <span>Kembalian</span>
                <span className="text-primary font-medium">{formatRupiah(change)}</span>
              </div>
            </div>
          </div>
          {/* Jagged Cut Paper Effect */}
          <svg
            className="w-full h-3 text-surface-container-lowest block"
            fill="currentColor"
            preserveAspectRatio="none"
            viewBox="0 0 100 10"
          >
            <polygon points="0,0 100,0 100,10 95,0 90,10 85,0 80,10 75,0 70,10 65,0 60,10 55,0 50,10 45,0 40,10 35,0 30,10 25,0 20,10 15,0 10,10 5,0 0,10"></polygon>
          </svg>
        </div>
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border border-primary text-primary font-body-base text-body-base font-medium hover:bg-surface-container transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
            <span className="material-symbols-outlined text-[20px]">print</span>
            Cetak Struk
          </button>
          <button
            onClick={handleTransaksiBaru}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-lg bg-primary text-on-primary font-body-base text-body-base font-medium shadow-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
          >
            Transaksi Baru
          </button>
        </div>
      </main>
    </div>
  );
}
