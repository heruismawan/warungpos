import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { supabase } from './supabaseClient';
import './warung-pos-login-hk.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mock Login untuk testing mudah
      if (username.toLowerCase() === 'owner') {
        login({ username: 'owner', role: 'Owner', full_name: 'Mock Owner' });
        navigate('/dashboard');
        return;
      }
      if (username.toLowerCase() === 'manager') {
        login({ username: 'manager', role: 'Manager', full_name: 'Mock Manager' });
        navigate('/dashboard');
        return;
      }
      if (username.toLowerCase() === 'kasir') {
        login({ username: 'kasir', role: 'Kasir', full_name: 'Mock Kasir' });
        navigate('/dashboard');
        return;
      }

      // Cek ke Supabase jika bukan mock
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !data) {
        alert('Username tidak ditemukan!');
        return;
      }

      // Di sistem asli di sini cek password, tapi kita lewati untuk prototype ini
      login({ username: data.username, role: data.role, full_name: data.full_name });
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="n876" className="warung-pos-login-hk-frame-warung-pos-hk">
      <div id="n877" className="warung-pos-login-hk-frame-main-login6j">
        <div id="n878" className="warung-pos-login-hk-frame-header-section3m">
          <div id="n879" className="warung-pos-login-hk-frame-brand-logo-sl">
            <div id="n8710" className="warung-pos-login-hk-frame-container-pz">
              <img
                src="/assets/8711.svg"
                alt="icon"
                width="25.117431640625"
                height="22.5"
                id="n8711"
                className="warung-pos-login-hk-vector-icon10"
              />
            </div>
            <div id="n8712" className="warung-pos-login-hk-frame-heading13x">
              <span id="n8713" className="warung-pos-login-hk-text-ey1">
                <p className="warung-pos-login-hk-text-ey2">WarungPOS</p>
              </span>
            </div>
          </div>
          <div id="n8714" className="warung-pos-login-hk-frame-heading2y3">
            <span id="n8715" className="warung-pos-login-hk-text941">
              <p className="warung-pos-login-hk-text942">Selamat Datang</p>
            </span>
          </div>
          <div id="n8716" className="warung-pos-login-hk-frame-container-c1">
            <span id="n8717" className="warung-pos-login-hk-text-n21">
              <p className="warung-pos-login-hk-text-n22">
                Silakan masuk ke akun Anda
              </p>
            </span>
          </div>
        </div>
        <div id="n8718" className="warung-pos-login-hk-frame-subtle-top67"></div>
        <form onSubmit={handleLogin} id="n8719" className="warung-pos-login-hk-frame-login-form-h8">
          <div id="n8720" className="warung-pos-login-hk-frame-username-input-qk">
            <label id="n8721" className="warung-pos-login-hk-frame-label-fj">
              <div id="n8722" className="warung-pos-login-hk-text-username4i1">
                <p className="warung-pos-login-hk-text-username4i2">USERNAME</p>
              </div>
            </label>
            <div id="n8723" className="warung-pos-login-hk-frame-container-th">
              <input
                type="text"
                placeholder="Masukkan username"
                id="n8724"
                className="warung-pos-login-hk-input-yo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div id="n8727" className="warung-pos-login-hk-frame-container1l">
                <img
                  src="/assets/8728.svg"
                  alt="icon"
                  width="16"
                  height="16"
                  id="n8728"
                  className="warung-pos-login-hk-vector-icon-ac"
                />
              </div>
            </div>
          </div>
          <div id="n8729" className="warung-pos-login-hk-frame-password-input-zb">
            <label id="n8730" className="warung-pos-login-hk-frame-label-ed">
              <div id="n8731" className="warung-pos-login-hk-text-password-pe1">
                <p className="warung-pos-login-hk-text-password-pe2">PASSWORD</p>
              </div>
            </label>
            <div id="n8732" className="warung-pos-login-hk-frame-container0f">
              <input
                type="password"
                placeholder="••••••••"
                id="n8733"
                className="warung-pos-login-hk-input-bg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div id="n8736" className="warung-pos-login-hk-frame-container8j">
                <img
                  src="/assets/8737.svg"
                  alt="icon"
                  width="16"
                  height="21"
                  id="n8737"
                  className="warung-pos-login-hk-vector-icon-jk"
                />
              </div>
            </div>
          </div>
          <div id="n8738" className="warung-pos-login-hk-frame-remember-me-y5">
            <div id="n8739" className="warung-pos-login-hk-frame-container96">
              <input
                type="checkbox"
                id="n8740"
                className="warung-pos-login-hk-input-sq"
              />
              <div id="n8741" className="warung-pos-login-hk-frame-label-margin-hp">
                <div
                  id="n8742"
                  className="warung-pos-login-hk-text-label-remember-es1"
                >
                  <p className="warung-pos-login-hk-text-label-remember-es2">
                    Remember Me
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ background: 'none', border: 'none', padding: 0, width: '100%', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            <div className="warung-pos-login-hk-frame-submit-button3r">
              <span id="n8744" className="warung-pos-login-hk-text0u1">
                <p className="warung-pos-login-hk-text0u2">{loading ? 'Memproses...' : 'Masuk'}</p>
              </span>
              <div id="n8745" className="warung-pos-login-hk-frame-container-pt">
                <img
                  src="/assets/8746.svg"
                  alt="icon"
                  width="12"
                  height="12"
                  id="n8746"
                  className="warung-pos-login-hk-vector-icon-mw"
                />
              </div>
            </div>
          </button>
          <div id="n8747" className="warung-pos-login-hk-text-belum-punya-bv1">
            <p className="warung-pos-login-hk-text-belum-punya-bv2">
              <span className="warung-pos-login-hk-text1">Belum punya akun?</span>{' '}
              <span className="warung-pos-login-hk-text2">Daftar sekarang</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
