import React from 'react';

export default function TransactionDetailModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const items = transaction.items || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-outline-variant flex justify-between items-start bg-surface-container-lowest">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Detail Transaksi</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              No. Struk: {transaction.receipt_number || '-'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 bg-surface-container-lowest">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Waktu</span>
              <span className="font-medium text-on-surface">
                {new Date(transaction.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Metode</span>
              <span className="font-medium text-on-surface">{transaction.payment_method || '-'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Status</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                transaction.status === 'Berhasil' ? 'bg-secondary/10 text-secondary' : 'bg-surface-variant text-on-surface-variant'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-outline-variant mb-4"></div>

          <h3 className="font-bold text-on-surface mb-4">Rincian Pesanan</h3>
          
          {items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start w-full">
                  <div className="flex flex-col">
                    <span className="text-sm text-on-surface font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs text-on-surface-variant">{formatRupiah(item.price)} x {item.quantity}</span>
                  </div>
                  <span className="text-sm text-on-surface font-bold">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant italic">Detail barang tidak tersedia untuk transaksi ini.</p>
          )}

          <div className="w-full border-t border-dashed border-outline-variant my-4"></div>

          <div className="flex justify-between w-full text-base font-bold text-on-surface">
            <span>Total Akhir</span>
            <span className={transaction.type === 'Masuk' ? 'text-primary' : 'text-error'}>
              {formatRupiah(transaction.amount)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end bg-surface-container-lowest">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
