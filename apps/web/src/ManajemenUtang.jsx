import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CatatUtangModal from './components/CatatUtangModal';
import BayarUtangModal from './components/BayarUtangModal';
import { supabase } from './supabaseClient';
import { useAuth } from './context/AuthContext';

export default function ManajemenUtang() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
  const [selectedDebtForDetail, setSelectedDebtForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [debtData, setDebtData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setDebtData(data || []);
    } catch (error) {
      console.error('Error fetching debts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (debt) => {
    setSelectedDebtForPayment(debt);
    setIsPaymentModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus catatan utang pelanggan "${name}"?`)) {
      try {
        const { error } = await supabase.from('debts').delete().eq('id', id);
        if (error) throw error;
        alert('Catatan utang dihapus!');
        fetchDebts();
      } catch (error) {
        console.error('Error deleting debt:', error.message);
        alert('Gagal menghapus catatan utang.');
      }
    }
  };

  const totalDebt = debtData.reduce((acc, item) => acc + (item.remaining_amount || 0), 0);
  const dueSoonCount = debtData.filter(item => {
    if (item.status === 'Lunas') return false;
    const dueDate = new Date(item.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;
  
  const paidThisMonth = 0; // This would require a separate transactions table or field

  const filteredDebts = debtData.filter((item) => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Manajemen Utang</h2>
            <p className="text-on-surface-variant text-sm mt-1">Pantau dan kelola piutang pelanggan dengan mudah.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              id="tour-debt-add"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Catat Utang Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div id="tour-debt-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Piutang</p>
              <span className="material-symbols-outlined text-primary bg-primary-container/20 p-2 rounded-lg">account_balance_wallet</span>
            </div>
            <h3 className="text-3xl font-bold mt-2 text-primary">Rp {totalDebt.toLocaleString()}</h3>
            <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
              Total dana yang belum tertagih
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Jatuh Tempo (7 Hari)</p>
              <span className="material-symbols-outlined text-error bg-error-container/20 p-2 rounded-lg">event_busy</span>
            </div>
            <h3 className="text-3xl font-bold mt-2 text-error">{dueSoonCount}</h3>
            <p className="text-xs text-error font-medium mt-2">Perlu segera diingatkan</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Terbayar (Bulan Ini)</p>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">check_circle</span>
            </div>
            <h3 className="text-3xl font-bold mt-2">Rp {paidThisMonth.toLocaleString()}</h3>
            <p className="text-xs text-on-surface-variant mt-2 text-secondary font-medium">Realisasi penagihan bulan ini</p>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between bg-surface/50">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Cari nama pelanggan..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Sebagian">Sebagian</option>
                <option value="Lunas">Lunas</option>
              </select>
              <button 
                onClick={fetchDebts}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors"
                title="Refresh Data"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
            </div>
          </div>

          <div id="tour-debt-table" className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 border-b border-outline-variant">Pelanggan</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Total Utang</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Sisa Tagihan</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Jatuh Tempo</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Status</th>
                  <th className="px-6 py-4 border-b border-outline-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                        Memuat data utang...
                      </div>
                    </td>
                  </tr>
                ) : filteredDebts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      Tidak ada catatan utang.
                    </td>
                  </tr>
                ) : (
                  filteredDebts.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-variant/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                            {item.customer_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{item.customer_name}</p>
                            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">ID: {item.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-on-surface">Rp {item.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-error">Rp {item.remaining_amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-on-surface">
                            {new Date(item.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          {new Date(item.due_date) < new Date() && item.status !== 'Lunas' && (
                            <span className="text-[10px] text-error font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">warning</span>
                              Terlambat
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                          item.status === 'Lunas' 
                            ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                            : item.status === 'Sebagian'
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-error/10 border-error/30 text-error'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setSelectedDebtForDetail(item);
                              setIsDetailModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-surface-variant text-on-surface-variant rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-outline-variant transition-all mr-1"
                            title="Lihat Detail"
                          >
                            Detail
                          </button>
                          {item.status !== 'Lunas' && (
                            <button 
                              onClick={() => handlePay(item)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all mr-1"
                            >
                              Bayar
                            </button>
                          )}
                          {user?.role !== 'Kasir' && (
                            <button 
                              onClick={() => handleDelete(item.id, item.customer_name)}
                              className="p-2 text-on-surface-variant hover:text-error rounded-lg hover:bg-error-container/20 transition-colors"
                              title="Hapus Catatan"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          )}
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

      <CatatUtangModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchDebts();
        }} 
      />

      <BayarUtangModal
        isOpen={isPaymentModalOpen}
        debt={selectedDebtForPayment}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => fetchDebts()}
      />

      {/* Modal Detail Utang */}
      {isDetailModalOpen && selectedDebtForDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div 
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
              <h3 className="text-lg font-bold text-on-surface">Detail Utang Pelanggan</h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 hover:bg-surface-variant text-on-surface-variant rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Pelanggan</p>
                <p className="text-sm font-medium text-on-surface">{selectedDebtForDetail.customer_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Utang</p>
                  <p className="text-sm font-bold text-on-surface">Rp {selectedDebtForDetail.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sisa Tagihan</p>
                  <p className="text-sm font-bold text-error">Rp {selectedDebtForDetail.remaining_amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jatuh Tempo</p>
                  <p className="text-sm font-medium text-on-surface">
                    {new Date(selectedDebtForDetail.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</p>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border inline-block mt-1 ${
                    selectedDebtForDetail.status === 'Lunas' 
                      ? 'bg-secondary/10 border-secondary/30 text-secondary' 
                      : selectedDebtForDetail.status === 'Sebagian'
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-error/10 border-error/30 text-error'
                  }`}>
                    {selectedDebtForDetail.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Catatan / Kontak / Alamat</p>
                <div className="text-sm text-on-surface bg-surface-variant/30 p-3 rounded-lg border border-outline-variant/50 whitespace-pre-line leading-relaxed">
                  {selectedDebtForDetail.notes || '- Tidak ada catatan tambahan -'}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-outline-variant pt-4">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
