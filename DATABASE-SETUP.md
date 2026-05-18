# 📦 Setup Database & Backend

Panduan lengkap untuk menjalankan database dan backend server.

## ✅ Prerequisites

Pastikan sudah install:
- **Node.js** (v14 atau lebih baru) - Download dari https://nodejs.org
- **npm** (biasanya sudah include dengan Node.js)

Verifikasi:
```bash
node --version
npm --version
```

---

## 🚀 Langkah Setup

### 1️⃣ Install Dependencies

Buka PowerShell/Terminal di folder `kopi projrect` dan jalankan:

```bash
npm install
```

Ini akan menginstall:
- **express** - Web framework
- **sqlite3** - Database
- **bcryptjs** - Password hashing (keamanan)
- **cors** - Cross-origin requests
- **body-parser** - Parse JSON

### 2️⃣ Jalankan Server

```bash
npm start
```

atau

```bash
node server.js
```

Jika berhasil, akan muncul:
```
🚀 Kopi Kuba Server berjalan pada http://localhost:3000
📦 Database: c:\Users\Aliyya\Desktop\kopi projrect\kopikuba.db
✅ Users table initialized
✅ Orders table initialized
```

### 3️⃣ Buka Website

Dalam PowerShell baru, jalankan:
```bash
python -m http.server 8000
```

Kemudian buka browser: `http://localhost:8000`

---

## 📚 Endpoint API yang Tersedia

### Register User
**POST** `/api/register`

Request:
```json
{
  "firstName": "Budi",
  "lastName": "Santoso",
  "email": "budi@email.com",
  "phone": "+62812345678",
  "password": "password123",
  "avatar": "☕"
}
```

Response:
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login",
  "userId": 1
}
```

---

### Login User
**POST** `/api/login`

Request:
```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "firstName": "Budi",
    "lastName": "Santoso",
    "email": "budi@email.com",
    "phone": "+62812345678",
    "avatar": "☕"
  }
}
```

---

### Get User Profile
**GET** `/api/user/:id`

Contoh: `/api/user/1`

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "firstName": "Budi",
    "lastName": "Santoso",
    "email": "budi@email.com",
    "phone": "+62812345678",
    "avatar": "☕",
    "createdAt": "2025-05-18 10:30:45"
  }
}
```

---

### Update User Profile
**PUT** `/api/user/:id`

Request:
```json
{
  "firstName": "Budi",
  "lastName": "Santoso",
  "phone": "+62812345678",
  "avatar": "🌙"
}
```

Response:
```json
{
  "success": true,
  "message": "Profil berhasil diupdate"
}
```

---

### Get All Users
**GET** `/api/users`

Response:
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "firstName": "Budi",
      "lastName": "Santoso",
      "email": "budi@email.com",
      "phone": "+62812345678",
      "avatar": "☕",
      "createdAt": "2025-05-18 10:30:45"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Tabel: users

```sql
CREATE TABLE users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName       TEXT NOT NULL,
  lastName        TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  password        TEXT NOT NULL (hashed with bcryptjs),
  avatar          TEXT DEFAULT '☕',
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tabel: orders

```sql
CREATE TABLE orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  userId          INTEGER NOT NULL,
  items           TEXT NOT NULL (JSON format),
  totalPrice      REAL NOT NULL,
  status          TEXT DEFAULT 'pending',
  createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
)
```

---

## 🔍 Cek Database

Database disimpan di: `c:\Users\Aliyya\Desktop\kopi projrect\kopikuba.db`

Untuk melihat data menggunakan SQLite viewer (opsional):
1. Download DB Browser for SQLite: https://sqlitebrowser.org
2. Buka file `kopikuba.db` dengan DB Browser
3. Lihat tabel `users` untuk data registrasi

---

## ⚠️ Troubleshooting

### Port 3000 sudah dipakai?
Ganti port di `server.js`:
```javascript
const PORT = 3000; // Ubah ke 3001, 3002, dll
```

### Module not found error?
```bash
npm install --save
```

### Connection error saat register/login?
- Pastikan server sudah berjalan di `http://localhost:3000`
- Cek di PowerShell bahwa tidak ada error
- Coba refresh halaman browser

---

## 🎯 Next Steps

Sekarang data user akan tersimpan di database SQLite!

Fitur yang bisa ditambahkan:
- ✅ Update profil user
- ✅ Forgot password
- ✅ Email verification
- ✅ Order history
- ✅ Admin panel

---

**Made with ☕ for Kopi Kuba**
