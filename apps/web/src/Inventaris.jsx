import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TambahBarangModal from './components/TambahBarangModal';
import { supabase } from './supabaseClient';
import { useAuth } from './context/AuthContext';

export default function Inventaris() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

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
      setInventoryData(data || []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingProduct(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        alert('Produk berhasil dihapus!');
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Error deleting product:', error.message);
        alert('Gagal menghapus produk: ' + error.message);
      }
    }
  };

  // Dynamic KPIs
  const totalProducts = inventoryData.length;
  const totalValue = inventoryData.reduce((acc, item) => acc + (item.buy_price * item.stock), 0);
  const lowStockCount = inventoryData.filter(item => item.stock <= item.min_stock).length;

  const categories = ['Semua Kategori', 'Kebutuhan Pokok', 'Minuman', 'Mie Instan', 'Peralatan Mandi', 'Rokok & Korek', ...new Set(inventoryData.map(item => item.category))].filter((value, index, self) => value && self.indexOf(value) === index);

  const displayedProducts = inventoryData.filter(item => {
    const matchCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.barcode && item.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchLowStock = !showOnlyLowStock || item.stock <= item.min_stock;
    return matchCategory && matchSearch && matchLowStock;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Inventaris Barang</h2>
            <p className="text-on-surface-variant text-sm mt-1">Kelola stok, harga, dan data produk toko Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant transition-colors text-sm font-medium">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Tambah Barang Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Produk</p>
              <span className="material-symbols-outlined text-primary bg-primary-container/20 p-2 rounded-lg">inventory_2</span>
            </div>
            <h3 className="text-3xl font-bold mt-2">{totalProducts.toLocaleString()}</h3>
            <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Item aktif di katalog
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Nilai Stok</p>
              <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg">payments</span>
            </div>
            <h3 className="text-3xl font-bold mt-2">Rp { (totalValue / 1000000).toFixed(1) }M</h3>
            <p className="text-xs text-on-surface-variant mt-2">Estimasi harga modal x stok: Rp {totalValue.toLocaleString()}</p>
          </div>
          <div 
            onClick={() => setShowOnlyLowStock(prev => !prev)}
            className={`border p-6 rounded-xl shadow-sm cursor-pointer transition-all duration-200 select-none ${
              showOnlyLowStock 
                ? 'bg-error/10 border-error/50 ring-2 ring-error/20' 
                : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-variant/20'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Stok Menipis</p>
              <span className="material-symbols-outlined text-error bg-error-container/20 p-2 rounded-lg">warning</span>
            </div>
            <h3 className="text-3xl font-bold mt-2 text-error">{lowStockCount}</h3>
            <p className="text-xs text-error font-medium mt-2">
              {showOnlyLowStock ? 'Menampilkan stok menipis (klik untuk batal)' : 'Klik untuk filter stok menipis'}
            </p>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 justify-between bg-surface/50">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU, nama barang, atau barcode..." 
                className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {showOnlyLowStock && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Filter: Stok Menipis
                  <button 
                    onClick={() => setShowOnlyLowStock(false)}
                    className="hover:bg-error/10 p-0.5 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              )}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                onClick={fetchProducts}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors"
                title="Refresh Data"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform active:rotate-180">refresh</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant/30 text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 border-b border-outline-variant">Info Produk</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Kategori</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Stok</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Harga Beli</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Harga Jual (Ecer)</th>
                  <th className="px-6 py-4 border-b border-outline-variant">Grosir</th>
                  <th className="px-6 py-4 border-b border-outline-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[32px]">sync</span>
                        Memuat data inventaris...
                      </div>
                    </td>
                  </tr>
                ) : displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-on-surface-variant font-medium">
                      Belum ada data barang atau tidak ada yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-variant/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-surface-variant flex items-center justify-center text-on-surface-variant overflow-hidden border border-outline-variant">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-[20px]">image</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{item.name}</p>
                            <p className="text-xs text-on-surface-variant font-mono uppercase tracking-tight">{item.sku || item.barcode || 'NO-SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-surface-variant rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-wide border border-outline-variant">
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${item.stock <= item.min_stock ? 'text-error' : 'text-on-surface'}`}>{item.stock}</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">{item.unit}</p>
                        </div>
                        {item.stock <= item.min_stock && (
                          <div className="w-16 h-1 bg-outline-variant rounded-full mt-1 overflow-hidden">
                            <div className="w-1/3 h-full bg-error"></div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-on-surface">Rp {item.buy_price.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-primary">Rp {item.retail_price.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-secondary">Rp {item.wholesale_price.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user?.role !== 'Kasir' && (
                            <>
                              <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-primary-container/20"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id, item.name)}
                                className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error-container/20"
                                title="Hapus"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </>
                          )}
                          <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && displayedProducts.length > 0 && (
            <div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface/50">
              <p className="text-xs text-on-surface-variant">Menampilkan {displayedProducts.length} produk</p>
              <div className="flex items-center gap-1">
                <button className="p-1 border border-outline-variant rounded bg-surface disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded text-xs font-bold shadow-sm">1</button>
                <button className="p-1 border border-outline-variant rounded bg-surface disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <TambahBarangModal 
        isOpen={isModalOpen} 
        initialData={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          fetchProducts(); // Refresh on close
        }} 
        existingCategories={categories.filter(c => c !== 'Semua Kategori')}
      />
    </Layout>
  );
}
