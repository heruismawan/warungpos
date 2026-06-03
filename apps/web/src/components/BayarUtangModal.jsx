import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function BayarUtangModal({ isOpen, onClose, debt, onSuccess }) {
  const [amountPaid, setAmountPaid] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen || !debt) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const paid = parseFloat(amountPaid);
    if (isNaN(paid) || paid <= 0) {
      setMessage({ type: 'error', text: 'Masukkan nominal pembayaran yang valid.' });
      setLoading(false);
      return;
    }

    if (paid > debt.remaining_amount) {
      setMessage({ type: 'error', text: 'Nominal melebihi sisa utang.' });
      setLoading(false);
      return;
    }

    const newRemainingAmount = debt.remaining_amount - paid;
    const newStatus = newRemainingAmount === 0 ? 'Lunas' : 'Sebagian';

    try {
      const { error } = await supabase
        .from('debts')
        .update({
          remaining_amount: newRemainingAmount,
          status: newStatus
        })
        .eq('id', debt.id);

      if (error) throw error;

      // Record transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          description: `Pembayaran Piutang (${debt.customer_name})`,
          amount: paid,
          type: 'Masuk',
          status: 'Berhasil',
          payment_method: 'Tunai'
        }]);

      if (txError) {
        console.error('Failed to record transaction:', txError);
      }

      setMessage({ type: 'success', text: 'Pembayaran utang berhasil dicatat!' });
      
      setTimeout(() => {
        setAmountPaid('');
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error paying debt:', error.message);
      setMessage({ type: 'error', text: 'Gagal memproses pembayaran.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Bayar Utang</h3>
              <p className="text-xs text-on-surface-variant font-medium">{debt.customer_name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message.text && (
            <div className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 border ${
              message.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-error/10 border-error/20 text-error'
            }`}>
              <span className="material-symbols-outlined text-[18px]">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {message.text}
            </div>
          )}

          <div className="bg-error-container/20 border border-error/20 p-4 rounded-xl flex justify-between items-center">
             <div>
               <p className="text-xs font-bold text-error uppercase tracking-wider mb-1">Sisa Utang</p>
               <p className="text-lg font-bold text-error">Rp {debt.remaining_amount.toLocaleString()}</p>
             </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nominal Pembayaran (Rp)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">payments</span>
              <input 
                required
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                type="number" 
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              )}
              Proses Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
