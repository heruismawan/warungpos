import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TambahPenggunaModal from './components/TambahPenggunaModal';
import { supabase } from './supabaseClient';

export default function ManajemenPengguna() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Manajemen Pengguna</h2>
            <p className="text-on-surface-variant text-sm mt-1">Kelola akun staff dan hak akses kasir Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Tambah Pengguna
            </button>
          </div>
        </div>

        {/* User List Section */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between bg-surface/50">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Cari nama atau username..." 
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={fetchUsers}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors"
                title="Refresh Data"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 border-b border-outline-variant">Nama & Username</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Role</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Kontak</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Status</th>
                  <th className="px-6 py-4 border-b border-outline-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                        Memuat data pengguna...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      Belum ada pengguna terdaftar.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-variant/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            user.role === 'Owner' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                          }`}>
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{user.full_name}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium tracking-tight">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          user.role === 'Owner' 
                            ? 'bg-primary/10 border-primary/30 text-primary' 
                            : 'bg-secondary/10 border-secondary/30 text-secondary'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface">{user.phone || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-secondary' : 'bg-outline'}`}></div>
                          <span className="text-sm font-medium text-on-surface">{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-error/10 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TambahPenggunaModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchUsers();
        }} 
      />
    </Layout>
  );
}
