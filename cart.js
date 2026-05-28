// ==========================================
// 1. SISTEM KERANJANG BELANJA (LOCAL STORAGE)
// ==========================================
let cart = JSON.parse(localStorage.getItem('kopikuba_cart')) || [];

function saveCart() {
  localStorage.setItem('kopikuba_cart', JSON.stringify(cart));
}

function cardQty(btn, change) {
  let span = btn.parentElement.querySelector('.card-qty-value');
  let val = parseInt(span.innerText) + change;
  if(val >= 1) span.innerText = val;
}

function addToCart(btn) {
  let name = btn.getAttribute('data-name');
  let price = parseInt(btn.getAttribute('data-price'));
  let qtyElement = btn.parentElement.querySelector('.card-qty-value');
  let qty = qtyElement ? parseInt(qtyElement.innerText) : 1;

  let existing = cart.find(i => i.name === name);
  if(existing) {
    existing.qty += qty;
  } else {
    cart.push({name, price, qty});
  }

  saveCart();
  updateCartDOM();
  showToast(qty + ' ' + name + ' masuk keranjang!');
  
  if(qtyElement) qtyElement.innerText = '1';
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartDOM();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartDOM();
}

function updateCartDOM() {
  let count = 0;
  let total = 0;
  let list = document.getElementById('cart-items');
  let summary = document.getElementById('cart-summary');
  let countBadges = document.querySelectorAll('.cart-badge');
  let headerCount = document.getElementById('cart-header-count');

  if(list) list.innerHTML = '';

  cart.forEach((item, index) => {
      count += item.qty;
      total += (item.price * item.qty);
      if(list) {
          let li = document.createElement('li');
          li.className = 'flex justify-between items-center py-3 border-b border-white/10 text-sm md:text-base';
          li.innerHTML = `
              <div>
                  <div class="font-bold text-kuba">${item.name}</div>
                  <div class="text-xs text-cream/70">Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</div>
              </div>
              <div class="flex items-center gap-3">
                  <div class="font-bold text-white">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
                  <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 font-bold px-2 cursor-pointer">X</button>
              </div>
          `;
          list.appendChild(li);
      }
  });

  countBadges.forEach(b => {
    b.innerText = count;
    b.style.display = count > 0 ? 'inline-block' : 'none';
  });
  
  if(headerCount) headerCount.innerText = count + ' item';
  
  let totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.innerText = total.toLocaleString('id-ID');

  if(summary) summary.style.display = count > 0 ? 'block' : 'none';
  if(list && count === 0) {
    list.innerHTML = '<li class="text-center py-8 text-cream/50 italic">Keranjang masih kosong. Ayo jajan!</li>';
  }
}

document.addEventListener('DOMContentLoaded', updateCartDOM);

// ==========================================
// 2. FUNGSI NOTIFIKASI TOAST
// ==========================================
function showToast(msg) {
  var c = document.getElementById('toast-container');
  if(!c) return;
  var t = document.createElement('div');
  t.className = 'toast flex items-center gap-3 bg-kuba text-white px-4 py-3 rounded-lg shadow-xl mb-3 translate-x-full transition-transform duration-300 fixed top-24 right-5 z-[9999]';
  t.innerHTML = '<span class="text-xl font-bold">!</span><span>' + msg + '</span>';
  c.appendChild(t);
  
  setTimeout(() => t.classList.remove('translate-x-full'), 10);
  setTimeout(function() { 
    t.classList.add('translate-x-full'); 
    t.addEventListener('transitionend', function() { t.remove(); }); 
  }, 2500);
}

// ==========================================
// 3. FUNGSI CUSTOM LOGOUT MODAL
// ==========================================
function showLogoutModal(e) {
  if(e) e.preventDefault(); 
  const modal = document.getElementById('logout-modal');
  const modalBox = modal ? modal.querySelector('div') : null;
  if(modal && modalBox) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => { 
      modal.classList.remove('opacity-0'); 
      modalBox.classList.remove('scale-95'); 
      modalBox.classList.add('scale-100'); 
    }, 10);
  }
}

function closeLogoutModal() {
  const modal = document.getElementById('logout-modal');
  const modalBox = modal ? modal.querySelector('div') : null;
  if(modal && modalBox) {
    modal.classList.add('opacity-0'); 
    modalBox.classList.remove('scale-100'); 
    modalBox.classList.add('scale-95');
    setTimeout(() => { 
      modal.classList.add('hidden'); 
      modal.classList.remove('flex'); 
    }, 300);
  }
}

// ==========================================
// 4. FUNGSI PROSES CHECKOUT & PEMBAYARAN
// ==========================================
function kubaCheckout() {
  const totalElement = document.getElementById('cart-total');
  if(!totalElement) return;

  const totalText = totalElement.innerText;
  if (totalText === '0' || totalText === '') {
    alert('Keranjang masih kosong, ayo jajan dulu!');
    return;
  }

  const rawTotal = totalText.replace(/\./g, ''); 
  
  const paymentMethodInput = document.querySelector('input[name="payment_method"]:checked');
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'qris';
  
  const contentBox = document.getElementById('checkout-dynamic-content');
  let htmlContent = '';

  if (paymentMethod === 'qris') {
    htmlContent = `
      <h3 class="text-2xl font-display text-kuba mb-2" style="margin-top:0;">Scan QRIS</h3>
      <p class="text-sm text-cream/80 mb-4">Total Bayar: <strong class="text-white text-lg">Rp ${totalText}</strong></p>
      <div class="bg-white p-3 rounded-lg inline-block mb-4 shadow-lg">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PembayaranKopiKubaRp${rawTotal}" alt="QRIS Kopi Kuba">
      </div>
      <p class="text-xs text-cream/70 font-body mb-4">Buka aplikasi e-Wallet atau M-Banking Anda, lalu scan QR di atas.</p>
      <button onclick="kubaSimulasiSukses()" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-bold transition-all w-full border-none cursor-pointer">Simulasi: Saya Sudah Scan</button>
    `;
  } else if (paymentMethod === 'debit') {
    htmlContent = `
      <h3 class="text-2xl font-display text-kuba mb-2" style="margin-top:0;">Transfer Bank</h3>
      <p class="text-sm text-cream/80 mb-4">Total Bayar: <strong class="text-white text-lg">Rp ${totalText}</strong></p>
      <div class="bg-black/40 p-4 rounded-lg mb-4 text-left border border-white/10">
        <p class="text-xs text-cream/70 mb-1">BCA Virtual Account</p>
        <p class="text-xl font-mono font-bold text-white tracking-widest mb-3 m-0">3901 0812 3456</p>
        <div class="h-px w-full bg-white/10 mb-3"></div>
        <p class="text-xs text-cream/70 mb-1">Mandiri Virtual Account</p>
        <p class="text-xl font-mono font-bold text-white tracking-widest m-0">8890 0812 3456</p>
      </div>
      <p class="text-xs text-cream/70 font-body mb-4">Pesanan diproses otomatis setelah transfer berhasil.</p>
      <button onclick="kubaSimulasiSukses()" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-bold transition-all w-full border-none cursor-pointer">Simulasi: Saya Sudah Transfer</button>
    `;
  } else {
    htmlContent = `
      <div class="text-6xl mb-4" style="margin-top:0;">OK</div>
      <h3 class="text-2xl font-display text-kuba mb-2">Pesanan Diterima!</h3>
      <p class="text-sm text-cream/80 mb-4">Total Bayar: <strong class="text-white text-lg">Rp ${totalText}</strong></p>
      <p class="text-sm text-cream/90 font-body mb-4">Silakan menuju kasir dan sebutkan nama Anda untuk melakukan pembayaran.</p>
      <button onclick="kubaSimulasiSukses()" class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-bold transition-all w-full border-none cursor-pointer">Simulasi: Bayar di Kasir</button>
    `;
  }

  if(contentBox) {
      contentBox.innerHTML = htmlContent;
  }

  // CATATAN: Ini memanggil ID baru (kuba-checkout-overlay)
  const overlay = document.getElementById('kuba-checkout-overlay');
  const box = document.getElementById('kuba-checkout-modal-box');
  
  if(overlay && box) {
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      setTimeout(() => {
        box.classList.remove('scale-95');
        box.classList.add('scale-100');
      }, 10);
  }
}

function kubaSimulasiSukses() {
  const contentBox = document.getElementById('checkout-dynamic-content');
  if(contentBox) {
      contentBox.innerHTML = `
        <div class="text-6xl mb-4 animate-bounce" style="margin-top:0;">🎉</div>
        <h3 class="text-3xl font-display text-green-400 mb-2">Lunas!</h3>
        <p class="text-sm text-cream/90 font-body mb-2">Pembayaran berhasil diverifikasi.</p>
        <p class="text-xs text-cream/70 font-body">Pesanan kamu sedang diracik oleh barista kami.</p>
      `;
  }
  clearCart(); 
}

function kubaCloseCheckout() {
  const overlay = document.getElementById('kuba-checkout-overlay');
  const box = document.getElementById('kuba-checkout-modal-box');
  
  if(overlay && box) {
      box.classList.remove('scale-100');
      box.classList.add('scale-95');
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        window.location.href = 'index.php';
      }, 300);
  }
}