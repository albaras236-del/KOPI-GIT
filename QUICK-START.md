# 🚀 QUICK START COMMANDS

## 1️⃣ First Time Setup

```bash
npm install
```

**Expected output:**
```
added 47 packages, and audited 48 packages in 8s
```

---

## 2️⃣ Start Backend Server

```bash
npm start
```

**Expected output:**
```
🚀 Kopi Kuba Server berjalan pada http://localhost:3000
📦 Database: c:\Users\Aliyya\Desktop\kopi projrect\kopikuba.db
✅ Users table initialized
✅ Orders table initialized

Endpoint tersedia:
- POST   /api/register
- POST   /api/send-verification
- POST   /api/verify-code
- POST   /api/login
...
```

**Keep this window open!** ← Don't close

---

## 3️⃣ Start Frontend (New PowerShell)

```bash
python -m http.server 8000
```

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

## 4️⃣ Open in Browser

### Register
```
http://localhost:8000/register.html
```

### Login
```
http://localhost:8000/login.html
```

### Main Site
```
http://localhost:8000/index.html
```

---

## 5️⃣ Test Registration

```
Nama Lengkap: Budi Santoso
Email: budi@example.com
No. Telepon: 081234567890
Password: password123
Konfirmasi: password123
Avatar: ☕ (atau pilih yg lain)
Kode Verifikasi: 123456 (demo mode)
```

---

## 🛑 Stop Servers

Press `Ctrl + C` di masing-masing terminal

---

## 📝 Setup Gmail (Optional)

Jika ingin kirim email real:

1. Buka: https://myaccount.google.com/apppasswords
2. Select "Mail" & "Windows"
3. Copy password yang digenerate (16 karakter)
4. Create file `.env`:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_password
```

5. Restart server (`npm start`)

---

## 🔍 Check Database

Option A: DB Browser (GUI)
- Download: https://sqlitebrowser.org
- Buka: `kopikuba.db`
- Lihat tabel `users`

Option B: Command line
```bash
sqlite3 kopikuba.db
sqlite> SELECT * FROM users;
```

---

## 📊 Troubleshooting

### "npm not found"
Install Node.js: https://nodejs.org

### "Port 3000 in use"
Edit server.js, ganti `PORT = 3001`

### "python command not found"
Windows: Gunakan `py -m http.server 8000`

### "Database locked"
Restart server atau close DB Browser

### Email tidak terkirim
- Pastikan `.env` ada dan benar
- Cek Gmail App Password (bukan main password)
- Gunakan demo mode (kode: 123456)

---

## 🎨 Test All Features

### Form Validation
- ❌ Submit kosong → Error message
- ❌ Email invalid → Error message
- ❌ Phone < 9 digits → Error message
- ❌ Password < 6 char → Error message
- ❌ Password tidak match → Error message
- ❌ Terms unchecked → Error message

### Verification
- ✅ Enter 6 digit code → Success
- ❌ Enter wrong code → Error (3 attempts)
- ⏱️ Wait 60s → Resend button active
- ✅ Resend code → Get new code

### Success Flow
- ✅ All validations pass
- ✅ Code verified
- ✅ All 3 dots active (animation)
- ✅ Toast notification
- ✅ Redirect to login

---

## 📱 Test Responsif

Browser DevTools: `F12` → Device mode (Ctrl+Shift+M)

Test pada:
- 📱 Mobile 375px
- 📱 Tablet 768px
- 💻 Desktop 1024px+

---

## 🐛 Debug Mode

Buka browser console: `F12` → Console

Akan melihat:
```
✅ Backend tersedia
❌ Backend error → Fallback ke localStorage
🔐 Registered via: API | localStorage
```

---

Made with ☕ for Kopi Kuba
