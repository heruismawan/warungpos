import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { supabase } from './supabaseClient';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    lowStockCount: 0,
    lowStockItems: [],
    activeDebtsAmount: 0,
    activeDebtsCount: 0,
    monthlyProfit: 0,
  });
  const [weeklySales, setWeeklySales] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', startOfMonth.toISOString())
        .order('created_at', { ascending: false });

      const transactions = txs || [];

      // 1. Today's sales
      const todayTxs = transactions.filter(t => new Date(t.created_at) >= today && t.type === 'Masuk' && t.status === 'Berhasil');
      const todaySales = todayTxs.reduce((sum, t) => sum + t.amount, 0);

      // 2. Monthly Profit
      const monthlyIncome = transactions.filter(t => t.type === 'Masuk' && t.status === 'Berhasil').reduce((sum, t) => sum + t.amount, 0);
      const monthlyExpense = transactions.filter(t => t.type === 'Keluar' && t.status === 'Berhasil').reduce((sum, t) => sum + t.amount, 0);
      const monthlyProfit = monthlyIncome - monthlyExpense;

      // 3. Weekly Sales
      const dateNow = new Date();
      const currDay = dateNow.getDay();
      const diffStart = dateNow.getDate() - currDay + (currDay === 0 ? -6 : 1);
      const weekStart = new Date(new Date().setDate(diffStart));
      weekStart.setHours(0, 0, 0, 0);

      const { data: weekTxs } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('type', 'Masuk')
        .eq('status', 'Berhasil')
        .gte('created_at', weekStart.toISOString());
      
      const weekChart = [0, 0, 0, 0, 0, 0, 0];
      (weekTxs || []).forEach(t => {
        let d = new Date(t.created_at).getDay();
        let idx = d === 0 ? 6 : d - 1; 
        weekChart[idx] += t.amount;
      });

      // 4. Low Stock
      const { data: products } = await supabase.from('products').select('name, stock, min_stock');
      const lowStockItems = (products || []).filter(p => p.stock <= p.min_stock);

      // 5. Active Debts
      const { data: debts } = await supabase.from('debts').select('remaining_amount, status').neq('status', 'Lunas');
      const activeDebtsAmount = (debts || []).reduce((sum, d) => sum + d.remaining_amount, 0);

      // 6. Recent Transactions
      const recent = transactions.slice(0, 5);

      setStats({
        todaySales,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.map(p => p.name),
        activeDebtsAmount,
        activeDebtsCount: (debts || []).length,
        monthlyProfit,
      });
      setWeeklySales(weekChart);
      setRecentTransactions(recent);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  const maxWeekly = Math.max(...weeklySales, 1);

  return (
    <Layout>
      <div className="space-y-gutter">
        {/* Header */}
        <div>
          <h2 className="font-display-sm text-display-sm text-on-surface">
            Overview Dashboard
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Ringkasan performa toko hari ini.
          </p>
        </div>
        {/* Bento Grid KPI Cards */}
        <div id="tour-db-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Card 1: Total Sales Today */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span
                className="material-symbols-outlined text-[80px] text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
            </div>
            <p className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider mb-2">
              Total Sales Today
            </p>
            <div className="flex items-end gap-3">
              <h3 className="font-display-sm text-display-sm text-on-surface">
                Rp {stats.todaySales.toLocaleString()}
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 opacity-70">
              Periode hari ini
            </p>
          </div>
          {/* Card 2: Low Stock Alerts */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider">
                Low Stock Alerts
              </p>
              <span
                className="material-symbols-outlined text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <h3 className="font-display-sm text-display-sm text-on-surface">
              {stats.lowStockCount} Item
            </h3>
            <div className="mt-4 flex gap-2">
              {stats.lowStockItems.slice(0, 1).map((item, i) => (
                <span key={i} className="bg-error-container text-on-error-container px-2 py-1 rounded text-xs font-medium border border-error/20">
                  {item}
                </span>
              ))}
              {stats.lowStockCount > 1 && (
                <span className="bg-surface-variant text-on-surface px-2 py-1 rounded text-xs font-medium border border-outline-variant">
                  +{stats.lowStockCount - 1} lainnya
                </span>
              )}
              {stats.lowStockCount === 0 && (
                <span className="bg-surface-variant text-on-surface px-2 py-1 rounded text-xs font-medium border border-outline-variant">
                  Aman
                </span>
              )}
            </div>
          </div>
          {/* Card 3: Active Debts */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <p className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase tracking-wider">
                Active Debts
              </p>
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance_wallet
              </span>
            </div>
            <h3 className="font-display-sm text-display-sm text-on-surface">
              Rp {stats.activeDebtsAmount.toLocaleString()}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                groups
              </span>
              Dari {stats.activeDebtsCount} Pelanggan
            </p>
          </div>
          {/* Card 4: Monthly Profit */}
          <div className="bg-primary rounded-xl p-6 shadow-sm relative overflow-hidden text-on-primary">
            <div className="absolute -right-6 -top-6 bg-primary-container w-32 h-32 rounded-full opacity-50 blur-2xl"></div>
            <p className="font-label-uppercase text-label-uppercase uppercase tracking-wider mb-2 text-on-primary/80">
              Monthly Profit
            </p>
            <h3 className="font-display-sm text-display-sm">
              Rp {stats.monthlyProfit.toLocaleString()}
            </h3>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-body-sm text-body-sm text-on-primary/80">
                Bulan Ini
              </p>
              <span
                className="material-symbols-outlined bg-white/20 p-1.5 rounded-full"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                account_balance
              </span>
            </div>
          </div>
        </div>
        {/* Layout 2 Columns: Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mt-8">
          {/* Chart Area (8 cols) */}
          <div id="tour-db-chart" className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col h-[400px]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Grafik Penjualan Mingguan
              </h3>
              <button className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-end">
              <div className="flex-1 flex items-end relative min-h-[220px]">
                {/* Faux Chart Lines for Visual Structure */}
                <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none z-0">
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp {maxWeekly.toLocaleString()}</span></div>
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp {Math.round(maxWeekly / 2).toLocaleString()}</span></div>
                  <div className="border-t border-outline-variant/20 w-full flex justify-between"><span className="text-[10px] text-on-surface-variant -mt-2 bg-surface-container-lowest px-1">Rp 0</span></div>
                </div>
                {/* Faux CSS Bar Chart using gradients for a "Line Chart" feel */}
                <div className="w-full h-full flex items-end justify-between px-6 z-10 gap-4">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => {
                    const value = weeklySales[i] || 0;
                    const pct = Math.max((value / maxWeekly) * 100, 4); // min 4% height indicator
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div 
                          className="w-full bg-primary hover:opacity-80 rounded-t-md transition-all duration-300 relative shadow-sm" 
                          style={{ height: `${pct}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                            Rp {value.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant mt-2">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Table Area (4 cols) */}
          <div id="tour-db-recent" className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col h-[400px]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                5 Transaksi Terakhir
              </h3>
              <a
                className="text-primary font-body-sm text-body-sm font-medium hover:underline"
                href="#"
              >
                Lihat Semua
              </a>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-4 py-8 text-center text-on-surface-variant font-medium text-sm">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  )}
                  {recentTransactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-outline-variant/50 hover:bg-surface-variant/50 transition-colors">
                      <td className="p-4 py-3">
                        <div className="font-body-base text-body-base text-on-surface font-medium">
                          {tx.receipt_number || tx.description}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          {new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4 py-3 text-right">
                        <div className={`font-body-base text-body-base font-medium ${tx.type === 'Masuk' ? 'text-on-surface' : 'text-error'}`}>
                          {tx.type === 'Masuk' ? '' : '-'}Rp {tx.amount.toLocaleString()}
                        </div>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant mt-1">
                          {tx.payment_method || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

