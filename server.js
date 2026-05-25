const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'kopikuba.db');

const seedCategories = [
  ['white-milk', 'White-Milk', 'Kopi susu dan menu creamy untuk pesanan harian.', 1],
  ['black', 'Black', 'Kopi hitam, espresso based, dan beans origin Indonesia.', 2],
  ['non-coffee', 'Non-Coffee', 'Minuman tanpa kopi untuk semua pelanggan.', 3],
  ['kudapan', 'Kudapan', 'Roti dan camilan pendamping kopi.', 4]
];

const seedProducts = [
  ['Es Kopi Susu Kuba', 'white-milk', 'Espresso, susu segar, dan gula aren.', 22000, 'cup', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&auto=format&fit=crop&q=70', 1, 1],
  ['Kopi Susu Aren Panas', 'white-milk', 'Kopi susu hangat dengan gula aren.', 24000, 'cup', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=700&auto=format&fit=crop&q=70', 1, 2],
  ['Americano', 'black', 'Espresso dan air, clean untuk daily coffee.', 20000, 'cup', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=700&auto=format&fit=crop&q=70', 1, 3],
  ['Cold Brew Kuba', 'black', 'Kopi dingin slow brew dengan body ringan.', 26000, 'bottle', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&auto=format&fit=crop&q=70', 1, 4],
  ['Coklat Susu', 'non-coffee', 'Coklat creamy untuk teman nongkrong.', 25000, 'cup', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=700&auto=format&fit=crop&q=70', 1, 5],
  ['Teh Lemon', 'non-coffee', 'Teh segar dengan lemon ringan.', 18000, 'cup', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&auto=format&fit=crop&q=70', 1, 6],
  ['Roti Bakar Gula Aren', 'kudapan', 'Roti panggang manis untuk teman kopi.', 18000, 'portion', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=700&auto=format&fit=crop&q=70', 1, 7],
  ['Brownies Kopi', 'kudapan', 'Brownies coklat dengan aroma kopi.', 20000, 'piece', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=700&auto=format&fit=crop&q=70', 1, 8],
  ['Aceh Gayo Beans', 'black', 'Biji kopi Aceh Tengah, bold dan earthy.', 150000, '250gr', 'https://plus.unsplash.com/premium_photo-1666976503799-4ef00906ab2b?w=700&auto=format&fit=crop&q=70', 1, 9],
  ['Toraja Beans', 'black', 'Biji kopi Sulawesi Selatan, kompleks dan fruity.', 140000, '250gr', 'https://images.unsplash.com/photo-1660071139672-55a1607f72fe?w=700&auto=format&fit=crop&q=70', 1, 10],
  ['Kintamani Bali Beans', 'black', 'Biji kopi Bali, bright dan citrusy.', 160000, '250gr', 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?w=700&auto=format&fit=crop&q=70', 1, 11],
  ['Flores Bajawa Beans', 'black', 'Biji kopi NTT, dark chocolate dan nutty.', 155000, '250gr', 'https://images.unsplash.com/photo-1561986845-fbeb7f7913d8?w=700&auto=format&fit=crop&q=70', 1, 12]
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

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
  console.log('Email service not configured. Using demo mode.');
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }

  console.log('Connected to SQLite database:', dbPath);
  initializeDatabase();
});

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function addColumnIfMissing(tableName, columnName, columnDefinition) {
  const columns = await dbAll(`PRAGMA table_info(${tableName})`);
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    await dbRun(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  }
}

async function migrateOrdersIfNeeded() {
  const columns = await dbAll('PRAGMA table_info(orders)');
  const userId = columns.find((column) => column.name === 'userId');
  const items = columns.find((column) => column.name === 'items');

  if ((!userId || userId.notnull === 0) && (!items || items.notnull === 0)) {
    return;
  }

  await dbRun('PRAGMA foreign_keys = OFF');
  await dbRun('BEGIN TRANSACTION');
  try {
    await dbRun(`
      CREATE TABLE orders_migrated (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        customerName TEXT,
        customerEmail TEXT,
        customerPhone TEXT,
        items TEXT,
        totalPrice INTEGER NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        paymentStatus TEXT DEFAULT 'unpaid',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await dbRun(`
      INSERT INTO orders_migrated (
        id, userId, customerName, customerEmail, customerPhone, items,
        totalPrice, status, paymentStatus, notes, createdAt, updatedAt
      )
      SELECT
        id, userId, customerName, customerEmail, customerPhone, items,
        CAST(totalPrice AS INTEGER), status, paymentStatus, notes, createdAt,
        COALESCE(updatedAt, createdAt)
      FROM orders
    `);

    await dbRun('DROP TABLE orders');
    await dbRun('ALTER TABLE orders_migrated RENAME TO orders');
    await dbRun('COMMIT');
  } catch (err) {
    await dbRun('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    await dbRun('PRAGMA foreign_keys = ON');
  }
}

async function initializeDatabase() {
  try {
    await dbRun('PRAGMA foreign_keys = ON');

    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        avatar TEXT DEFAULT '☕',
        role TEXT DEFAULT 'customer',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        sortOrder INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        categoryId INTEGER NOT NULL,
        description TEXT,
        price INTEGER NOT NULL CHECK (price >= 0),
        unit TEXT DEFAULT 'pcs',
        imageUrl TEXT,
        isAvailable INTEGER DEFAULT 1,
        sortOrder INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        customerName TEXT,
        customerEmail TEXT,
        customerPhone TEXT,
        items TEXT,
        totalPrice INTEGER NOT NULL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        paymentStatus TEXT DEFAULT 'unpaid',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        productId INTEGER,
        productName TEXT NOT NULL,
        unitPrice INTEGER NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        subtotal INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    await addColumnIfMissing('users', 'role', "TEXT DEFAULT 'customer'");
    await addColumnIfMissing('orders', 'customerName', 'TEXT');
    await addColumnIfMissing('orders', 'customerEmail', 'TEXT');
    await addColumnIfMissing('orders', 'customerPhone', 'TEXT');
    await addColumnIfMissing('orders', 'paymentStatus', "TEXT DEFAULT 'unpaid'");
    await addColumnIfMissing('orders', 'notes', 'TEXT');
    await addColumnIfMissing('orders', 'updatedAt', 'DATETIME');
    await migrateOrdersIfNeeded();

    await dbRun('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_products_category ON products(categoryId)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId)');
    await dbRun('CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(orderId)');

    await seedMenuData();
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
}

async function seedMenuData() {
  for (const category of seedCategories) {
    await dbRun(
      `INSERT INTO categories (slug, name, description, sortOrder)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         sortOrder = excluded.sortOrder`,
      category
    );
  }

  for (const product of seedProducts) {
    const [name, categorySlug, description, price, unit, imageUrl, isAvailable, sortOrder] = product;
    await dbRun(
      `INSERT INTO products (name, categoryId, description, price, unit, imageUrl, isAvailable, sortOrder)
       SELECT ?, (SELECT id FROM categories WHERE slug = ?), ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = ?)`,
      [name, categorySlug, description, price, unit, imageUrl, isAvailable, sortOrder, name]
    );
  }
}

function hashPassword(password) {
  return bcryptjs.hashSync(password, 10);
}

function comparePassword(password, hash) {
  return bcryptjs.compareSync(password, hash);
}

function parseOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  return items.map((item) => ({
    productId: item.productId || item.id || null,
    productName: item.productName || item.name,
    unitPrice: Number(item.unitPrice || item.price || 0),
    quantity: Number(item.quantity || item.qty || 1)
  })).filter((item) => item.productName && item.unitPrice >= 0 && item.quantity > 0);
}

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Backend server running' });
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await dbAll('SELECT * FROM categories ORDER BY sortOrder, name');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil kategori' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const params = [];
    let where = 'WHERE p.isAvailable = 1';

    if (req.query.category) {
      where += ' AND c.slug = ?';
      params.push(req.query.category);
    }

    const products = await dbAll(
      `SELECT
         p.id, p.name, p.description, p.price, p.unit, p.imageUrl, p.isAvailable,
         c.slug AS categorySlug, c.name AS categoryName
       FROM products p
       JOIN categories c ON c.id = p.categoryId
       ${where}
       ORDER BY c.sortOrder, p.sortOrder, p.name`,
      params
    );

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil produk' });
  }
});

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, phone, password, avatar } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Semua field harus diisi (nama, email, password)' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
  }

  try {
    const existing = await dbGet('SELECT email FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar, gunakan email lain' });
    }

    const hashedPassword = hashPassword(password);
    const result = await dbRun(
      `INSERT INTO users (firstName, lastName, email, phone, password, avatar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, hashedPassword, avatar || '☕']
    );

    if (transporter) {
      transporter.sendMail({
        from: process.env.EMAIL_USER || 'kopikuba.verify@gmail.com',
        to: email,
        subject: 'Selamat! Akun Kopi Kuba Anda Sudah Terdaftar',
        html: `
          <div style="font-family: Arial; background: #1e1313; color: #f5e6c4; padding: 32px; border-radius: 14px;">
            <h1 style="color: #d4a373;">Kopi Kuba</h1>
            <p>Halo ${firstName}, akun Anda berhasil dibuat.</p>
            <p>Email terdaftar: <strong>${email}</strong></p>
          </div>
        `
      }).catch((emailErr) => {
        console.warn('Could not send registration email:', emailErr.message);
      });
    }

    res.json({ success: true, message: 'Registrasi berhasil! Silakan login', userId: result.lastID });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mendaftar' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password harus diisi' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan database' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, firstName, lastName, email, phone, avatar, role, createdAt FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan database' });
  }
});

app.put('/api/user/:id', async (req, res) => {
  const { firstName, lastName, phone, avatar } = req.body;

  try {
    await dbRun(
      `UPDATE users
       SET firstName = ?, lastName = ?, phone = ?, avatar = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [firstName, lastName, phone, avatar, req.params.id]
    );

    res.json({ success: true, message: 'Profil berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat update profil' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, firstName, lastName, email, phone, avatar, role, createdAt FROM users');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan database' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { userId, customerName, customerEmail, customerPhone, items, notes } = req.body;
  const parsedItems = parseOrderItems(items);

  if (parsedItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Item pesanan masih kosong' });
  }

  const totalPrice = parsedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  try {
    await dbRun('BEGIN TRANSACTION');
    const order = await dbRun(
      `INSERT INTO orders (userId, customerName, customerEmail, customerPhone, items, totalPrice, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, customerName || null, customerEmail || null, customerPhone || null, JSON.stringify(parsedItems), totalPrice, notes || null]
    );

    for (const item of parsedItems) {
      await dbRun(
        `INSERT INTO order_items (orderId, productId, productName, unitPrice, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [order.lastID, item.productId, item.productName, item.unitPrice, item.quantity, item.unitPrice * item.quantity]
      );
    }

    await dbRun('COMMIT');
    res.json({ success: true, message: 'Pesanan berhasil dibuat', orderId: order.lastID, totalPrice });
  } catch (err) {
    await dbRun('ROLLBACK').catch(() => {});
    console.error('Order error:', err.message);
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders ORDER BY createdAt DESC');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil pesanan' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    const items = await dbAll('SELECT * FROM order_items WHERE orderId = ?', [req.params.id]);
    res.json({ success: true, order, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan' });
  }
});

app.listen(PORT, () => {
  console.log(`Kopi Kuba Server berjalan pada http://localhost:${PORT}`);
  console.log(`Database: ${dbPath}`);
  console.log('Endpoint: /api/register, /api/login, /api/products, /api/orders');
});

process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close(() => {
    console.log('Database connection closed');
    process.exit(0);
  });
});
