// ===== API Base URL =====
const API_BASE_URL = window.location.protocol.startsWith('http') ? window.location.origin : 'http://localhost:3000';

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

  // Try backend API first
  fetch(API_BASE_URL + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: pw
    })
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.success) {
      handleLoginSuccess(data.user, remember);
    } else {
      msg.className = 'login-msg error';
      msg.textContent = '❌ ' + data.message;
    }
  })
  .catch(function(error) {
    // API not available, try localStorage
    console.warn('Backend tidak tersedia, menggunakan localStorage');
    
    var users = JSON.parse(localStorage.getItem('kopikuba_users') || '[]');
    var found = users.find(function(u) {
      return u.email === email && u.password === pw;
    });

    if (!found) {
      msg.className = 'login-msg error';
      msg.textContent = '❌ Email atau password salah.';
      return;
    }

    // Convert localStorage user to API format
    var apiUser = {
      id: found.id,
      firstName: found.firstName,
      lastName: found.lastName,
      email: found.email,
      phone: found.phone,
      avatar: found.avatar
    };

    handleLoginSuccess(apiUser, remember);
  });

  function handleLoginSuccess(user, remember) {
    // Simpan sesi login
    var sessionData = {
      id: user.id,
      fullName: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone
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
      showToast('Selamat datang, ' + user.firstName + '! ☕', user.avatar);
      updateNavUser();
      navTo('home');
    }, 1200);
  }
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
