<?php
session_start();
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kopi Kuba</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Pacifico&display=swap" rel="stylesheet">
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
<body>

  <div class="toast-container" id="toast-container"></div>

  <div class="nav-overlay" id="nav-overlay" onclick="closeMenu()"></div>

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
     <a href="logout.php" style="color: #d4a373; font-weight: 600;">
  👤 <?= htmlspecialchars($_SESSION['username']); ?> (Keluar)
</a>
      </div>
    </div>
  </div>

  <header>
    <div class="logo logo-brand" onclick="navTo('home')" aria-label="Beranda Kopi Kuba">
      <span class="logo-mark">☕</span>
      <div class="logo-text">
        <strong>Kopi Kuba</strong>
        <small>Rasa Nusantara</small>
      </div>
    </div>
    <button class="menu-toggle" onclick="toggleMenu()" aria-label="Menu">☰</button>
    <nav id="main-nav">
      <a onclick="navTo('home')" data-page="home" class="nav-active">Beranda</a>
      <a onclick="navToSection('beans')" data-page="beans">Coffee Beans</a>
      <a onclick="navToSection('roastery')" data-page="roastery">Roastery</a>
      <a onclick="navToSection('cafe')" data-page="cafe">Our Cafe</a>
      <a onclick="navToSection('founder')" data-page="founder">Founder</a>
      
      <?php if(isset($_SESSION['user_id'])): ?>
          <a href="#" style="color: #d4a373; font-weight: 600;" onclick="showLogoutModal(event)">
              👤 <?= htmlspecialchars($_SESSION['username']); ?> (Keluar)
          </a>
      <?php else: ?>
          <a href="login.php" data-page="login.php">Login</a>
      <?php endif; ?>

      <a href="keranjang.php" class="cart-link">🛒 Keranjang <span class="cart-badge" id="cart-count">0</span></a>
    </nav>
  </header>

  <div id="page-home" class="page active">

    <section class="hero flex items-center">
      <div class="hero-content mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div class="hero-copy">
          <span class="hero-status">Buka hari ini</span>
          <p class="hero-eyebrow">Kopi, roti, dan tetangga Bogor</p>
          <h1><span class="highlight-title">Kopi Kuba</span></h1>
          <p>
            Kedai kopi tetangga dengan rasa Nusantara yang dekat, hangat, dan konsisten.
            Dari es kopi susu gula aren sampai biji kopi pilihan, semuanya dibuat untuk
            menemani langkah harian tanpa terasa rumit.
          </p>
          <div class="hero-actions flex flex-wrap items-center gap-3">
            <button class="btn-hero" onclick="navToSection('beans')">
              Pesan Sekarang <span class="arrow">&darr;</span>
            </button>
            <button class="btn-hero-secondary" onclick="navToSection('cafe')">
              Temukan Kedai
            </button>
          </div>
          <div class="hero-proof-grid grid grid-cols-1 gap-3 sm:grid-cols-3">
            <span>Harga bersahabat</span>
            <span>Biji Nusantara</span>
            <span>Roasting harian</span>
          </div>
        </div>

        <div class="hero-stack grid gap-4">
          <article class="hero-feature-card hero-feature-main">
            <span class="feature-kicker">Menu hari ini</span>
            <h2>Es Kopi Susu Kuba</h2>
            <p>Espresso, susu segar, dan gula aren dengan opsi less sugar.</p>
            <ul>
              <li>Best seller harian</li>
              <li>Dine-in dan takeaway</li>
              <li>Bisa dipesan online</li>
            </ul>
          </article>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article class="hero-feature-card">
              <span class="feature-kicker">Kudapan</span>
              <h3>Dukungan UMKM</h3>
              <p>Roti dan camilan lokal untuk teman ngopi cepat.</p>
            </article>
            <article class="hero-feature-card">
              <span class="feature-kicker">Beans</span>
              <h3>Origin Indonesia</h3>
              <p>Aceh, Toraja, Bali, Flores, Papua, dan Mandailing.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="products" id="beans">
      <div class="product-shell mx-auto max-w-6xl px-5 md:px-8">
        <div class="section-intro mx-auto max-w-3xl text-center">
          <span class="section-kicker">Lini Produk</span>
          <h2 class="section-heading">Menu Tetangga Kopi Kuba</h2>
          <p class="section-subtitle">
            Kategori dibuat jelas, pilihan cepat, dan grid produk mudah discan dari mobile sampai desktop.
          </p>
        </div>
        <div class="product-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div class="card reveal">
          <div class="card-img-wrap">
            <img src="https://plus.unsplash.com/premium_photo-1666976503799-4ef00906ab2b?w=600&auto=format&fit=crop&q=60" alt="Aceh Gayo">
          </div>
          <div class="card-body">
            <h3>Aceh Gayo</h3>
            <span class="card-origin">Aceh Tengah, Sumatra</span>
            <span class="card-price">Rp 150.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Aceh Gayo" data-price="150000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <div class="card reveal reveal-d1">
          <div class="card-img-wrap">
            <img src="https://images.unsplash.com/photo-1660071139672-55a1607f72fe?w=600&auto=format&fit=crop&q=60" alt="Toraja">
          </div>
          <div class="card-body">
            <h3>Toraja</h3>
            <span class="card-origin">Sulawesi Selatan</span>
            <span class="card-price">Rp 140.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Toraja" data-price="140000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <div class="card reveal reveal-d2">
          <div class="card-img-wrap">
            <img src="https://images.unsplash.com/photo-1672570050756-4f1953bde478?w=600&auto=format&fit=crop&q=60" alt="Kintamani Bali">
          </div>
          <div class="card-body">
            <h3>Kintamani Bali</h3>
            <span class="card-origin">Kintamani, Bali</span>
            <span class="card-price">Rp 160.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Kintamani Bali" data-price="160000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <div class="card reveal">
          <div class="card-img-wrap">
            <img src="https://images.unsplash.com/photo-1561986845-fbeb7f7913d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Flores Bajawa">
          </div>
          <div class="card-body">
            <h3>Flores Bajawa</h3>
            <span class="card-origin">Ngada, Nusa Tenggara Timur</span>
            <span class="card-price">Rp 155.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Flores Bajawa" data-price="155000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <div class="card reveal reveal-d1">
          <div class="card-img-wrap">
            <img src="https://images.pexels.com/photos/36249837/pexels-photo-36249837.jpeg" alt="Papua Wamena">
          </div>
          <div class="card-body">
            <h3>Papua Wamena</h3>
            <span class="card-origin">Lembah Baliem, Papua</span>
            <span class="card-price">Rp 175.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Papua Wamena" data-price="175000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>

        <div class="card reveal reveal-d2">
          <div class="card-img-wrap">
            <img src="https://media.istockphoto.com/id/1337868547/id/foto/biji-kopi-merah-organik-100-di-tangan-dan-keranjang-petani-di-pertanian-nasional-chiang-mai.webp?a=1&b=1&s=612x612&w=0&k=20&c=jLuwT2qgJDlcClSiL5AP825NlJ9EI8knPQWc4xLcng8=" alt="Mandailing Natal">
          </div>
          <div class="card-body">
            <h3>Mandailing Natal</h3>
            <span class="card-origin">Tapanuli Selatan, Sumatra</span>
            <span class="card-price">Rp 145.000 <small>/ 250gr</small></span>
            <div class="card-cart-row">
              <div class="card-qty-control">
                <button class="card-qty-btn" onclick="cardQty(this,-1)">−</button>
                <span class="card-qty-value">1</span>
                <button class="card-qty-btn" onclick="cardQty(this,1)">+</button>
              </div>
              <button class="btn-add-cart" data-name="Mandailing Natal" data-price="145000" onclick="addToCart(this)">+ Keranjang</button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>

    <section class="roastery" id="roastery">
      <h2 class="section-heading">Our Coffee Roastery</h2>
      <div class="bio-grid">
        <div class="bio-card reveal">
          <div class="bio-card-img">
            <img src="https://images.unsplash.com/photo-1591017940761-68725ef7d016?w=600&auto=format&fit=crop&q=60" alt="Aceh Gayo">
          </div>
          <div class="bio-card-body">
            <h3>Aceh Gayo</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Aceh Tengah, Sumatra</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Bold, earthy, sedikit herbal</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 1.200–1.600 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Body kuat dengan aroma rempah</div>
          </div>
        </div>

        <div class="bio-card reveal reveal-d1">
          <div class="bio-card-img">
            <img src="https://images.unsplash.com/photo-1582426007790-f5a2e2392dd3?w=600&auto=format&fit=crop&q=60" alt="Toraja">
          </div>
          <div class="bio-card-body">
            <h3>Toraja</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Sulawesi Selatan</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Kompleks, fruity, sedikit spicy</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 1.100–1.800 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Keasaman seimbang, aftertaste manis</div>
          </div>
        </div>

        <div class="bio-card reveal reveal-d2">
          <div class="bio-card-img">
            <img src="https://plus.unsplash.com/premium_photo-1677829177642-30def98b0963?w=600&auto=format&fit=crop&q=60" alt="Kintamani Bali">
          </div>
          <div class="bio-card-body">
            <h3>Kintamani Bali</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Kintamani, Bali</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Bright, citrusy, floral</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 1.200–1.500 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Rasa jeruk segar khas vulkanik Bali</div>
          </div>
        </div>

        <div class="bio-card reveal">
          <div class="bio-card-img">
            <img src="https://images.unsplash.com/photo-1578019448201-09ad2ac7995a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmxvcmVzJTIwaW5kb25lc2lhfGVufDB8fDB8fHww" alt="Flores Bajawa">
          </div>
          <div class="bio-card-body">
            <h3>Flores Bajawa</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Ngada, Nusa Tenggara Timur</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Coklat gelap, nutty, sedikit smoky</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 1.000–1.800 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Full body dengan finish panjang dan hangat</div>
          </div>
        </div>

        <div class="bio-card reveal reveal-d1">
          <div class="bio-card-img">
            <img src="https://plus.unsplash.com/premium_photo-1697730044079-0ff3fda28bb7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHBhcHVhfGVufDB8fDB8fHww" alt="Papua Wamena">
          </div>
          <div class="bio-card-body">
            <h3>Papua Wamena</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Lembah Baliem, Papua</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Clean, sweet, sedikit caramel</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 1.500–2.000 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Organik murni tanpa pestisida, sangat langka</div>
          </div>
        </div>

        <div class="bio-card reveal reveal-d2">
          <div class="bio-card-img">
            <img src="https://images.unsplash.com/photo-1720034236861-74cc8dc5a8c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHN1bWF0cmF8ZW58MHx8MHx8fDA%3D" alt="Mandailing Natal">
          </div>
          <div class="bio-card-body">
            <h3>Mandailing Natal</h3>
            <div class="bio-detail"><span class="bio-detail-label">Asal</span> Tapanuli Selatan, Sumatra</div>
            <div class="bio-detail"><span class="bio-detail-label">Rasa</span> Earthy, dark chocolate, cedar</div>
            <div class="bio-detail"><span class="bio-detail-label">Altitude</span> 900–1.500 mdpl</div>
            <div class="bio-detail"><span class="bio-detail-label">Catatan</span> Wet-hulled process, low acidity khas Sumatra</div>
          </div>
        </div>
      </div>
    </section>

    <section class="cafe" id="cafe">
      <h2 class="section-heading">Our Cafe</h2>
      <div class="cafe-content">
        <div class="cafe-img-wrap reveal">
          <img src="https://images.pexels.com/photos/18617711/pexels-photo-18617711.jpeg?auto=compress&w=600" alt="Interior Cafe">
        </div>
        <div class="cafe-text reveal reveal-d1">
          <p>
            Kopi Kuba bukan sekadar ruang, melainkan panggung di mana aroma kopi menyatukan jiwa-jiwa.
            Di balik dinding kayu yang hangat and bisikan harum biji kopi segar, tercipta tempat pertemuan
            rasa, cerita, dan inspirasi.
          </p>
          <div class="cafe-location">
            <span>📍</span> Jl. Pajajaran, Bogor — Buka setiap hari, 08.00–22.00
          </div>
        </div>
      </div>
    </section>

    <section class="neighbor-stack px-5 py-16 md:px-8 lg:py-20">
      <div class="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <article class="neighbor-visual reveal">
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=70" alt="Barista menyeduh kopi">
          <div class="neighbor-visual-copy">
            <span>Pesan di sini</span>
            <h2>Ambil cepat, duduk santai, atau bawa pulang.</h2>
          </div>
        </article>
        <div class="neighbor-cards grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article class="neighbor-card reveal reveal-d1">
            <span>01</span>
            <h3>Menu Ringkas</h3>
            <p>Pilihan utama tampil dulu agar pelanggan tidak lama mencari.</p>
          </article>
          <article class="neighbor-card reveal reveal-d2">
            <span>02</span>
            <h3>Order Online</h3>
            <p>CTA disiapkan untuk alur GoFood, GrabFood, ShopeeFood, dan chat.</p>
          </article>
          <article class="neighbor-card reveal">
            <span>03</span>
            <h3>Tukudapan Style</h3>
            <p>Kudapan dan produk pendamping dibuat sebagai stack kecil.</p>
          </article>
          <article class="neighbor-card reveal reveal-d1">
            <span>04</span>
            <h3>Roastery</h3>
            <p>Cerita origin tetap ada untuk memperkuat karakter Kopi Kuba.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="founder" id="founder">
      <h2 class="section-heading">Meet Our Founders</h2>
      <div class="founder-content">
        <div class="founder-intro reveal">
          <p>
            Kopi Kuba lahir dari passion satu Tim yang percaya bahwa kopi bukan sekadar minuman,
            melainkan jembatan penghubung antara petani, pecinta kopi, dan budaya Indonesia.
          </p>
        </div>

        <div class="founder-grid">
          <div class="founder-card reveal">
            <div class="founder-img-wrap">
              <img src="https://thumbs.dreamstime.com/b/two-guys-girl-stylish-casual-bright-dark-colorful-clothes-posing-together-studio-grey-background-137462538.jpg?w=768" alt="Albar-Joshua-farsya">
              <div class="founder-overlay">
                <h3>Albar-Joshua-farsya</h3>
                <span class="founder-role">Co-Founder & Master Roaster</span>
              </div>
            </div>
            <div class="founder-info">
              <p class="founder-bio">
                Mahasiswa yang jatuh cinta dengan dunia kopi sejak berkeliling Margonda dan Jakarta Raya.
                Mereka bertanggung jawab atas proses roasting dan pengembangan rasa kopi Kuba.
              </p>
              <div class="founder-quote">
                "Setiap biji kopi punya cerita. Tugas kami adalah menceritakannya dengan baik."
              </div>
              <div class="founder-social">
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">🐦</a>
              </div>
            </div>
          </div>

          <div class="founder-card reveal reveal-d1">
            <div class="founder-img-wrap">
              <img src="https://i.pinimg.com/736x/87/47/82/874782152b9b1c78b439ef46b51f772e.jpg" alt="Raditya-fadia">
              <div class="founder-overlay">
                <h3>Raditya-fadia</h3>
                <span class="founder-role">Co-Founder & Brand Director</span>
              </div>
            </div>
            <div class="founder-info">
              <p class="founder-bio">
                Ahli pemasaran yang percaya bahwa brand kopi harus menceritakan kisah autentik.
                Raditya mengelola hubungan dengan petani dan membangun komunitas pecinta kopi.
              </p>
              <div class="founder-quote">
                "Kopi Kuba bukan tentang penjualan, tapi tentang membangun koneksi yang bermakna."
              </div>
              <div class="founder-social">
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">🐦</a>
              </div>
            </div>
          </div>
        </div>

        <div class="founder-story reveal reveal-d2">
          <h3>Our Story</h3>
          <div class="story-content">
            <div class="story-text">
              <p>
                Kisah Kopi Kuba dimulai pada tahun 2026 ketika mereka bertemu di sebuah workshop kopi di Kemang.
                mereka ber-5 terinspirasi oleh kekayaan kopi Indonesia yang belum tergali secara maksimal.
              </p>
              <p>
                Setelah berkeliling dari Aceh hingga Papua, mereka memutuskan untuk membangun brand yang tidak hanya
                menjual kopi, tapi juga menceritakan perjalanan panjang biji kopi dari kebun hingga ke cangkir Anda.
              </p>
              <p>
                Hari ini, Kopi Kuba telah bekerja sama dengan lebih dari 50 petani di 6 provinsi,
                menghadirkan cita rasa Nusantara yang autentik dan berkualitas tinggi.
              </p>
            </div>
            <div class="story-stats">
              <div class="stat-item">
                <span class="stat-number">35+</span>
                <span class="stat-label">Petani Partner</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">6</span>
                <span class="stat-label">Provinsi</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">2026</span>
                <span class="stat-label">Tahun Berdiri</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">28K+</span>
                <span class="stat-label">Pelanggan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="footer-content">
        <div class="footer-brand">
          <div class="logo">☕ Kopi Kuba</div>
          <p>Cita rasa kopi terbaik Nusantara, langsung dari petani ke cangkir Anda.</p>
        </div>
        <div class="footer-links">
          <h4>Menu</h4>
          <a onclick="navToSection('beans')">Coffee Beans</a>
          <a onclick="navToSection('roastery')">Roastery</a>
          <a onclick="navToSection('cafe')">Our Cafe</a>
          <a onclick="navToSection('founder')">Founder</a>
        </div>
        <div class="footer-links">
          <h4>Kontak</h4>
          <a>info@kopikuba.com</a>
          <a>@kopikuba</a>
          <a>+62 812-3456-7890</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Kopi Kuba · Bogor, Indonesia</p>
      </div>
    </footer>
  </div>

  <div id="page-cart" class="page">
    <div class="cart-page">
      <div id="cart">
        <div class="cart-header">
          <h2>Keranjang</h2>
          <span class="cart-header-count" id="cart-header-count">0 item</span>
        </div>
        <ul id="cart-items"></ul>
        <div id="cart-summary" class="cart-summary" style="display:none;">
          <div class="cart-total-row">
            <span class="cart-total-label">Total</span>
            <span class="cart-total-value">Rp <span id="cart-total">0</span></span>
          </div>

          <div class="mt-4 mb-5 p-4 bg-[#3a2828] rounded-lg border border-kuba/30 text-left">
            <h4 class="text-cream font-display font-bold mb-3 text-lg">Metode Pembayaran</h4>
            <div class="flex flex-col gap-3 text-white/90 text-sm font-body">
              <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors">
                <input type="radio" name="payment_method" value="qris" checked class="w-4 h-4 accent-kuba">
                <span>📱 QRIS (Gopay, OVO, Dana, LinkAja)</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors">
                <input type="radio" name="payment_method" value="debit" class="w-4 h-4 accent-kuba">
                <span>💳 Transfer Bank / Virtual Account</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer hover:text-kuba transition-colors">
                <input type="radio" name="payment_method" value="cash" class="w-4 h-4 accent-kuba">
                <span>💵 Bayar di Kasir (Cash/EDC)</span>
              </label>
            </div>
          </div>

          <div class="cart-actions">
            <button class="btn-clear" onclick="clearCart()">Kosongkan</button>
            <button class="btn-continue" onclick="navTo('home')">Belanja Lagi</button>
            <button class="btn-checkout" onclick="kubaCheckout()">Bayar Sekarang →</button>
          </div>
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