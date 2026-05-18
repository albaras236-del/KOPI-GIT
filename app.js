// ===== Navigation =====
function navTo(page) {
  closeMenu();
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  target.classList.add('active');
  requestAnimationFrame(function() { target.style.opacity = '1'; });
  document.querySelectorAll('nav a').forEach(function(a) { a.classList.remove('nav-active'); });
  var navLink = document.querySelector('nav a[data-page="' + page + '"]');
  if (navLink) navLink.classList.add('nav-active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(page) { navTo(page); }

function navToSection(id) {
  closeMenu();
  var home = document.getElementById('page-home');
  if (!home.classList.contains('active')) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    home.classList.add('active');
    home.style.opacity = '1';
  }
  document.querySelectorAll('nav a').forEach(function(a) { a.classList.remove('nav-active'); });
  var nl = document.querySelector('nav a[data-page="' + id + '"]');
  if (nl) nl.classList.add('nav-active');
  setTimeout(function() {
    var el = document.getElementById(id);
    if (el) {
      var hh = document.querySelector('header').offsetHeight;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hh - 8, behavior: 'smooth' });
    }
  }, 50);
}

// ===== Mobile Menu =====
function toggleMenu() {
  document.getElementById('main-nav').classList.toggle('open');
  document.getElementById('nav-overlay').classList.toggle('active');
}

function closeMenu() {
  document.getElementById('main-nav').classList.remove('open');
  document.getElementById('nav-overlay').classList.remove('active');
}

// ===== Toast =====
function showToast(msg, icon) {
  icon = icon || '☕';
  var c = document.getElementById('toast-container');
  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<span class="toast-icon">' + icon + '</span>' + msg;
  c.appendChild(t);
  setTimeout(function() {
    t.classList.add('toast-out');
    t.addEventListener('animationend', function() { t.remove(); });
  }, 2500);
}

// ===== Login =====
function handleLogin() {
  var email    = document.getElementById('email').value.trim();
  var pw       = document.getElementById('password').value;
  var remember = document.getElementById('remember').checked;
  var msg      = document.getElementById('login-msg');

  // Reset pesan
  msg.className = 'login-msg';
  msg.textContent = '';

  if (!email || !pw) {
    msg.className = 'login-msg error';
    msg.textContent = '❌ Email dan password harus diisi.';
    return;
  }
  if (pw.length < 6) {
    msg.className = 'login-msg error';
    msg.textContent = '❌ Password minimal 6 karakter.';
    return;
  }

  // Cek ke data registrasi di localStorage
  var users = JSON.parse(localStorage.getItem('kopikuba_users') || '[]');
  var found = users.find(function(u) {
    return u.email === email && u.password === pw;
  });

  if (!found) {
    msg.className = 'login-msg error';
    msg.textContent = '❌ Email atau password salah.';
    return;
  }

  // Simpan sesi login
  var sessionData = {
    id:        found.id,
    fullName:  found.fullName,
    firstName: found.firstName,
    avatar:    found.avatar,
    email:     found.email
  };

  if (remember) {
    localStorage.setItem('kopikuba_session', JSON.stringify(sessionData));
  } else {
    sessionStorage.setItem('kopikuba_session', JSON.stringify(sessionData));
  }

  // Tampilkan pesan sukses
  msg.className = 'login-msg success';
  msg.textContent = '✅ Login berhasil! Mengalihkan...';

  setTimeout(function() {
    msg.style.display = 'none';
    msg.className = 'login-msg';
    showToast('Selamat datang, ' + found.firstName + '! ☕', found.avatar);
    updateNavUser(); // ubah tombol Login → nama user
    navTo('home');
  }, 1200);
}

// Enter key for login
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('page-login').classList.contains('active')) {
    handleLogin();
  }
});

// ===== Checkout =====
function checkout() {
  document.getElementById('checkout-overlay').classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkout-overlay').classList.remove('active');
  cart = [];
  updateCart();
  navTo('home');
}

// ===== Scroll Reveal =====
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});
