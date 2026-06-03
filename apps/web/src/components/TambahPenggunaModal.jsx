import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TambahPenggunaModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'Kasir',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Logic for adding a user to user_profiles
      // In a real app, this might also involve Supabase Auth (signup)
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          full_name: formData.full_name,
          username: formData.username,
          role: formData.role,
          phone: formData.phone,
          status: 'Active'
        }]);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Pengguna baru berhasil ditambahkan!' });
      
      setTimeout(() => {
        onClose();
        setFormData({
          full_name: '',
          username: '',
          password: '',
          role: 'Kasir',
          phone: ''
        });
      }, 1500);
    } catch (error) {
      console.error('Error adding user:', error.message);
      setMessage({ type: 'error', text: 'Gagal menambahkan pengguna. Pastikan username unik.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined">person_add</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface leading-tight">Tambah Pengguna</h3>
              <p className="text-xs text-on-surface-variant font-medium">Buat akun untuk staff baru</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input 
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                type="text" 
                placeholder="Misal: Ahmad Fauzi"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Username</label>
                <input 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                  type="text" 
                  placeholder="kasir123"
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold transition-all"
                >
                  <option value="Kasir">Kasir</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Kata Sandi</label>
              <input 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nomor Telepon</label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                type="text" 
                placeholder="0812..."
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            )}
            Daftarkan Staff
          </button>
        </form>
      </div>
    </div>
  );
}
