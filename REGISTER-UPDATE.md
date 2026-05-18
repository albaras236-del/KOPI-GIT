# 🎨 UPDATE REGISTRASI KOPI KUBA - Aesthetic & Verification

Semua fitur telah diupdate dengan desain yang lebih proper dan sistem verifikasi email!

## ✨ Perubahan yang Dilakukan

### 1. **Avatar Options** (Reduced from 5 → 3)
- ☕ Coffee Cup (default)
- 🫘 Coffee Beans
- 🌿 Leaf

### 2. **Name Field** (Simplified)
- ❌ Sebelumnya: Nama Depan + Nama Belakang (2 field)
- ✅ Sekarang: Nama Lengkap (1 field)
- Contoh: "Budi Santoso" → otomatis dipecah menjadi firstName & lastName

### 3. **Email Verification** (NEW!)
- ✅ Kirim kode 6-digit ke email pengguna
- ✅ Countdown timer (60 detik)
- ✅ Resend kode jika habis
- ✅ Max 3 percobaan salah
- ✅ Kode berlaku 10 menit

### 4. **Aesthetic Enhancements**
- ✅ Smooth fade-in animations untuk input fields
- ✅ Pop-in animation untuk avatar buttons
- ✅ Slide-up animation untuk verification section
- ✅ Focus glow effect pada input fields
- ✅ Smooth transitions & hover effects
- ✅ Professional email template dengan styling

---

## 🚀 Setup & Menjalankan

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Gmail (Optional)
Untuk mengirim email verifikasi via Gmail:

1. Buka: https://myaccount.google.com/apppasswords
2. Buat App Password untuk "Mail" & "Windows"
3. Copy password yang digenerate
4. Buat file `.env` di folder project:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_generated_app_password
```

**Atau gunakan demo mode tanpa email** (kode: 123456)

### Step 3: Jalankan Backend
```bash
npm start
```

✅ Akan muncul:
```
🚀 Kopi Kuba Server berjalan pada http://localhost:3000
✅ Users table initialized
```

### Step 4: Jalankan Frontend
PowerShell baru:
```bash
python -m http.server 8000
```

Buka browser: `http://localhost:8000/register.html`

---

## 🧪 Test Registrasi

### Demo Mode (Tanpa Email Backend):
```
Nama Lengkap: Budi Santoso
Email: budi@example.com
No. Telepon: 081234567890
Password: password123
Konfirmasi: password123
Avatar: Pilih satu
Verifikasi: 123456
```

### Dengan Email Real:
```
1. Isi semua form
2. Sistem akan kirim kode ke email Anda
3. Cek inbox email (atau spam folder)
4. Masukkan 6-digit kode
5. Registrasi selesai!
```

---

## 🎨 Animasi yang Ditambahkan

| Elemen | Efek |
|--------|------|
| Input Fields | Fade-in dengan delay bertahap |
| Avatar Buttons | Pop-in zoom effect |
| Verification Section | Slide-up smooth entrance |
| Input Focus | Glow effect dengan background change |
| Buttons | Translate & box-shadow on hover |
| Success Messages | Slide & fade animations |

---

## 📧 Email Verification Flow

```
1. User mengisi form registrasi
2. Klik "Daftar Sekarang"
3. Form tersembunyi → Verification section muncul (animated)
4. Sistem kirim kode via email
5. Email diterima dengan template profesional
6. User masukkan kode (6 digit, max 3 attempt)
7. Jika benar → Registrasi complete → Redirect ke login
8. Jika salah → Pesan error dengan sisa attempt
```

---

## 🛡️ Keamanan

- ✅ Password di-hash dengan bcryptjs
- ✅ Kode verifikasi random 6 digit
- ✅ Kode expire setelah 10 menit
- ✅ Max 3 percobaan verifikasi
- ✅ Email validation
- ✅ Phone validation

---

## 📁 File yang Diupdate

| File | Perubahan |
|------|-----------|
| register.html | Avatar options, single name field, verification UI, CSS animations |
| app.js | Login dengan fallback API |
| server.js | Email verification endpoints |
| package.json | Add nodemailer dependency |

---

## 🔧 Troubleshooting

### Email tidak terkirim?
- Pastikan Gmail App Password sudah di `.env`
- Cek spam folder email
- Gunakan demo mode (kode: 123456)

### Verification code expired?
- Klik "Kirim Ulang Kode"
- Tunggu email baru

### Port 3000 sudah dipakai?
Edit `server.js`:
```javascript
const PORT = 3001; // Ubah ke port lain
```

### Animasi tidak jalan?
- Clear browser cache (Ctrl+Shift+Del)
- Refresh halaman (F5)
- Pastikan browser support CSS animations

---

## 💡 Features yang Bisa Ditambahkan Nanti

- [ ] SMS verification (alternatif email)
- [ ] Social login (Google, Facebook)
- [ ] Password strength meter (sudah ada)
- [ ] Forgot password flow
- [ ] User profile update
- [ ] Account activation via link
- [ ] Rate limiting untuk security

---

## 📞 Need Help?

Cek file:
- **Database docs**: DATABASE-SETUP.md
- **Quick start**: BACKEND-SETUP-RINGKAS.md
- **API testing**: API-TESTING.rest

---

**Status**: ✅ Production Ready untuk demo | ☕ Proper Web Standard

Made with love for Kopi Kuba
