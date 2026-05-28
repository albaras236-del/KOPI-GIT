const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'kopikuba.db');
const db = new sqlite3.Database(dbPath);

const categories = [
  ['white-milk', 'White-Milk', 'Kopi susu dan menu creamy untuk pesanan harian.', 1],
  ['black', 'Black', 'Kopi hitam, espresso based, dan beans origin Indonesia.', 2],
  ['non-coffee', 'Non-Coffee', 'Minuman tanpa kopi untuk semua pelanggan.', 3],
  ['kudapan', 'Kudapan', 'Roti dan camilan pendamping kopi.', 4]
];

const products = [
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

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function addColumnIfMissing(tableName, columnName, columnDefinition) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  }
}

async function migrateOrdersIfNeeded() {
  const columns = await all('PRAGMA table_info(orders)');
  const userId = columns.find((column) => column.name === 'userId');
  const items = columns.find((column) => column.name === 'items');

  if ((!userId || userId.notnull === 0) && (!items || items.notnull === 0)) {
    return;
  }

  await run('PRAGMA foreign_keys = OFF');
  await run('BEGIN TRANSACTION');
  try {
    await run(`
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

    await run(`
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

    await run('DROP TABLE orders');
    await run('ALTER TABLE orders_migrated RENAME TO orders');
    await run('COMMIT');
  } catch (err) {
    await run('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    await run('PRAGMA foreign_keys = ON');
  }
}

async function setup() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
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

  await run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      sortOrder INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
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

  await run(`
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

  await addColumnIfMissing('users', 'role', "TEXT DEFAULT 'customer'");
  await addColumnIfMissing('orders', 'customerName', 'TEXT');
  await addColumnIfMissing('orders', 'customerEmail', 'TEXT');
  await addColumnIfMissing('orders', 'customerPhone', 'TEXT');
  await addColumnIfMissing('orders', 'paymentStatus', "TEXT DEFAULT 'unpaid'");
  await addColumnIfMissing('orders', 'notes', 'TEXT');
  await addColumnIfMissing('orders', 'updatedAt', 'DATETIME');
  await migrateOrdersIfNeeded();

  await run(`
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

  await run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await run('CREATE INDEX IF NOT EXISTS idx_products_category ON products(categoryId)');
  await run('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(userId)');
  await run('CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(orderId)');

  for (const category of categories) {
    await run(
      `INSERT INTO categories (slug, name, description, sortOrder)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         description = excluded.description,
         sortOrder = excluded.sortOrder`,
      category
    );
  }

  for (const product of products) {
    const [name, categorySlug, description, price, unit, imageUrl, isAvailable, sortOrder] = product;
    await run(
      `INSERT INTO products (name, categoryId, description, price, unit, imageUrl, isAvailable, sortOrder)
       SELECT ?, (SELECT id FROM categories WHERE slug = ?), ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = ?)`,
      [name, categorySlug, description, price, unit, imageUrl, isAvailable, sortOrder, name]
    );
  }

  const summary = {
    users: await all('SELECT COUNT(*) AS count FROM users'),
    categories: await all('SELECT COUNT(*) AS count FROM categories'),
    products: await all('SELECT COUNT(*) AS count FROM products'),
    orders: await all('SELECT COUNT(*) AS count FROM orders')
  };

  console.log('Database siap:', dbPath);
  console.log(`Users: ${summary.users[0].count}`);
  console.log(`Categories: ${summary.categories[0].count}`);
  console.log(`Products: ${summary.products[0].count}`);
  console.log(`Orders: ${summary.orders[0].count}`);
}

setup()
  .catch((err) => {
    console.error('Setup database gagal:', err.message);
    process.exitCode = 1;
  })
  .finally(() => {
    db.close();
  });