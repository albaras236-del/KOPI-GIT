<?php
session_start();
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keranjang - Kopi Kuba</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css?v=1003">
  
  <script>
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
      corePlugins: { preflight: false },
      theme: {
        extend: {
          colors: {
            kopi: '#2b1d1d',
            kuba: '#d4a373',
            cream: '#f5e6c4'
          },
          fontFamily: {
            display: ['Playfair Display', 'serif'],
            body: ['Poppins', 'sans-serif']
          }
        }
      }
    };
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-kopi text-cream">

  <div class="toast-container" id="toast-container"></div>

  <header>
    <div class="logo logo-brand" onclick="window.location.href='index.php'" aria-label="Beranda Kopi Kuba" style="cursor:pointer;">
      <span class="logo-mark">☕</span>
      <div class="logo-text">
        <strong>Kopi Kuba</strong>
        <small>Rasa Nusantara</small>
      </div>
    </div>
    <nav id="main-nav">
      <a href="index.php">Beranda</a>
      
      <?php if(isset($_SESSION['user_id'])): ?>
          <a href="#" style="color: #d4a373; font-weight: 600;" onclick="showLogoutModal(event)">
              👤 <?= htmlspecialchars($_SESSION['username']); ?> (Keluar)
          </a>
      <?php else: ?>
          <a href="login.php">Login</a>
      <?php endif; ?>

      <a href="keranjang.php" class="cart-link nav-active">🛒 Keranjang <span class="cart-badge" id="cart-count">0</span></a>
    </nav>
  </header>

  <div id="kuba-checkout-overlay" class="fixed inset-0 z-[9999] hidden items-center justify-center bg-black/70 backdrop-blur-sm">
    <div id="kuba-checkout-modal-box" class="bg-kopi border-2 border-cream text-white rounded-xl p-8 text-center max-w-sm w-full mx-4 shadow-2xl scale-95 transition-transform duration-300">
      <div id="checkout-dynamic-content"></div>
      <button onclick="kubaCloseCheckout()" class="mt-6 px-5 py-2.5 bg-kuba text-white rounded-lg hover:bg-[#b0855a] font-bold w-full transition-all border-none cursor-pointer">Selesai & Tutup</button>
    </div>
  </div>

  <div id="logout-modal" class="fixed inset-0 z-[9999] hidden items-center justify-center logout-modal-overlay backdrop-blur-sm opacity-0 transition-opacity duration-300">
    <div class="logout-modal-card p-8 rounded-3xl text-center max-w-sm w-full mx-4 border-2 border-cream scale-95 transition-transform duration-300">
      <div class="logout-modal-icon">☕✨</div>
      <h3 class="text-white font-display text-3xl font-extrabold mb-2 tracking-tight">Konfirmasi Keluar</h3>
      <p class="text-white/90 font-body text-sm mb-4">
        Yakin mau keluar dari akun <strong class="text-kopi font-black text-base"><?= isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : ''; ?></strong>?
      </p>
      <p class="logout-modal-copy text-cream font-display text-base leading-relaxed mb-8 px-4">
        Sampai jumpa lagi di cangkir berikutnya — semoga aroma Kopi Kuba selalu membuat hari kamu hangat dan berkesan.
      </p>
      <div class="logout-modal-actions flex flex-col gap-3 sm:flex-row justify-center font-body">
        <button onclick="closeLogoutModal()" class="px-5 py-2.5 rounded-full bg-transparent border-2 border-kopi text-kopi hover:bg-kopi hover:text-white transition-all font-semibold cursor-pointer">Batal</button>
        <a href="logout.php" class="px-5 py-2.5 rounded-full bg-kopi text-white hover:bg-[#1a1111] transition-all font-semibold no-underline">Ya, Keluar</a>
      </div>
    </div>
  </div>

  <div class="cart-page" style="min-height:100vh; padding-top: 100px;">
    <div id="cart">
      <div class="cart-header">
        <h2>Keranjang Belanja</h2>
        <span class="cart-header-count" id="cart-header-count">0 item</span>
      </div>
      
      <ul id="cart-items"></ul>
      
      <div id="cart-summary" class="cart-summary" style="display:none;">
        <div class="cart-total-row">
          <span class="cart-total-label">Total</span>
          <span class="cart-total-value">Rp <span id="cart-total">0</span></span>
        </div>

        <div class="mt-4 mb-5 p-4 bg-[#3a2828] rounded-lg border border-kuba/30 text-left">
          <h4 class="text-cream font-display font-bold mb-3 text-lg" style="margin-top: 0;">Metode Pembayaran</h4>
          <div class="flex flex-col gap-3 text-white/90 text-sm font-body">
            <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors m-0">
              <input type="radio" name="payment_method" value="qris" checked class="w-4 h-4 accent-kuba m-0">
              <span>📱 QRIS (Gopay, OVO, Dana)</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors m-0">
              <input type="radio" name="payment_method" value="debit" class="w-4 h-4 accent-kuba m-0">
              <span>💳 Transfer Bank / VA</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors m-0">
              <input type="radio" name="payment_method" value="cash" class="w-4 h-4 accent-kuba m-0">
              <span>💵 Bayar di Kasir</span>
            </label>
          </div>
        </div>

        <div class="cart-actions">
          <button class="btn-clear" onclick="clearCart()">Kosongkan</button>
          <button class="btn-continue" onclick="window.location.href='index.php'">Belanja Lagi</button>
          <button class="btn-checkout" onclick="kubaCheckout()">Bayar Sekarang →</button>
        </div>
      </div>
    </div>
  </div>

<script src="cart.js?v=999"></script>
  <script src="app.js?v=999"></script>
  
  <script>
    
  </script>
</body>
</html>