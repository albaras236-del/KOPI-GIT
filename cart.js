// ===== Card Qty Control (on product cards) =====
function cardQty(btn, delta) {
  var row = btn.closest('.card-cart-row');
  var v = row.querySelector('.card-qty-value');
  var val = parseInt(v.textContent) + delta;
  if (val < 1) val = 1;
  if (val > 99) val = 99;
  v.textContent = val;
}

// ===== Cart State =====
var cart = [];

// ===== Add to Cart =====
function addToCart(btn) {
  var row = btn.closest('.card-cart-row');
  var qtyVal = parseInt(row.querySelector('.card-qty-value').textContent);
  var name = btn.getAttribute('data-name');
  var price = parseInt(btn.getAttribute('data-price'));

  var existing = cart.find(function(i) { return i.name === name; });
  if (existing) {
    existing.qty += qtyVal;
  } else {
    cart.push({ name: name, price: price, qty: qtyVal });
  }

  // Reset card qty to 1
  row.querySelector('.card-qty-value').textContent = '1';

  // Button feedback
  btn.innerHTML = '✓ Ditambahkan';
  btn.classList.add('added');
  setTimeout(function() {
    btn.innerHTML = '+ Keranjang';
    btn.classList.remove('added');
  }, 1200);

  showToast(qtyVal + '× ' + name + ' ditambahkan ke keranjang', '🛒');
  updateCart();
}

// ===== Change Qty in Cart =====
function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateCart();
}

// ===== Remove Item =====
function removeItem(i) {
  var n = cart[i].name;
  cart.splice(i, 1);
  showToast(n + ' dihapus dari keranjang', '🗑️');
  updateCart();
}

// ===== Clear Cart =====
function clearCart() {
  cart = [];
  showToast('Keranjang dikosongkan', '🗑️');
  updateCart();
}

// ===== Update Cart UI =====
function updateCart() {
  var list = document.getElementById('cart-items');
  var totalEl = document.getElementById('cart-total');
  var badge = document.getElementById('cart-count');
  var hc = document.getElementById('cart-header-count');
  var summary = document.getElementById('cart-summary');
  var tq = cart.reduce(function(s, i) { return s + i.qty; }, 0);

  if (cart.length === 0) {
    list.innerHTML =
      '<div class="cart-empty-state">' +
        '<div class="cart-empty-icon">🛒</div>' +
        '<div class="cart-empty-text">Keranjang masih kosong</div>' +
        '<div class="cart-empty-sub">Yuk pilih kopi favoritmu!</div>' +
        '<button class="cart-empty-btn" onclick="navTo(\'home\')">Mulai Belanja →</button>' +
      '</div>';
    totalEl.textContent = '0';
    summary.style.display = 'none';
    hc.textContent = '0 item';
  } else {
    list.innerHTML = cart.map(function(item, i) {
      return '<li>' +
        '<div class="cart-item-info">' +
          '<span class="cart-item-name">' + item.name + '</span>' +
          '<span class="cart-item-unit">Rp ' + item.price.toLocaleString('id-ID') + ' × ' + item.qty + '</span>' +
        '</div>' +
        '<span class="cart-item-subtotal">Rp ' + (item.price * item.qty).toLocaleString('id-ID') + '</span>' +
        '<div class="cart-item-actions">' +
          '<div class="qty-control">' +
            '<button class="qty-btn" onclick="changeQty(' + i + ',-1)">−</button>' +
            '<span class="qty-value">' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="changeQty(' + i + ',1)">+</button>' +
          '</div>' +
          '<button class="btn-remove" onclick="removeItem(' + i + ')" title="Hapus">✕</button>' +
        '</div>' +
      '</li>';
    }).join('');

    var grandTotal = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
    totalEl.textContent = grandTotal.toLocaleString('id-ID');
    summary.style.display = 'block';
    hc.textContent = tq + ' item';
  }

  badge.textContent = tq;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

// Initialize cart on load
document.addEventListener('DOMContentLoaded', function() {
  updateCart();
});
