import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import Layout from './components/Layout';
import PembayaranModal from './components/PembayaranModal';
import { supabase } from './supabaseClient';

export default function Transaksi() {
  const navigate = useNavigate();
  const { cart, subtotal, addToCart, removeFromCart, updateQuantity, clearCart, isGrosirMode, setIsGrosirMode } = useCart();
  const [isPembayaranOpen, setIsPembayaranOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [categories, setCategories] = useState(['Semua', 'Kebutuhan Pokok', 'Minuman', 'Mie Instan', 'Peralatan Mandi', 'Rokok & Korek']);
  const [activePane, setActivePane] = useState('products'); // 'products' or 'cart'

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.retail_price,
        retail_price: item.retail_price,
        wholesale_price: item.wholesale_price,
        stock: item.stock,
        image: item.image_url,
        category: item.category,
        barcode: item.barcode,
        sku: item.sku,
      }));
      setProducts(mapped);
      
      const dynamicCats = [...new Set(mapped.map(p => p.category).filter(Boolean))];
      const allCats = ['Semua', ...new Set(['Kebutuhan Pokok', 'Minuman', 'Mie Instan', 'Peralatan Mandi', 'Rokok & Korek', ...dynamicCats])];
      setCategories(allCats);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search query and category
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(query) ||
                          (p.barcode && p.barcode.toLowerCase().includes(query)) ||
                          (p.sku && p.sku.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      {/* POS Workspace */}
      <div className="flex flex-col lg:flex-row gap-gutter h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] overflow-hidden relative">
        {/* Tab Switcher for Mobile */}
        <div className="flex lg:hidden border border-outline-variant rounded-xl bg-surface-container-lowest overflow-hidden shrink-0">
          <button 
            onClick={() => setActivePane('products')}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activePane === 'products' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Daftar Produk
          </button>
          <button 
            onClick={() => setActivePane('cart')}
            className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activePane === 'cart' ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:bg-surface-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>

        {/* Left Panel: Product Grid */}
        <section className={`flex-1 flex flex-col min-w-0 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden ${activePane === 'products' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-outline-variant bg-surface flex items-center gap-3">
            <div id="tour-pos-search" className="relative flex items-center flex-1 max-w-2xl h-10 rounded-full bg-surface-container-lowest border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden">
              <div className="pl-4 pr-2 text-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  barcode_scanner
                </span>
              </div>
              <input
                autoFocus
                className="w-full h-full bg-transparent border-none focus:ring-0 text-on-surface font-body-base text-body-sm placeholder-on-surface-variant outline-none"
                placeholder="Scan Barcode atau Cari Produk..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="pr-2 flex items-center">
                <button className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    search
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Category Filters */}
          <div id="tour-pos-cats" className="px-6 py-3 border-b border-outline-variant bg-surface/50 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-label-uppercase text-label-uppercase whitespace-nowrap shadow-sm transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-primary text-on-primary border border-primary' 
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-variant'
                }`}
              >
                {cat === 'Semua' ? 'Semua Produk' : cat}
              </button>
            ))}
          </div>
          {/* Products */}
          <div id="tour-pos-products" className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant gap-2">
                <span className="material-symbols-outlined text-[48px]">inventory_2</span>
                <p className="font-body-base text-body-base">Tidak ada produk ditemukan</p>
                <p className="font-body-sm text-body-sm">Tambahkan produk di menu Inventaris Barang</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex flex-col gap-3 hover:border-primary transition-colors cursor-pointer relative shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="aspect-square bg-surface rounded-md overflow-hidden relative">
                      {product.image ? (
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={product.image}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <span className="material-symbols-outlined text-[48px]">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-headline-md text-body-sm text-on-surface line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="font-body-base text-[12px] text-on-surface-variant mt-1">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <span className="font-headline-md text-body-base text-primary">
                          Rp {(isGrosirMode ? (product.wholesale_price || product.retail_price) : (product.retail_price || 0)).toLocaleString('id-ID')}
                        </span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Right Panel: Active Cart */}
        <aside id="tour-pos-cart" className={`w-full lg:w-[380px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm flex flex-col flex-shrink-0 overflow-hidden ${activePane === 'cart' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Current Order
              </h2>
              <p className="font-body-base text-body-sm text-on-surface-variant">
                #INV-20231024-001
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-error hover:bg-error-container p-2 rounded-md transition-colors flex items-center justify-center"
              title="Clear Cart"
            >
              <span className="material-symbols-outlined text-[20px]">
                delete_sweep
              </span>
            </button>
          </div>
          {/* Mode Grosir Toggle */}
          <div id="tour-pos-wholesale" className="px-6 py-3 border-b border-outline-variant bg-surface-container flex items-center justify-between">
            <span className="font-body-sm text-on-surface-variant font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">sell</span>
              Mode Harga Grosir
            </span>
            <button 
              onClick={() => setIsGrosirMode(!isGrosirMode)}
              className={`w-11 h-6 rounded-full transition-colors relative shadow-inner flex items-center ${isGrosirMode ? 'bg-primary' : 'bg-surface-variant'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-transform duration-200 ${isGrosirMode ? 'translate-x-6' : 'translate-x-1'}`}></div>
            </button>
          </div>
          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {cart.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant font-body-base text-body-sm">
                Keranjang masih kosong
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 bg-surface rounded-md overflow-hidden flex-shrink-0">
                    <img
                      alt={item.name}
                      className={`w-full h-full ${item.contain ? 'object-contain' : 'object-cover'}`}
                      src={item.image}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline-md text-[13px] text-on-surface truncate">
                      {item.name}
                    </h4>
                    <p className="font-headline-md text-body-sm text-primary mt-0.5">
                      Rp {(isGrosirMode ? (item.wholesale_price || item.retail_price) : item.retail_price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                    <div className="flex items-center bg-surface-variant/50 rounded border border-outline-variant">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors rounded-l"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          remove
                        </span>
                      </button>
                      <span className="w-8 text-center font-headline-md text-[13px] text-on-surface">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors rounded-r"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Checkout Footer */}
          <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex flex-col gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-on-surface-variant font-body-base text-body-sm">
                <span>Subtotal</span>
                <span className="font-headline-md text-on-surface">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-body-base text-body-sm">
                <span>Discount</span>
                <span className="font-headline-md text-primary">- Rp 0</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-outline-variant border-dashed border-b border-outline-variant"></div>
            <div className="flex justify-between items-end mt-1 mb-2">
              <span className="font-body-base text-body-base text-on-surface">
                Total Payable
              </span>
              <span className="font-headline-md text-display-sm text-primary tracking-tight">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={() => setIsPembayaranOpen(true)}
              disabled={cart.length === 0}
              className={`w-full text-on-primary py-4 rounded-lg font-headline-md text-headline-md flex items-center justify-center gap-2 transition-all ${
                cart.length > 0 ? 'bg-primary hover:bg-surface-tint hover:shadow-lg active:scale-[0.98]' : 'bg-outline-variant cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined">payments</span>
              Proses Bayar
            </button>
          </div>
        </aside>

        {/* Floating Cart Button for Mobile (Products View Only) */}
        {cart.length > 0 && activePane === 'products' && (
          <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm">
            <button 
              onClick={() => setActivePane('cart')}
              className="w-full bg-primary text-on-primary font-bold py-3 px-6 rounded-full shadow-2xl flex items-center justify-between hover:bg-primary/95 active:scale-95 transition-transform"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} Item</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span>Bayar: Rp {subtotal.toLocaleString('id-ID')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <PembayaranModal
        isOpen={isPembayaranOpen}
        onClose={() => setIsPembayaranOpen(false)}
        onSuccess={() => fetchProducts()}
      />
    </Layout>
  );
}
