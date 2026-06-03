import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function CatatUtangModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e, shouldClose = true) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data, error } = await supabase
        .from('debts')
        .insert([{
          customer_name: formData.customer_name,
          amount: parseFloat(formData.amount),
          remaining_amount: parseFloat(formData.amount),
          due_date: formData.due_date,
          notes: formData.notes,
          status: 'Belum Lunas'
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Catatan utang berhasil disimpan!' });
      
      if (shouldClose) {
        setTimeout(() => {
          onClose();
          resetForm();
        }, 1500);
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Error saving debt:', error.message);
      setMessage({ type: 'error', text: 'Gagal menyimpan catatan utang.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      amount: '',
      due_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Catat Utang Baru</h3>
              <p className="text-xs text-on-surface-variant font-medium">Rekam data piutang pelanggan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
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

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nama Pelanggan</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">person</span>
                <input 
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  type="text" 
                  placeholder="Masukkan nama lengkap pelanggan"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nominal Utang (Rp)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">payments</span>
                <input 
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  type="number" 
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Jatuh Tempo</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">calendar_today</span>
                <input 
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  type="date" 
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Catatan Tambahan</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Misal: Utang sembako, rokok, dll."
                rows="3"
                className="w-full p-4 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-surface-variant transition-all disabled:opacity-50"
            >
              Simpan & Tambah
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[1.5] px-4 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
