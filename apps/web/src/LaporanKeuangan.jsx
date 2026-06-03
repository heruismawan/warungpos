import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { supabase } from './supabaseClient';
import TransactionDetailModal from './components/TransactionDetailModal';

export default function LaporanKeuangan() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Hari Ini');
  const [transactions, setTransactions] = useState([]);
  const [yearlyTrend, setYearlyTrend] = useState(Array(12).fill(0));
  const [topCategories, setTopCategories] = useState([]);
  const [stats, setStats] = useState({
    pendapatan: 0,
    pengeluaran: 0,
    laba: 0,
    transaksiCount: 0
  });
  const [selectedTx, setSelectedTx] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Determine date range based on filter
      const now = new Date();
      let startDate = new Date();
      
      if (filter === 'Hari Ini') {
        startDate.setHours(0, 0, 0, 0);
      } else if (filter === 'Minggu Ini') {
        const day = startDate.getDay();
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
        startDate.setDate(diff);
        startDate.setHours(0, 0, 0, 0);
      } else if (filter === 'Bulan Ini') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Fetch transactions
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const txs = data || [];
      setTransactions(txs);

      // Yearly trend
      const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
      const { data: trendData } = await supabase
        .from('transactions')
        .select('amount, created_at, type, status')
        .eq('type', 'Masuk')
        .eq('status', 'Berhasil')
        .gte('created_at', startOfYear);
      
      if (trendData) {
        const trend = Array(12).fill(0);
        trendData.forEach(tx => {
          const month = new Date(tx.created_at).getMonth();
          trend[month] += tx.amount;
        });
        setYearlyTrend(trend);
      }

      // Top Kategori
      const categoryTotals = {};
      let grandTotalItems = 0;
      txs.forEach(tx => {
        if (tx.type === 'Masuk' && tx.status === 'Berhasil' && tx.items) {
          tx.items.forEach(item => {
            const cat = item.category || 'Lainnya';
            const value = item.price * item.quantity;
            categoryTotals[cat] = (categoryTotals[cat] || 0) + value;
            grandTotalItems += value;
          });
        }
      });
      
      const colors = ['bg-primary', 'bg-secondary', 'bg-error', 'bg-surface-variant'];
      const sortedCategories = Object.keys(categoryTotals)
        .map(name => ({
          name,
          raw: categoryTotals[name],
          value: grandTotalItems > 0 ? Math.round((categoryTotals[name] / grandTotalItems) * 100) : 0
        }))
        .sort((a, b) => b.raw - a.raw)
        .slice(0, 4)
        .map((cat, idx) => ({ ...cat, color: colors[idx % colors.length] }));
      setTopCategories(sortedCategories);

      // Calculate stats
      const pendapatan = txs
        .filter(t => t.type === 'Masuk' && t.status === 'Berhasil')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const pengeluaran = txs
        .filter(t => t.type === 'Keluar' && t.status === 'Berhasil')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        pendapatan,
        pengeluaran,
        laba: pendapatan - pengeluaran,
        transaksiCount: txs.length
      });

    } catch (error) {
      console.error('Error fetching financial data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAiInsight = () => {
    if (loading) return 'Menganalisis data transaksi...';
    if (!transactions || transactions.length === 0) {
      return 'Belum ada transaksi tercatat untuk periode ini. Mulailah melakukan transaksi penjualan di Kasir untuk melihat analisis tren dan rekomendasi otomatis.';
    }
    if (topCategories && topCategories.length > 0) {
      const topCat = topCategories[0];
      return `Kategori ${topCat.name} menjadi kontributor terbesar dengan porsi ${topCat.value}% dari total penjualan. Disarankan untuk memantau ketersediaan stok produk terpopuler di kategori ini agar tidak kehilangan potensi penjualan.`;
    }
    return 'Arus kas toko Anda terpantau stabil. Pastikan pencatatan utang pelanggan dan pengeluaran operasional diperbarui secara berkala.';
  };

  const maxTrend = Math.max(...yearlyTrend, 1);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Laporan Keuangan</h2>
            <p className="text-on-surface-variant text-sm mt-1">Analisis performa bisnis dan arus kas Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container border border-outline-variant p-1 rounded-xl">
              {['Hari Ini', 'Minggu Ini', 'Bulan Ini'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    filter === item 
                      ? 'bg-primary text-on-primary shadow-sm' 
                      : 'text-on-surface-variant hover:bg-surface-variant/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant text-on-surface rounded-lg hover:bg-surface-variant transition-colors text-sm font-bold uppercase tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Pendapatan Kotor</p>
            <h3 className="text-2xl font-black text-primary">Rp {stats.pendapatan.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-secondary font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +12.5% vs lalu
            </div>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-error/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Pengeluaran</p>
            <h3 className="text-2xl font-black text-error">Rp {stats.pengeluaran.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-error font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +5.2% vs lalu
            </div>
          </div>

          <div className="bg-primary text-on-primary p-6 rounded-2xl shadow-lg shadow-primary/20 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <p className="text-[10px] font-bold text-on-primary/70 uppercase tracking-widest mb-1">Laba Bersih</p>
            <h3 className="text-2xl font-black">Rp {stats.laba.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-on-primary/90 font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Margin 47.8%
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-secondary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Transaksi</p>
            <h3 className="text-2xl font-black text-on-surface">{stats.transaksiCount}</h3>
            <div className="mt-4 flex items-center gap-1 text-secondary font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              Average Rp 159k
            </div>
          </div>
        </div>

        {/* Charts & Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm flex flex-col">
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-bold text-on-surface">Tren Penjualan</h3>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">more_horiz</span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end">
              <div className="flex-1 flex items-end relative min-h-[240px]">
                {/* Gridlines */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none z-0">
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp {maxTrend.toLocaleString()}</span></div>
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp {Math.round(maxTrend / 2).toLocaleString()}</span></div>
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp 0</span></div>
                </div>

                {/* Bars */}
                <div className="w-full h-full flex items-end justify-between px-4 z-10 gap-2">
                  {yearlyTrend.map((value, i) => {
                    const pct = Math.max((value / maxTrend) * 100, 4); // min 4% height indicator
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                        <div 
                          className="w-full bg-primary hover:opacity-80 rounded-t-md transition-all duration-300 relative shadow-sm" 
                          style={{ height: `${pct}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                            Rp {value.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant mt-2 uppercase">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Side Info / Breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <h3 className="font-bold text-on-surface">Top Kategori</h3>
            <div className="space-y-4">
              {topCategories.length > 0 ? topCategories.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-on-surface">{cat.name}</span>
                    <span className="text-on-surface-variant">{cat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.value}%` }}></div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant italic">Belum ada data penjualan.</p>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant">
              <div className="bg-surface-container p-4 rounded-xl border border-outline-variant">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Insight AI</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {getAiInsight()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant">
            <h3 className="font-bold text-on-surface">Aktivitas Keuangan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-variant/30 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">Waktu</th>
                  <th className="px-6 py-4">No Struk</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4 text-right">Nominal</th>
                  <th className="px-6 py-4 text-right">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                        Memuat data transaksi...
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      Belum ada transaksi pada periode ini.
                    </td>
                  </tr>
                ) : (
                  transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-variant/20 transition-colors">
                      <td className="px-6 py-4 text-[11px] text-on-surface-variant font-medium">
                        {new Date(item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{item.receipt_number || '-'}</p>
                        {item.payment_method && <p className="text-[10px] text-on-surface-variant mt-0.5">{item.payment_method}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.type === 'Masuk' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`text-sm font-black ${item.type === 'Masuk' ? 'text-primary' : 'text-on-surface'}`}>
                          {item.type === 'Masuk' ? '+' : '-'} Rp {item.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-bold flex items-center justify-end gap-1 ${
                          item.status === 'Berhasil' ? 'text-secondary' : 'text-on-surface-variant'
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {item.status === 'Berhasil' ? 'check_circle' : 'pending'}
                          </span>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => { setSelectedTx(item); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors inline-flex items-center justify-center"
                          title="Lihat Detail"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-surface-variant/10 text-center">
            <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Lihat Semua Riwayat</button>
          </div>
        </div>
      </div>
      <TransactionDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={selectedTx} 
      />
    </Layout>
  );
}
