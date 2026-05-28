<?php
session_start();
// Jika sudah login, tendang ke index
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daftar - Kopi Kuba</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Pacifico&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
      corePlugins: { preflight: false },
      theme: {
        extend: {
          colors: { kopi: '#2b1d1d', kuba: '#d4a373', cream: '#f5e6c4' },
          fontFamily: { display: ['Playfair Display', 'serif'], body: ['Poppins', 'sans-serif'] }
        }
      }
    };
  </script>
</head>
<body>
  <main class="login-page px-5">
    <section class="login-wrap grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div class="brand login-brand-stack flex flex-col items-start gap-5">
        <div class="logo-mark">☕</div>
        <div class="brand-text">
          <strong>Kopi Kuba</strong>
          <small>Rasa Nusantara</small>
        </div>
        <div class="login-side-stack grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div class="login-side-card">
            <span>Bergabung Bersama Kami</span>
            <p>Jadilah bagian dari tetangga Kopi Kuba dan nikmati berbagai kemudahannya.</p>
          </div>
          <div class="login-side-card">
            <span>Member Kopi Kuba</span>
            <p>Simpan pesanan favorit dan lanjutkan checkout lebih ringkas.</p>
          </div>
        </div>
      </div>

      <div class="login-card w-full">
        <h2>Daftar Akun Baru</h2>
        <p class="muted">Isi data di bawah untuk bergabung dengan Kopi Kuba</p>

        <?php if(isset($_SESSION['error'])): ?>
            <div style="color: red; margin-bottom: 15px; font-size: 14px; background: #fee2e2; padding: 10px; border-radius: 5px;">
                <?= $_SESSION['error']; ?>
            </div>
            <?php unset($_SESSION['error']); ?>
        <?php endif; ?>

        <form action="register_process.php" method="POST" class="login-form">
          <div class="input-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Nama panggilanmu" required>
          </div>

          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="nama@email.com" required>
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Minimal 6 karakter" required minlength="6">
          </div>

          <button type="submit" class="btn-login" style="width: 100%; padding: 10px; background: #d4a373; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-top: 15px;">Daftar Sekarang</button>
        </form>

        <div class="login-footer" style="margin-top: 20px; text-align: center;">
            Sudah punya akun? <a href="login.php" style="color: #d4a373;">Masuk di sini</a>
        </div>
      </div>
    </section>
  </main>
</body>
</html>