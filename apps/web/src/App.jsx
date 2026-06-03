import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './Login';
import Dashboard from './Dashboard';
import Transaksi from './Transaksi';
import Pembayaran from './Pembayaran';
import PembayaranQRIS from './PembayaranQRIS';
import PembayaranTransfer from './PembayaranTransfer';
import PembayaranBerhasil from './PembayaranBerhasil';

import Inventaris from './Inventaris';
import ManajemenUtang from './ManajemenUtang';
import LaporanKeuangan from './LaporanKeuangan';
import ManajemenPengguna from './ManajemenPengguna';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventaris" element={<Inventaris />} />
            <Route path="/utang" element={<ManajemenUtang />} />
            <Route path="/laporan" element={<LaporanKeuangan />} />
            <Route path="/pengguna" element={<ManajemenPengguna />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/pembayaran" element={<Pembayaran />} />
            <Route path="/pembayaran/qris" element={<PembayaranQRIS />} />
            <Route path="/pembayaran/transfer" element={<PembayaranTransfer />} />
            <Route path="/pembayaran/berhasil" element={<PembayaranBerhasil />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
