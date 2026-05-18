# 🗄️ DATABASE & BACKEND SETUP RINGKAS

## ⚡ Quick Start (5 Menit)

### 1. Install Node.js Dependencies
Buka PowerShell/Terminal di folder project:
```bash
npm install
```

### 2. Jalankan Backend Server
```bash
npm start
```
atau klik file `start-server.bat` (Windows)

✅ Jika berhasil, akan muncul:
```
🚀 Kopi Kuba Server berjalan pada http://localhost:3000
✅ Users table initialized
✅ Orders table initialized
```

### 3. Jalankan Frontend
Buka PowerShell baru:
```bash
python -m http.server 8000
```

Buka browser: `http://localhost:8000`

---

## 📋 File-file yang Ditambahkan

| File | Deskripsi |
|------|-----------|
| `server.js` | Node.js Express backend server |
| `package.json` | Dependencies configuration |
| `kopikuba.db` | SQLite database (auto-created) |
| `DATABASE-SETUP.md` | Dokumentasi lengkap |
| `start-server.bat` | Quick start untuk Windows |
| `start-server.sh` | Quick start untuk macOS/Linux |
| `API-TESTING.rest` | Test API endpoints |
| `.env.example` | Environment configuration template |

---

## 🔄 Perubahan di Frontend

### register.html
- ✅ `handleRegister()` sekarang kirim data ke API `/api/register`
- ✅ Password di-hash dengan bcryptjs di backend (aman)
- ✅ Email validation di backend

### app.js
- ✅ `handleLogin()` sekarang kirim request ke API `/api/login`
- ✅ Session disimpan dari response API
- ✅ User data dari database, bukan localStorage

---

## 🗄️ Database Structure

### Tabel: users
```
id (PK)       | firstName | lastName | email | phone | password | avatar | createdAt | updatedAt
1             | Budi      | Santoso  | ...   | ...   | ***      | ☕     | ...       | ...
```

### Tabel: orders
```
id (PK) | userId | items | totalPrice | status  | createdAt
1       | 1      | [...] | 50000      | pending | ...
```

---

## ✅ Fitur yang Sudah Jalan

- [x] Registrasi user → data tersimpan di database
- [x] Login user → validasi dari database
- [x] Password di-hash (bcryptjs)
- [x] Email unique validation
- [x] Get user profile
- [x] Update user profile
- [x] CORS enabled untuk frontend

---

## 🆘 Troubleshooting

### Error: "Cannot find module 'express'"
```bash
npm install
```

### Error: "EADDRINUSE :::3000"
Port 3000 sudah dipakai. Edit `server.js`:
```javascript
const PORT = 3001; // Ubah ke port lain
```

### Error: "Gagal terhubung ke server"
- Pastikan server sudah dijalankan (`npm start`)
- Pastikan tidak ada error di terminal server
- Refresh halaman browser

### Data tidak tersimpan?
- Cek apakah register berhasil (success message)
- Lihat file `kopikuba.db` sudah ada di folder project
- Lihat database dengan DB Browser for SQLite

---

## 📚 Dokumentasi Lengkap

Lihat file: [DATABASE-SETUP.md](DATABASE-SETUP.md)

Berisi:
- Semua endpoint API dengan contoh
- Database schema lengkap
- Error handling
- Future features

---

## 🚀 Langkah Selanjutnya (Optional)

1. **Email Verification** - Verifikasi email saat register
2. **Forgot Password** - Reset password via email
3. **Update Profile** - User bisa edit profil
4. **Order History** - Tracking pembelian
5. **Admin Panel** - Dashboard untuk admin
6. **Payment Integration** - Integrasi payment gateway

---

**Status**: ✅ Production Ready untuk demo

Untuk soal keamanan production:
- Gunakan environment variables
- Implement JWT authentication
- Setup HTTPS
- Database encryption

---

**Made with ☕ by Kopi Kuba**
