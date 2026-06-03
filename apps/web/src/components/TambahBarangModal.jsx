import { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function TambahBarangModal({ isOpen, onClose, initialData = null, existingCategories = [] }) {
  const defaultForm = {
    name: '',
    category: '',
    barcode: '',
    sku: '',
    description: '',
    buyPrice: '',
    retailPrice: '',
    wholesalePrice: '',
    initialStock: '',
    unit: 'Pcs',
    minStock: '10',
    imageUrl: '',
  };

  const [formData, setFormData] = useState(defaultForm);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        barcode: initialData.barcode || '',
        sku: initialData.sku || '',
        description: initialData.description || '',
        buyPrice: initialData.buy_price?.toString() || '',
        retailPrice: initialData.retail_price?.toString() || '',
        wholesalePrice: initialData.wholesale_price?.toString() || '',
        initialStock: initialData.stock?.toString() || '',
        unit: initialData.unit || 'Pcs',
        minStock: initialData.min_stock?.toString() || '10',
        imageUrl: initialData.image_url || '',
      });
      setImagePreview(initialData.image_url || null);
    } else if (isOpen) {
      setFormData(defaultForm);
      setImagePreview(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    if (initialData) {
      onClose(); // Just close if it's edit mode
    } else {
      setFormData(defaultForm);
      setImagePreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to Supabase
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Gagal mengunggah foto. Pastikan bucket "product-images" sudah dibuat di Supabase.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e, shouldReset = false) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        barcode: formData.barcode,
        sku: formData.sku,
        description: formData.description,
        buy_price: parseFloat(formData.buyPrice) || 0,
        retail_price: parseFloat(formData.retailPrice) || 0,
        wholesale_price: parseFloat(formData.wholesalePrice) || 0,
        stock: parseInt(formData.initialStock) || 0,
        unit: formData.unit,
        min_stock: parseInt(formData.minStock) || 0,
        image_url: formData.imageUrl,
      };

      let error;
      if (initialData) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;

      alert(initialData ? 'Produk berhasil diupdate!' : 'Produk berhasil disimpan!');
      if (shouldReset) {
        resetForm();
      } else {
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving product:', error.message);
      alert('Gagal menyimpan produk: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-surface rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {initialData ? 'Edit Barang' : 'Tambah Barang Baru'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {initialData ? 'Ubah informasi detail barang di inventaris.' : 'Masukkan informasi detail barang yang akan ditambahkan ke inventaris.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors rounded-full"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Visual & Identitas (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Media Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Foto Produk
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group bg-surface-container-lowest relative overflow-hidden"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant group-hover:text-primary transition-colors">
                          {isUploading ? 'sync' : 'add_a_photo'}
                        </span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase group-hover:text-primary transition-colors">
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="aspect-square bg-surface-container rounded-xl border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-on-surface-variant/40">image</span>
                  </div>
                  <div className="aspect-square bg-surface-container rounded-xl border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px] text-on-surface-variant/40">image</span>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Informasi Dasar
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nama Barang</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Contoh: Minyak Goreng Bimoli 2L" 
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Kategori</label>
                      <input 
                        type="text"
                        name="category"
                        list="kategori-list"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Pilih atau ketik kategori baru"
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                      <datalist id="kategori-list">
                        {existingCategories.length > 0 ? (
                          existingCategories.map(cat => <option key={cat} value={cat} />)
                        ) : (
                          <>
                            <option value="Kebutuhan Pokok" />
                            <option value="Minuman" />
                            <option value="Mie Instan" />
                            <option value="Peralatan Mandi" />
                            <option value="Rokok & Korek" />
                          </>
                        )}
                      </datalist>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Barcode / EAN</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="barcode"
                          value={formData.barcode}
                          onChange={handleChange}
                          placeholder="8991234567890" 
                          className="w-full pl-4 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-container text-on-primary-container rounded-lg hover:bg-primary hover:text-on-primary transition-all">
                          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">SKU (Stock Keeping Unit)</label>
                      <input 
                        type="text" 
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        placeholder="MNG-BM-2L" 
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Deskripsi Produk (Opsional)</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Tambahkan detail produk seperti berat, ukuran, atau rasa..." 
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-24 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Stock (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Pricing Section */}
              <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl space-y-6 shadow-sm">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  Skema Harga
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Harga Modal (Buy Price)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                      <input 
                        type="number" 
                        name="buyPrice"
                        value={formData.buyPrice}
                        onChange={handleChange}
                        placeholder="0" 
                        className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-outline-variant/50 my-2"></div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider ml-1">Harga Jual Eceran</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">Rp</span>
                      <input 
                        type="number" 
                        name="retailPrice"
                        value={formData.retailPrice}
                        onChange={handleChange}
                        placeholder="0" 
                        className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg text-primary"
                      />
                    </div>
                    {formData.retailPrice && formData.buyPrice && (
                      <p className="text-[10px] font-medium text-on-surface-variant mt-1 ml-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] text-primary">info</span>
                        Margin: Rp {(formData.retailPrice - formData.buyPrice).toLocaleString()} ({( ((formData.retailPrice - formData.buyPrice) / formData.buyPrice) * 100 ).toFixed(1)}%)
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider ml-1">Harga Jual Grosir (Minimal 1 Lusin)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-secondary">Rp</span>
                      <input 
                        type="number" 
                        name="wholesalePrice"
                        value={formData.wholesalePrice}
                        onChange={handleChange}
                        placeholder="0" 
                        className="w-full pl-12 pr-4 py-3 bg-secondary/5 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-bold text-lg text-secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Section */}
              <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl space-y-6 shadow-sm">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-error rounded-full"></span>
                  Inventaris & Satuan
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                      {initialData ? 'Stok Saat Ini' : 'Stok Awal'} *
                    </label>
                    <input 
                      type="number" 
                      name="initialStock"
                      value={formData.initialStock}
                      onChange={handleChange}
                      placeholder="0" 
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Satuan</label>
                    <select 
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                    >
                      <option value="Pcs">Pcs</option>
                      <option value="Box">Box</option>
                      <option value="Kg">Kg</option>
                      <option value="Liter">Liter</option>
                      <option value="Dus">Dus</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Minimum Stok (Alert)</label>
                  <input 
                    type="number" 
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleChange}
                    placeholder="10" 
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                  <p className="text-[10px] font-medium text-error mt-1 ml-1">Notifikasi akan muncul jika stok di bawah angka ini</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3 bg-surface-container-lowest sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-outline font-label-lg text-label-lg text-on-surface hover:bg-surface-variant transition-colors rounded-lg"
          >
            Batal
          </button>
          {!initialData && (
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSaving}
              className="px-5 py-2.5 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg hover:bg-secondary-container/80 transition-colors rounded-lg flex items-center gap-2"
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save_as</span>
              )}
              Simpan & Tambah Lagi
            </button>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary/90 transition-colors rounded-lg flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">check</span>
            )}
            {initialData ? 'Simpan Perubahan' : 'Simpan Barang'}
          </button>
        </div>
      </div>
    </div>
  );
}
