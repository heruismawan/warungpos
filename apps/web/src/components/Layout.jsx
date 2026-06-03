import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Inventaris Barang', icon: 'inventory_2', path: '/inventaris' },
    { name: 'Transaksi Kasir', icon: 'point_of_sale', path: '/transaksi' },
    { name: 'Manajemen Utang', icon: 'payments', path: '/utang' },
    { name: 'Laporan Keuangan', icon: 'assessment', path: '/laporan' },
    // Hanya Owner yang bisa akses Manajemen Pengguna
    ...(user?.role === 'Owner' ? [{ name: 'Manajemen Pengguna', icon: 'group', path: '/pengguna' }] : []),
  ];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen">
      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-screen w-sidebar-width border-r border-outline-variant shadow-sm dark:shadow-none bg-surface-container-lowest flex flex-col py-6 z-50">
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary font-headline-md text-headline-md">
              WarungPOS
            </h1>
            <p className="text-xs text-on-surface-variant font-body-sm text-body-sm">
              Retail Management
            </p>
          </div>
        </div>
        {/* Main Navigation */}
        <div className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => item.path !== '#' && navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all rounded-r-lg border-l-4 transition-colors duration-200 active:opacity-80 ${
                  isActive
                    ? 'text-primary bg-surface-container-lowest border-primary font-semibold'
                    : 'text-on-surface-variant border-transparent hover:bg-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined" data-icon={item.icon} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className="font-body-sm text-body-sm font-medium">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
        {/* CTA & Footer */}
        <div className="px-6 mt-auto space-y-4">
          <button
            onClick={() => navigate('/transaksi')}
            className="w-full bg-primary text-on-primary hover:bg-primary/90 font-body-sm text-body-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Transaction
          </button>
          <div className="pt-4 border-t border-outline-variant space-y-1">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors duration-200"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="settings"
              >
                settings
              </span>
              <span className="font-body-sm text-body-sm">Settings</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors duration-200"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-icon="logout"
              >
                logout
              </span>
              <span className="font-body-sm text-body-sm">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Main Content Wrapper */}
      <div className="ml-sidebar-width min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="font-body-sm text-body-sm font-medium">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform rounded-full hover:bg-surface-variant">
                <span
                  className="material-symbols-outlined"
                  data-icon="notifications"
                >
                  notifications
                </span>
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 transition-transform rounded-full hover:bg-surface-variant">
                <span
                  className="material-symbols-outlined"
                  data-icon="help_outline"
                >
                  help_outline
                </span>
              </button>
            </div>
            <div className="h-6 w-px bg-outline-variant"></div>
            <button className="text-primary font-body-sm text-body-sm font-medium hover:text-primary-container transition-colors">
              Support
            </button>
            <div className="flex flex-col text-right mr-2 hidden sm:flex">
              <span className="font-bold text-sm text-on-surface">{user?.full_name || 'User'}</span>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">{user?.role || 'Guest'}</span>
            </div>
            <img
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-outline-variant object-cover cursor-pointer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFyX98Y1hgWF0X6iIL5NTsyuDKRKmkoLuknlVuOatKEbAo-v8nEp6sThWVwpRBAvvB03yV1Bm7JAMdYuli5WdIjU-L-6mfMYXum6hfG6o2nwTUa3Psd-G5Wz01y9W-PuCogIwmVl53rllIWPVcXqxcdWlYYv0HYXJ0cqtdtHpGMY9Ru04n3Vcc7q1_gjSiwAmCJmh7QGRCDO_oZF176Qk_q45KemGsS4t73KkOVJ-l7dhtIKxoAW1WmqW6go2_xNNldqNlxvfigm4W"
            />
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 pt-24 px-margin-page pb-margin-page overflow-x-hidden">
          <div className="max-w-container-max mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
          <div 
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-variant pb-4">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Pengaturan Sistem</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Atur preferensi dan tema aplikasi Anda</p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 hover:bg-surface-variant text-on-surface-variant rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-6 space-y-6">
              {/* Theme Settings Section */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">palette</span>
                  Tema Aplikasi
                </label>
                <p className="text-xs text-on-surface-variant">Pilih tampilan antarmuka yang paling nyaman untuk Anda.</p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Light Theme Button */}
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary-container/10 text-primary ring-2 ring-primary/20'
                        : 'border-outline-variant hover:bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px]">light_mode</span>
                    <div className="text-xs font-bold">Mode Terang</div>
                  </button>

                  {/* Dark Theme Button */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border text-center transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary-container/10 text-primary ring-2 ring-primary/20'
                        : 'border-outline-variant hover:bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px]">dark_mode</span>
                    <div className="text-xs font-bold">Mode Gelap</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-outline-variant">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

