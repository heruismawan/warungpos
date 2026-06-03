import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';

export default function Pembayaran() {
  const navigate = useNavigate();
  const { subtotal } = useCart();

  // Mock total belanja
  const totalBelanja = subtotal;

  // State management
  const [amountPaid, setAmountPaid] = useState('');

  // Auto-calculation
  const parsedAmount = parseInt(amountPaid) || 0;
  const change = Math.max(0, parsedAmount - totalBelanja);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Helper for quick buttons
  const handleQuickButton = (amount) => {
    setAmountPaid(amount.toString());
  };

  // Helper for numpad
  const handleNumpad = (value) => {
    if (value === 'backspace') {
      setAmountPaid((prev) => prev.slice(0, -1));
    } else {
      setAmountPaid((prev) => prev + value);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-base h-screen w-screen flex items-center justify-center overflow-hidden relative">
      {/* Overlay Background (simulating active POS behind it) */}
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm z-40"></div>
      {/* Modal Container */}
      <div className="relative z-50 bg-surface rounded-xl shadow-[0_10px_15px_rgba(0,0,0,0.1)] w-full max-w-2xl flex flex-col max-h-[921px] overflow-hidden">
        {/* Header */}
        <div className="px-gutter pt-gutter pb-4 border-b border-surface-variant flex justify-between items-start bg-surface-container-lowest rounded-t-xl">
          <div>
            <p className="font-label-uppercase text-label-uppercase text-outline uppercase">
              Total Tagihan
            </p>
            <h1 className="font-display-sm text-display-sm text-primary mt-1">
              {formatRupiah(totalBelanja)}
            </h1>
          </div>
          <button
            onClick={() => navigate('/transaksi')}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined" data-icon="close">
              close
            </span>
          </button>
        </div>
        {/* Payment Tabs */}
        <div className="flex border-b border-surface-variant bg-surface-container-lowest px-gutter">
          <button className="flex-1 py-4 text-center border-b-2 border-primary font-headline-md text-headline-md text-primary bg-surface-container-low transition-colors">
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" data-icon="payments">
                payments
              </span>
              Tunai
            </span>
          </button>
          <button
            onClick={() => navigate('/pembayaran/qris')}
            className="flex-1 py-4 text-center border-b-2 border-transparent font-headline-md text-headline-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <span
                className="material-symbols-outlined"
                data-icon="qr_code_scanner"
              >
                qr_code_scanner
              </span>
              E-Wallet (QRIS)
            </span>
          </button>
          <button
            onClick={() => navigate('/pembayaran/transfer')}
            className="flex-1 py-4 text-center border-b-2 border-transparent font-headline-md text-headline-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <span
                className="material-symbols-outlined"
                data-icon="account_balance"
              >
                account_balance
              </span>
              Transfer Bank
            </span>
          </button>
        </div>
        {/* Modal Body (Cash Tab Active) */}
        <div className="p-gutter flex gap-gutter overflow-y-auto bg-surface-container-lowest">
          {/* Left Side: Input & Change */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Input Field */}
            <div>
              <label className="block font-body-sm text-body-sm text-on-surface-variant mb-2">
                Uang Diterima
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant">
                  Rp
                </span>
                <input
                  className="w-full h-14 pl-12 pr-4 bg-surface border border-outline-variant rounded-lg font-headline-md text-headline-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            {/* Quick Cash Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleQuickButton(20000)}
                className="py-3 px-4 rounded-lg border border-outline-variant font-body-base text-body-base text-on-surface hover:bg-surface-container hover:border-primary transition-colors text-center"
              >
                Rp 20.000
              </button>
              <button 
                onClick={() => handleQuickButton(50000)}
                className="py-3 px-4 rounded-lg border border-outline-variant font-body-base text-body-base text-on-surface hover:bg-surface-container hover:border-primary transition-colors text-center"
              >
                Rp 50.000
              </button>
              <button 
                onClick={() => handleQuickButton(100000)}
                className="py-3 px-4 rounded-lg border border-outline-variant font-body-base text-body-base text-on-surface hover:bg-surface-container hover:border-primary transition-colors text-center"
              >
                Rp 100.000
              </button>
              <button 
                onClick={() => handleQuickButton(totalBelanja)}
                className="py-3 px-4 rounded-lg border border-outline-variant font-body-base text-body-base text-on-surface hover:bg-surface-container hover:border-primary transition-colors text-center"
              >
                Uang Pas
              </button>
            </div>
            {/* Change Display */}
            <div className="mt-auto p-4 rounded-lg bg-surface-container flex justify-between items-center">
              <span className="font-body-base text-body-base text-on-surface-variant">
                Kembalian
              </span>
              <span className="font-display-sm text-display-sm text-on-surface">
                {formatRupiah(change)}
              </span>
            </div>
          </div>
          {/* Right Side: Numpad */}
          <div className="w-64 grid grid-cols-3 gap-2 shrink-0">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button 
                key={num}
                onClick={() => handleNumpad(num)}
                className="h-14 rounded-lg bg-surface-container hover:bg-surface-container-high font-headline-md text-headline-md text-on-surface transition-colors"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={() => handleNumpad('00')}
              className="h-14 rounded-lg bg-surface-container hover:bg-surface-container-high font-headline-md text-headline-md text-on-surface transition-colors font-bold text-lg"
            >
              00
            </button>
            <button 
              onClick={() => handleNumpad('0')}
              className="h-14 rounded-lg bg-surface-container hover:bg-surface-container-high font-headline-md text-headline-md text-on-surface transition-colors"
            >
              0
            </button>
            <button 
              onClick={() => handleNumpad('backspace')}
              className="h-14 rounded-lg bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined" data-icon="backspace">
                backspace
              </span>
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="px-gutter py-4 border-t border-surface-variant flex gap-4 bg-surface-container-lowest rounded-b-xl">
          <button
            onClick={() => navigate('/transaksi')}
            className="px-6 py-3 rounded-lg border border-outline font-headline-md text-headline-md text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => navigate('/pembayaran/berhasil', { state: { amountPaid: parsedAmount, change, method: 'Tunai' } })}
            disabled={parsedAmount < totalBelanja}
            className={`flex-1 py-3 rounded-lg font-headline-md text-headline-md shadow-sm flex items-center justify-center gap-2 transition-colors ${
              parsedAmount >= totalBelanja 
                ? 'bg-primary text-on-primary hover:bg-surface-tint' 
                : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
            }`}
          >
            <span
              className="material-symbols-outlined"
              data-icon="check_circle"
            >
              check_circle
            </span>
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
