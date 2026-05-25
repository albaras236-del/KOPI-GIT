const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Setup email transporter (fallback to dummy mode if not configured)
let transporter = null;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'kopikuba.verify@gmail.com',
      pass: process.env.EMAIL_PASS || 'your_app_password_here'
    }
  });
} catch (err) {
  console.log('⚠️  Email service not configured. Using demo mode.');
}

// Initialize database
const dbPath = path.join(__dirname, 'kopikuba.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database:', dbPath);
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '☕',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('✅ Users table initialized');
      }
    });

    // Create orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        items TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating orders table:', err.message);
      } else {
        console.log('✅ Orders table initialized');
      }
    });
  });
}

// Helper function to hash password
function hashPassword(password) {
  return bcryptjs.hashSync(password, 10);
}

// Helper function to compare password
function comparePassword(password, hash) {
  return bcryptjs.compareSync(password, hash);
}

// ===== API ENDPOINTS =====

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server running ✅' });
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, phone, password, avatar } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Semua field harus diisi (nama, email, password)'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password minimal 6 karakter'
    });
  }

  // Check if email already exists
  db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan database'
      });
    }

    if (row) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar, gunakan email lain'
      });
    }

    // Hash password and insert user
    const hashedPassword = hashPassword(password);
    db.run(
      `INSERT INTO users (firstName, lastName, email, phone, password, avatar) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, hashedPassword, avatar || '☕'],
      function(err) {
        if (err) {
          console.error('Registration error:', err.message);
          return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mendaftar'
          });
        }

        // Send welcome notification email
        if (transporter) {
          transporter.sendMail({
            from: process.env.EMAIL_USER || 'kopikuba.verify@gmail.com',
            to: email,
            subject: 'Selamat! Akun Kopi Kuba Anda Sudah Terdaftar',
            html: `
              <div style="font-family: 'Poppins', Arial; background: #1e1313; color: #f5e6c4; padding: 36px; border-radius: 16px; text-align: center;">
                <h1 style="color: #d4a373; margin-bottom: 12px;">☕ Kopi Kuba</h1>
                <p style="margin: 0 0 18px; color: #c4a8a8; font-size: 15px;">Halo ${firstName},</p>
                <p style="margin: 0 0 22px; color: #d4a373; font-size: 16px;">Akun Anda telah berhasil dibuat di database Kopi Kuba.</p>
                <div style="background: rgba(212, 163, 115, 0.1); padding: 18px; border-radius: 14px; margin: 0 auto 20px; max-width: 360px;">
                  <p style="margin: 0; color: #f5e6c4; font-size: 14px;">Email terdaftar: <strong style='color: #ffffff;'>${email}</strong></p>
                  <p style="margin: 8px 0 0 0; color: #c4a8a8; font-size: 13px;">Silakan login dan nikmati pilihan kopi Nusantara terbaik.</p>
                </div>
                <p style="margin: 0; color: #a8a8a8; font-size: 12px;">Jika Anda tidak melakukan pendaftaran ini, abaikan email ini.</p>
              </div>
            `
          }).then(() => {
            console.log('✅ Registration email notification sent to', email);
          }).catch((emailErr) => {
            console.warn('⚠️ Could not send registration email:', emailErr.message);
          });
        }

        res.json({
          success: true,
          message: 'Registrasi berhasil! Silakan login',
          userId: this.lastID
        });
      }
    );
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password harus diisi'
    });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan database'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    if (!comparePassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Login successful
    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  });
});

// Get user profile
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan database'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  });
});

// Update user profile
app.put('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, phone, avatar } = req.body;

  db.run(
    `UPDATE users SET firstName = ?, lastName = ?, phone = ?, avatar = ?, updatedAt = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [firstName, lastName, phone, avatar, userId],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Terjadi kesalahan saat update profil'
        });
      }

      res.json({
        success: true,
        message: 'Profil berhasil diupdate'
      });
    }
  );
});

// Get all users (admin only - for testing)
app.get('/api/users', (req, res) => {
  db.all('SELECT id, firstName, lastName, email, phone, avatar, createdAt FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan database'
      });
    }

    res.json({
      success: true,
      users: rows || []
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 Kopi Kuba Server berjalan pada http://localhost:${PORT}
    📦 Database: ${dbPath}
    
    Endpoint tersedia:
    - POST   /api/register
    - POST   /api/login
    - GET    /api/user/:id
    - PUT    /api/user/:id
    - GET    /api/users
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📴 Closing database connection...');
  db.close(() => {
    console.log('✅ Database connection closed');
    process.exit(0);
  });
});
