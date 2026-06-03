# Panduan Pengguna (User Guide) - WarungPOS

WarungPOS adalah sistem Point of Sale (POS) modern berbasis web yang dirancang khusus untuk manajemen ritel warung atau toko kelontong. Sistem ini mendukung pengelolaan stok barang, kasir transaksi cepat (ecer & grosir), manajemen utang pelanggan, laporan keuangan real-time dengan wawasan AI, serta sistem hak akses pengguna (RBAC).

Aplikasi ini sudah sepenuhnya dioptimalkan agar responsif dan nyaman digunakan dari perangkat komputer (Desktop) maupun handphone/tablet (Mobile).

---

## Daftar Isi
1. [Sistem Hak Akses (Role-Based Access Control)](#1-sistem-hak-akses-role-based-access-control)
2. [Manajemen Inventaris Barang](#2-manajemen-inventaris-barang)
3. [Transaksi Kasir (Point of Sale)](#3-transaksi-kasir-point-of-sale)
4. [Manajemen Utang Pelanggan](#4-manajemen-utang-pelanggan)
5. [Laporan Keuangan & Insight AI](#5-laporan-keuangan--insight-ai)
6. [Panduan Penggunaan Layar Mobile (Handphone)](#6-panduan-penggunaan-layar-mobile-handphone)

---

## 1. Sistem Hak Akses (Role-Based Access Control)
Sistem membatasi menu dan fungsi aplikasi berdasarkan *Role* akun staf yang masuk. Terdapat 3 role dengan wewenang sebagai berikut:

| Fitur / Halaman | Kasir (Cashier) | Manager | Owner (Pemilik) |
| :--- | :---: | :---: | :---: |
| **Transaksi Kasir (POS)** | Ya | Ya | Ya |
| **Pencatatan Utang Baru & Bayar** | Ya | Ya | Ya |
| **Tambah Data Barang Baru** | Ya | Ya | Ya |
| **Edit Data Barang** | **Tidak** | Ya | Ya |
| **Hapus Data Barang** | **Tidak** | Ya | Ya |
| **Hapus Catatan Utang** | **Tidak** | Ya | Ya |
| **Manajemen Pengguna (User)** | **Tidak** | **Tidak** | Ya |

### Cara Menguji Akun (Demo Mode):
Pada halaman login, Anda dapat mengetikkan username simulasi berikut tanpa password:
- Masuk sebagai Owner: Gunakan username `owner`
- Masuk sebagai Manager: Gunakan username `manager`
- Masuk sebagai Kasir: Gunakan username `kasir` (atau nama lain sembarang)

---

## 2. Manajemen Inventaris Barang
Halaman **Inventaris Barang** digunakan untuk mendata seluruh produk yang dijual di warung Anda.

### Menambahkan Produk Baru:
1. Klik tombol **Tambah Barang Baru** di bagian kanan atas.
2. Masukkan informasi dasar:
   - **Nama Barang** (misal: *Minyak Goreng Bimoli 2L*)
   - **Kategori** (Gunakan kategori yang sudah ada atau ketik kategori baru)
   - **Barcode / SKU** (Scan atau ketik kode unik barang)
   - **Foto Produk** (Klik area upload untuk mengunggah gambar)
3. Masukkan harga & stok:
   - **Harga Modal (Buy Price)**: Harga beli dari supplier/distributor.
   - **Harga Jual Eceran**: Harga jual satuan ke konsumen umum.
   - **Harga Jual Grosir**: Harga jual khusus jika pelanggan membeli dalam jumlah banyak.
   - **Stok Awal & Satuan** (Pcs, Box, Kg, Liter, Dus).
   - **Minimum Stok**: Batas minimum stok sebelum sistem memberikan tanda peringatan.
4. Klik **Simpan Barang**.

### Peringatan Stok Menipis (Low Stock Alerts):
Jika stok suatu barang sama dengan atau di bawah batas *Minimum Stok*, maka:
- Stok pada tabel akan berwarna merah disertai ikon peringatan.
- Jumlah item bermasalah akan muncul di kartu statistik **Stok Menipis** di bagian atas.
- Anda dapat mengklik kartu **Stok Menipis** untuk memfilter tabel secara instan dan melihat barang apa saja yang harus segera dipesan ulang.

---

## 3. Transaksi Kasir (Point of Sale)
Halaman **Transaksi Kasir** adalah tempat utama kasir melayani transaksi belanja pelanggan secara cepat.

### Langkah-Langkah Transaksi:
1. **Cari Produk**: Ketik nama barang, SKU, atau lakukan scan barcode produk pada kolom pencarian di bagian atas.
2. **Tambahkan ke Keranjang**: Klik tombol `+` (Tambah) pada kartu produk untuk memasukkannya ke dalam keranjang belanja.
3. **Pilih Mode Harga (Ecer vs Grosir)**:
   - Secara default, sistem menggunakan **Harga Jual Eceran**.
   - Aktifkan toggle **Mode Harga Grosir** di bagian atas keranjang jika ingin memberlakukan harga grosir untuk seluruh item belanjaan di keranjang tersebut.
4. **Sesuaikan Jumlah**: Gunakan tombol `+` dan `-` di keranjang untuk menaikkan/menurunkan kuantitas barang. Klik tanda `X` jika ingin menghapus barang dari keranjang.
5. **Proses Bayar**: Tekan tombol hijau **Proses Bayar** di bawah keranjang.

### Pilihan Metode Pembayaran:
- **Tunai**: Masukkan jumlah uang yang diterima dari pembeli. Anda dapat menggunakan tombol cepat (*Rp 20.000*, *Rp 50.000*, *Rp 100.000*, *Uang Pas*) atau mengetikkan angka lewat numpad layar. Kembalian akan otomatis dihitung.
- **E-Wallet (QRIS)**: Sistem akan menampilkan kode QR statis. Minta pelanggan men-scan QR menggunakan aplikasi dompet digital mereka (GoPay, OVO, DANA, LinkAja). Klik *Cek Status Pembayaran* untuk menyelesaikan transaksi.
- **Transfer Bank**: Menampilkan nomor rekening bank tujuan (BCA, Mandiri, BRI) beserta nama pemilik akun. Terdapat tombol salin (*copy*) nomor rekening demi kemudahan pelanggan.
- **Hutang**: Pilih opsi ini jika pelanggan ingin berutang. Masukkan **Nama Pelanggan**, **No HP**, **Alamat**, dan **Tanggal Jatuh Tempo** pembayaran. Sistem akan mencatatnya otomatis ke daftar utang.

Setelah menekan **Konfirmasi Pembayaran**, struk digital yang rapi akan muncul. Anda dapat mencetak struk atau menekan tombol **Transaksi Baru** untuk melayani pelanggan berikutnya.

---

## 4. Manajemen Utang Pelanggan
Halaman **Manajemen Utang** membantu Anda melacak piutang dari pelanggan yang membeli dengan sistem utang/bon.

### Fitur Utama:
1. **Statistik Utang**: Menampilkan **Total Piutang** toko yang belum tertagih, jumlah pelanggan yang **Jatuh Tempo (7 Hari)**, serta total utang yang telah **Terbayar (Bulan Ini)**.
2. **Filter & Pencarian**: Cari nama pelanggan atau filter berdasarkan status utang (*Belum Lunas*, *Sebagian*, *Lunas*).
3. **Detail Kontak Pelanggan**: Klik tombol **Detail** pada baris pelanggan untuk membuka jendela modal informasi lengkap berisi nama, sisa tagihan, jatuh tempo, serta catatan penting berupa alamat atau nomor telepon.
4. **Bayar Utang**:
   - Klik tombol **Bayar** di baris pelanggan yang bersangkutan.
   - Masukkan nominal uang yang dibayarkan oleh pelanggan.
   - Jika pembayaran kurang dari sisa tagihan, status utang berubah menjadi **Sebagian**. Jika dibayar lunas, status otomatis berubah menjadi **Lunas** dan total saldo piutang toko akan berkurang.

---

## 5. Laporan Keuangan & Insight AI
Halaman **Laporan Keuangan** menyediakan visualisasi bisnis agar Anda dapat menganalisis arus kas toko secara akurat.

- **Rentang Waktu**: Pilih filter laporan berdasarkan *Hari Ini*, *Minggu Ini*, atau *Bulan Ini*.
- **Ringkasan Arus Kas**: Menampilkan kartu Pendapatan Kotor, Total Pengeluaran, Laba Bersih, dan Total Transaksi.
- **Grafik Tren Penjualan**: Grafik batang interaktif yang memperlihatkan tren naik turunnya penjualan setiap bulannya. Arahkan kursor (*hover*) pada grafik untuk melihat nominal detail penjualannya.
- **Top Kategori**: Menampilkan persentase kontribusi produk per kategori terpopuler yang paling banyak mendatangkan keuntungan.
- **Insight AI**: Kotak pintar di bagian bawah kanan yang memberikan analisis otomatis dan rekomendasi bisnis berdasarkan transaksi yang tercatat (misalnya mendeteksi kategori barang terlaris dan menyarankan pengelolaan stok).

---

## 6. Panduan Penggunaan Layar Mobile (Handphone)
Aplikasi WarungPOS dirancang agar sangat responsif saat diakses melalui smartphone. Berikut adalah beberapa penyesuaian khusus tampilan mobile:

### Navigasi Sidebar Melayang
- Sidebar menu tidak akan memakan ruang layar Anda. Ketuk tombol **Hamburger (≡)** di pojok kiri atas untuk membuka menu.
- Sidebar akan meluncur keluar di atas konten. Pilih menu yang diinginkan atau ketuk area redup di luar sidebar untuk menutupnya kembali.

### Workspace Kasir Mobile (Dual-Pane)
- Di layar handphone, daftar produk dan keranjang tidak akan tampil bersebelahan agar tidak sempit.
- Gunakan tombol tab **Daftar Produk** dan **Keranjang** di bagian atas untuk bergantian melihat item barang dan ringkasan belanjaan.
- Ketika Anda berada di tab produk dan telah menambahkan barang ke keranjang, sebuah **Tombol Melayang Hijau** akan muncul di bagian bawah layar. Ketuk tombol tersebut untuk langsung beralih ke keranjang dan memproses pembayaran secara cepat.

### Numpad Tunai Responsif
- Saat melakukan pembayaran tunai di handphone, numpad layar akan otomatis diposisikan di bawah kolom input pembayaran (bukan di samping kanan) sehingga tombol-tombol numpad tetap besar dan mudah ditekan oleh jari Anda.

### Tombol Aksi Langsung
- Pada layar desktop, tombol aksi tabel (Edit/Hapus) disembunyikan dan baru muncul ketika kursor diarahkan ke baris tersebut.
- Karena handphone tidak mendukung sistem kursor (hover), tombol-tombol aksi pada tabel **Inventaris**, **Manajemen Utang**, dan **Manajemen Pengguna** dibuat **selalu terlihat langsung** agar dapat langsung diketuk dengan jari.
