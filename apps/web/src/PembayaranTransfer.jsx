import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';

export default function PembayaranTransfer() {
  const navigate = useNavigate();
  const { subtotal } = useCart();

  return (
    <div className="bg-background text-on-background antialiased flex items-center justify-center min-h-screen p-margin-page relative">
      <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-40"></div>
      
      <div className="relative bg-surface rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] w-full max-w-2xl z-50 overflow-hidden flex flex-col max-h-[921px]">
        <div className="px-6 py-8 bg-surface-container-low border-b border-surface-variant flex flex-col items-center justify-center">
          <h2 className="font-body-sm text-body-sm text-on-surface-variant mb-2">Total Tagihan</h2>
          <div className="font-display-sm text-display-sm text-primary">Rp {subtotal.toLocaleString('id-ID')}</div>
        </div>
        
        <div className="flex border-b border-surface-variant bg-surface">
          <button
            onClick={() => navigate('/pembayaran')}
            className="flex-1 py-4 flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors font-body-sm text-body-sm"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>payments</span>
            Tunai
          </button>
          <button
            onClick={() => navigate('/pembayaran/qris')}
            className="flex-1 py-4 flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors font-body-sm text-body-sm"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>qr_code_scanner</span>
            E-Wallet (QRIS)
          </button>
          <button className="flex-1 py-4 flex items-center justify-center gap-2 text-primary border-b-2 border-primary bg-primary/5 font-body-sm text-body-sm font-semibold">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            Transfer Bank
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                <img alt="BCA Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPkSKrw4u_ZXka0taRN2vXy_ea1huk11McDvWoOohBfN4irbqDq-G-PbheiHnj9s5FhlusXxv9KA73kEmor_QzjDEUrOZrFBLZXAx0B2Y46PW71uRlB92ebqr0zufQnc_0Pujqk8GtTTKaONebzj_KwP5H1JTEQBurhNUVcQ5yfjLfA6m_NqQj64rS6Uh_1U5CzET8gIN_9qYavBPm5Y0nOj4Zc4uVD_ZVoSaH-k1eeup4WULuFcTc3qG-KuEv36L2tywwKeNwR9Hu"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Central Asia (BCA)</div>
                <div className="font-headline-md text-headline-md text-on-surface truncate">8830123456</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
              </div>
              <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
              </button>
            </div>
            
            <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                <img alt="Mandiri Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyEVCMdx1YJNPgmKfHXsfSAnwSdOehIsELtQxqyBedhlToGdrNKI9O5MoUlpJJkNNGRbiujfMkupFxiHdIbmVYd6C_PJA0ZMa6fEdmnTeVFEv62S2T1embsagMKNlb1GOpORLQ_RNt6_9-jyDBnR-n_xACnNL2r8FKI_33ZxbImPhBJkTWMC_7CLXv2PKpGX1MfeZ_0J5STXy1bWt98jG-FIeQq6roWXTf5iZ4V3O4uH9hLDzRwLFCvqrcsPlXhBZ1HeAKemNEIQWh"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Mandiri</div>
                <div className="font-headline-md text-headline-md text-on-surface truncate">1370012345678</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
              </div>
              <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
              </button>
            </div>
            
            <div className="border border-surface-variant rounded-lg p-4 flex items-center gap-4 bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-12 bg-surface-variant rounded flex items-center justify-center overflow-hidden shrink-0">
                <img alt="BRI Logo" className="object-cover w-full h-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWqqnspfAg4rs7MrKQO8KAGUyTgj-iGOZmGIEU8Tzz-je8SLUa989UxnxDc9CrJWPfeEuSS5eHuKSF0qtemZFpyxAlci214tbjDMg9Y8lFCN94cRaIr9_zS7WXljhFqcEfkpOebgx3XFw1odpA_vp3dAkPBvQKmmr6p-_9LtJxxN8XJRAwbDqSRnN_IBICE7eZuwEW1X_kHO-nfxF_c8cqJ6vNDbp9RY-VMooV10dajF5SYy5zWNLR-EDthesyjdrm_Fr9wC3Lol-A"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">Bank Rakyat Indonesia (BRI)</div>
                <div className="font-headline-md text-headline-md text-on-surface truncate">001201023456789</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant truncate">Atas Nama: WarungPOS / Heru Ismawan</div>
              </div>
              <button aria-label="Copy account number" className="p-2 text-primary hover:bg-primary-container/10 rounded-full transition-colors flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>content_copy</span>
              </button>
            </div>
          </div>
          
          <div className="bg-surface-container p-4 rounded-lg flex flex-col gap-4">
            <div className="flex gap-3 text-on-surface-variant items-start">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 0" }}>info</span>
              <p className="font-body-sm text-body-sm">Silahkan transfer tepat sesuai nominal Total Tagihan. Pembayaran akan terverifikasi otomatis dalam 1-3 menit.</p>
            </div>
            <button className="w-full border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 rounded-lg py-6 flex flex-col items-center justify-center gap-2 transition-all group">
              <div className="w-10 h-10 rounded-full bg-surface-variant group-hover:bg-primary/10 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>upload_file</span>
              </div>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Unggah Bukti Transfer</span>
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-surface-variant bg-surface flex justify-end gap-4">
          <button
            onClick={() => navigate('/transaksi')}
            className="px-6 py-2.5 rounded border border-outline text-on-surface hover:bg-surface-container-low font-body-sm text-body-sm font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => navigate('/pembayaran/berhasil', { state: { amountPaid: subtotal, change: 0, method: 'Transfer' } })}
            className="px-6 py-2.5 rounded bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-body-sm text-body-sm font-semibold transition-colors shadow-sm"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
