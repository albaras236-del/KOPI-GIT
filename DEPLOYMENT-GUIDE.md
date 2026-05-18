# 🚀 Panduan Hosting Website Kopi Kuba

## Mengapa Perlu Hosting?

Untuk bisa mengakses website dengan link `www.kopikuba.com`, Anda perlu:
1. **Domain Name** - Alamat website (www.kopikuba.com)
2. **Web Hosting** - Tempat menyimpan file website
3. **DNS Configuration** - Menghubungkan domain ke hosting

## 📋 Opsi Hosting Gratis

### 1. **GitHub Pages** (Paling Mudah)
```
Keuntungan: Gratis, Mudah setup, Cepat deploy
```

**Langkah-langkah:**
1. Buat akun GitHub: https://github.com
2. Buat repository baru: `kopi-kuba-website`
3. Upload semua file (index.html, style.css, dll) ke repository
4. Pergi ke Settings → Pages
5. Pilih branch `main` dan folder `/root`
6. Website akan live di: `https://username.github.io/kopi-kuba-website`

### 2. **Netlify** (Recommended)
```
Keuntungan: Gratis, Custom domain, SSL otomatis, Cepat
```

**Langkah-langkah:**
1. Daftar di: https://www.netlify.com/
2. Klik "Deploy manually" atau "Import from Git"
3. Upload folder project atau connect ke GitHub
4. Website langsung live dengan URL Netlify
5. Untuk custom domain: Settings → Domain management

### 3. **Vercel** (Alternatif Netlify)
```
Keuntungan: Cepat, Modern, Integrasi Git
```

**Langkah-langkah:**
1. Daftar di: https://vercel.com/
2. Import project dari GitHub atau upload manual
3. Deploy otomatis
4. Custom domain di settings

## 🌐 Cara Mendapatkan Domain (www.kopikuba.com)

### Opsi Domain Murah:
- **Niagahoster** (Rp 150k-300k/tahun)
- **Domainesia** (Rp 100k-250k/tahun)
- **Namecheap** (International, ~$10-15/tahun)

### Domain Gratis (Tidak Recommended):
- **000webhost** - Subdomain gratis
- **InfinityFree** - Hosting + subdomain gratis

## 📁 Struktur File untuk Upload

Pastikan folder project berisi:
```
kopi-projrect/
├── index.html
├── style.css
├── login.css
├── keranjang.css
├── app.js
├── cart.js
└── README.md
```

## ⚡ Quick Deploy dengan Netlify

1. **Compress folder** menjadi ZIP
2. **Upload ke Netlify**:
   - Drag & drop file ZIP
   - Tunggu deploy selesai
   - Dapat URL langsung

## 🔧 Troubleshooting

### Jika website tidak loading:
- Pastikan `index.html` ada di root folder
- Check path gambar (gunakan relative path)
- Test di browser incognito

### Jika navigation tidak bekerja:
- Pastikan JavaScript loaded dengan benar
- Check console browser untuk error
- Verify onclick handlers

### Jika mobile tidak responsive:
- Test dengan responsive design checker
- Pastikan viewport meta tag ada

## 💡 Tips Optimal

1. **Optimasi Gambar**: Compress gambar sebelum upload
2. **Minify Code**: Kecilkan ukuran CSS/JS untuk loading cepat
3. **SSL Certificate**: Pastikan HTTPS aktif
4. **SEO Basic**: Tambahkan meta description dan title
5. **Analytics**: Tambahkan Google Analytics

## 📞 Bantuan

Jika butuh bantuan deploy:
- Dokumentasi Netlify: https://docs.netlify.com/
- GitHub Pages Guide: https://pages.github.com/
- Tanya di forum developer Indonesia

---

**Ready to go live? 🎉**

Website Kopi Kuba siap untuk diakses dunia!</content>
<parameter name="filePath">c:\Users\Aliyya\Desktop\kopi projrect\DEPLOYMENT-GUIDE.md