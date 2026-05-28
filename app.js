// ===== Navigation & Scroll =====
function navTo(page) {
  closeMenu();
  if (page === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Kalau dipanggil pindah halaman, arahkan pakai PHP
    window.location.href = page + '.php'; 
  }
}

function navToSection(id) {
  closeMenu();
  // Jika sedang tidak di index.php (misal di keranjang.php), lempar kembali ke index
  if (!document.getElementById('page-home')) {
    window.location.href = 'index.php#' + id;
    return;
  }
  
  // Script smooth scroll ke bagian section Kopi Kuba
  var el = document.getElementById(id);
  if (el) {
    var header = document.querySelector('header');
    var hh = header ? header.offsetHeight : 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - hh - 8, behavior: 'smooth' });
  }
}

// ===== Mobile Menu =====
function toggleMenu() {
  var nav = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');
  if (nav) nav.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function closeMenu() {
  var nav = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

// ===== Scroll Reveal Animasi =====
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});