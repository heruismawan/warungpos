import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

export default function PembayaranModal({ isOpen, onClose, onSuccess }) {
  const { cart, subtotal, clearCart, isGrosirMode } = useCart();
  const [activeTab, setActiveTab] = useState('tunai');
  const [amountPaid, setAmountPaid] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [hutangData, setHutangData] = useState({
    nama: '',
    noHp: '',
    alamat: '',
    jatuhTempo: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const totalBelanja = subtotal;
  const parsedAmount = parseInt(amountPaid) || 0;
  const change = Math.max(0, parsedAmount - totalBelanja);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const handleQuickButton = (amount) => {
    setAmountPaid(amount.toString());
  };

  const handleNumpad = (value) => {
    if (value === 'backspace') {
      setAmountPaid((prev) => prev.slice(0, -1));
    } else {
      setAmountPaid((prev) => prev + value);
    }
  };

  const handleConfirmPayment = async (method, paid, kembalian) => {
    setIsProcessing(true);
    try {
      // Iterate through cart and update stock in database
      for (const item of cart) {
        // Fetch current stock first to ensure accuracy, or just deduct from the item.stock we have in context
        // Using item.stock from context for simplicity in this demo
        const newStock = Math.max(0, item.stock - item.quantity);
        
        const { error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.id);
          
        if (error) {
          console.error(`Failed to update stock for ${item.name}:`, error);
        }
      }
      
      // Record transaction
      const description = `Penjualan POS (${cart.length} item)`;
      const generatedReceipt = `WPOS-${Math.floor(Math.random() * 10000000)}`;
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          description,
          amount: subtotal,
          type: 'Masuk',
          status: method === 'Hutang' ? 'Belum Lunas' : 'Berhasil',
          payment_method: method,
          receipt_number: generatedReceipt,
          items: cart
        }]);

      if (txError) {
        console.error('Failed to record transaction:', txError);
      }
      
      // If method is Hutang, also save to debts table
      if (method === 'Hutang') {
        let notesText = `Dari Transaksi Kasir (${generatedReceipt}).\n`;
        if (hutangData.noHp) notesText += `No HP/WA: ${hutangData.noHp}\n`;
        if (hutangData.alamat) notesText += `Alamat: ${hutangData.alamat}`;
        
        const { error: debtError } = await supabase
          .from('debts')
          .insert([{
            customer_name: hutangData.nama,
            amount: subtotal,
            remaining_amount: subtotal,
            due_date: hutangData.jatuhTempo,
            notes: notesText.trim(),
            status: 'Belum Lunas'
          }]);
          
        if (debtError) {
          console.error('Failed to record debt:', debtError);
        }
      }
      
      setPaymentMethod(method);
      setReceiptNumber(generatedReceipt);
      setShowSuccess(true);
      
      // Notify parent to refetch products so stock updates on UI
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransaksiBaru = () => {
    clearCart();
    setShowSuccess(false);
    setActiveTab('tunai');
    setAmountPaid('');
    setPaymentMethod('');
    setReceiptNumber('');
    setHutangData({
      nama: '',
      noHp: '',
      alamat: '',
      jatuhTempo: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    onClose();
  };

  const handleCloseModal = () => {
    if (showSuccess) {
      handleTransaksiBaru();
    } else {
      setActiveTab('tunai');
      setAmountPaid('');
      setHutangData({
        nama: '',
        noHp: '',
        alamat: '',
        jatuhTempo: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      onClose();
    }
  };

  // ===================== SUCCESS VIEW =====================
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleTransaksiBaru}
        ></div>
        <div className="relative w-full max-w-[420px] flex flex-col z-10 max-h-[90vh]">
          {/* Scrollable Receipt Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Receipt Card */}
            <div className="relative w-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]">
              <div className="bg-surface-container-lowest rounded-t-xl px-6 pt-10 pb-4 flex flex-col items-center">
                {/* Success Header */}
                <div className="flex flex-col items-center text-center w-full mb-6">
                  <div className="bg-primary-container rounded-full p-3 mb-4">
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
                    <span className="text-on-surface font-medium">#{receiptNumber}</span>
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
                        {formatRupiah((isGrosirMode ? (item.wholesale_price || item.retail_price) : (item.retail_price || item.price)) * item.quantity)}
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
                    <span className="font-medium text-on-surface">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between w-full">
                    <span>Uang Diterima</span>
                    <span>{formatRupiah(parsedAmount || subtotal)}</span>
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
          </div>
          {/* Action Buttons - always visible at bottom */}
          <div className="w-full flex flex-col gap-3 pt-6 shrink-0">
            <button className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border border-white/30 text-white font-body-base text-body-base font-medium hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[20px]">print</span>
              Cetak Struk
            </button>
            <button
              onClick={handleTransaksiBaru}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-lg bg-primary text-on-primary font-body-base text-body-base font-medium shadow-sm hover:bg-primary/90 transition-colors"
            >
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== PAYMENT MODAL =====================
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCloseModal}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-outline-variant flex justify-between items-start bg-surface-container-lowest">
          <div>
            <p className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase">
              Total Tagihan
            </p>
            <h1 className="font-display-sm text-display-sm text-primary mt-1">
              {formatRupiah(totalBelanja)}
            </h1>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Payment Tabs */}
        <div className="flex border-b border-outline-variant bg-surface-container-lowest px-2">
          <button
            onClick={() => setActiveTab('tunai')}
            className={`flex-1 py-4 text-center font-body-sm text-body-sm flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'tunai'
                ? 'border-primary text-primary bg-surface-container-low/50 font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={activeTab === 'tunai' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              payments
            </span>
            Tunai
          </button>
          <button
            onClick={() => setActiveTab('qris')}
            className={`flex-1 py-4 text-center font-body-sm text-body-sm flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'qris'
                ? 'border-primary text-primary bg-surface-container-low/50 font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={activeTab === 'qris' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              qr_code_scanner
            </span>
            E-Wallet (QRIS)
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-4 text-center font-body-sm text-body-sm flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'transfer'
                ? 'border-primary text-primary bg-surface-container-low/50 font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={activeTab === 'transfer' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              account_balance
            </span>
            Transfer Bank
          </button>
          <button
            onClick={() => setActiveTab('hutang')}
            className={`flex-1 py-4 text-center font-body-sm text-body-sm flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'hutang'
                ? 'border-primary text-primary bg-surface-container-low/50 font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={activeTab === 'hutang' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              menu_book
            </span>
            Hutang
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 bg-surface-container-lowest">
          {/* ===== TUNAI TAB ===== */}
          {activeTab === 'tunai' && (
            <div className="p-6 flex flex-col sm:flex-row gap-6">
              {/* Left Side: Input & Change */}
              <div className="flex-1 flex flex-col gap-6">
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
              <div className="w-full sm:w-56 grid grid-cols-3 gap-2 shrink-0">
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
                  <span className="material-symbols-outlined">backspace</span>
                </button>
              </div>
            </div>
          )}

          {/* ===== QRIS TAB ===== */}
          {activeTab === 'qris' && (
            <div className="p-8 flex flex-col items-center">
              <div className="w-52 h-52 bg-white border border-outline-variant rounded-lg p-3 mb-5 flex items-center justify-center shadow-sm relative overflow-hidden">
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
              <button
                onClick={() => handleConfirmPayment('QRIS', subtotal, 0)}
                className="flex items-center gap-2 px-5 py-2.5 border border-outline text-on-surface-variant rounded hover:bg-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm"
              >
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                Cek Status Pembayaran (Simulate Success)
              </button>
            </div>
          )}

          {/* ===== TRANSFER TAB ===== */}
          {activeTab === 'transfer' && (
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {/* BCA */}
                <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img alt="BCA Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPkSKrw4u_ZXka0taRN2vXy_ea1huk11McDvWoOohBfN4irbqDq-G-PbheiHnj9s5FhlusXxv9KA73kEmor_QzjDEUrOZrFBLZXAx0B2Y46PW71uRlB92ebqr0zufQnc_0Pujqk8GtTTKaONebzj_KwP5H1JTEQBurhNUVcQ5yfjLfA6m_NqQj64rS6Uh_1U5CzET8gIN_9qYavBPm5Y0nOj4Zc4uVD_ZVoSaH-k1eeup4WULuFcTc3qG-KuEv36L2tywwKeNwR9Hu"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Central Asia (BCA)</div>
                    <div className="font-headline-md text-headline-md text-on-surface truncate">8830123456</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
                  </div>
                  <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                  </button>
                </div>
                {/* Mandiri */}
                <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img alt="Mandiri Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyEVCMdx1YJNPgmKfHXsfSAnwSdOehIsELtQxqyBedhlToGdrNKI9O5MoUlpJJkNNGRbiujfMkupFxiHdIbmVYd6C_PJA0ZMa6fEdmnTeVFEv62S2T1embsagMKNlb1GOpORLQ_RNt6_9-jyDBnR-n_xACnNL2r8FKI_33ZxbImPhBJkTWMC_7CLXv2PKpGX1MfeZ_0J5STXy1bWt98jG-FIeQq6roWXTf5iZ4V3O4uH9hLDzRwLFCvqrcsPlXhBZ1HeAKemNEIQWh"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Mandiri</div>
                    <div className="font-headline-md text-headline-md text-on-surface truncate">1370012345678</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
                  </div>
                  <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                  </button>
                </div>
                {/* BRI */}
                <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                    <img alt="BRI Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWqqnspfAg4rs7MrKQO8KAGUyTgj-iGOZmGIEU8Tzz-je8SLUa989UxnxDc9CrJWPfeEuSS5eHuKSF0qtemZFpyxAlci214tbjDMg9Y8lFCN94cRaIr9_zS7WXljhFqcEfkpOebgx3XFw1odpA_vp3dAkPBvQKmmr6p-_9LtJxxN8XJRAwbDqSRnN_IBICE7eZuwEW1X_kHO-nfxF_c8cqJ6vNDbp9RY-VMooV10dajF5SYy5zWNLR-EDthesyjdrm_Fr9wC3Lol-A"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Rakyat Indonesia (BRI)</div>
                    <div className="font-headline-md text-headline-md text-on-surface truncate">001201023456789</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
                  </div>
                  <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
                  </button>
                </div>
              </div>
              {/* Instructions */}
              <div className="bg-surface-container p-4 rounded-lg flex flex-col gap-4">
                <div className="flex gap-3 text-on-surface-variant items-start">
                  <span className="material-symbols-outlined text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
                  <p className="font-body-sm text-body-sm">Silahkan transfer tepat sesuai nominal Total Tagihan. Pembayaran akan terverifikasi otomatis dalam 1-3 menit.</p>
                </div>
                <button className="w-full border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg py-6 flex flex-col items-center justify-center gap-2 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-surface-variant group-hover:bg-primary/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>upload_file</span>
                  </div>
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Unggah Bukti Transfer</span>
                </button>
              </div>
            </div>
          )}

          {/* ===== HUTANG TAB ===== */}
          {activeTab === 'hutang' && (
            <div className="p-6 flex flex-col gap-6">
              <div className="flex-1 flex flex-col gap-4 max-w-md mx-auto w-full">
                <div className="text-center mb-2">
                  <h3 className="font-headline-md text-on-surface">Catat sebagai Hutang</h3>
                  <p className="font-body-sm text-on-surface-variant mt-1">Sistem akan menyimpan transaksi ini ke dalam Manajemen Utang.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nama Pelanggan</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">person</span>
                      <input 
                        value={hutangData.nama}
                        onChange={(e) => setHutangData({...hutangData, nama: e.target.value})}
                        type="text" 
                        placeholder="Nama lengkap pelanggan"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">No HP / WhatsApp</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">phone</span>
                      <input 
                        value={hutangData.noHp}
                        onChange={(e) => setHutangData({...hutangData, noHp: e.target.value})}
                        type="tel" 
                        placeholder="08123456789"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Alamat</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-[20px] text-on-surface-variant">location_on</span>
                      <textarea 
                        value={hutangData.alamat}
                        onChange={(e) => setHutangData({...hutangData, alamat: e.target.value})}
                        placeholder="Alamat pelanggan"
                        rows="2"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Jatuh Tempo</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">calendar_today</span>
                      <input 
                        value={hutangData.jatuhTempo}
                        onChange={(e) => setHutangData({...hutangData, jatuhTempo: e.target.value})}
                        type="date" 
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex gap-4 bg-surface-container-lowest">
          <button
            onClick={handleCloseModal}
            className="px-6 py-3 rounded-lg border border-outline font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors font-semibold"
          >
            Batal
          </button>
          {activeTab === 'tunai' && (
            <button
              onClick={() => handleConfirmPayment('Tunai', parsedAmount, change)}
              disabled={parsedAmount < totalBelanja || isProcessing}
              className={`flex-1 py-3 rounded-lg font-headline-md text-headline-md shadow-sm flex items-center justify-center gap-2 transition-colors ${
                parsedAmount >= totalBelanja && !isProcessing
                  ? 'bg-primary text-on-primary hover:bg-surface-tint'
                  : 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">check_circle</span>
              )}
              {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </button>
          )}
          {activeTab === 'qris' && (
            <button
              className="flex-1 py-3 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm opacity-50 cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              disabled
            >
              Konfirmasi Pembayaran
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          )}
          {activeTab === 'transfer' && (
            <button
              onClick={() => handleConfirmPayment('Transfer', subtotal, 0)}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-lg font-body-sm text-body-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${
                isProcessing ? 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-surface-tint'
              }`}
            >
              {isProcessing ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">check_circle</span>
              )}
              {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </button>
          )}
          {activeTab === 'hutang' && (
            <button
              onClick={() => handleConfirmPayment('Hutang', subtotal, 0)}
              disabled={isProcessing || !hutangData.nama}
              className={`flex-1 py-3 rounded-lg font-body-sm text-body-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 ${
                isProcessing || !hutangData.nama ? 'bg-surface-variant text-on-surface-variant opacity-50 cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-surface-tint'
              }`}
            >
              {isProcessing ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">menu_book</span>
              )}
              {isProcessing ? 'Memproses...' : 'Simpan sebagai Hutang'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
