/**
 * ARUNIKA LIVING - INTERACTIVE LOGIC
 */

// Product Database
const PRODUCTS = [
  {
    id: 1,
    title: "Kursi Santai Velvet Sage",
    category: "Ruang Tamu & Bersantai",
    price: 3850000,
    priceFormatted: "Rp 3.850.000",
    image: "assets/images/chair-soft-green.jpg",
    rating: "4.9 (52 Ulasan)",
    material: "Rangka Kayu Jati Solid & Busa Royal Foam Berlapis Velvet Premium",
    dimensions: "84 x 78 x 82 cm",
    description: "Kursi santai dengan kontur ergonomis yang memberikan kenyamanan maksimal setelah hari yang panjang. Dibalut kain beludru sage yang lembut dan sejuk di kulit."
  },
  {
    id: 2,
    title: "Kursi Aksen Kurva Shell",
    category: "Ruang Duduk Kontemporer",
    price: 4250000,
    priceFormatted: "Rp 4.250.000",
    image: "assets/images/chair-curve.jpg",
    rating: "5.0 (39 Ulasan)",
    material: "Plywood Bengkok Walnut Eksotis & Kulit Sintetis Breathable",
    dimensions: "92 x 83 x 74 cm",
    description: "Ikon desain mid-century modern yang menghadirkan siluet kurva sculptural yang dramatis namun tetap bersahaja. Menjadi daya tarik utama dalam setiap ruang keluarga."
  },
  {
    id: 3,
    title: "Kursi Makan Nordik Minimalis",
    category: "Ruang Makan & Cafe",
    price: 1650000,
    priceFormatted: "Rp 1.650.000",
    image: "assets/images/chair-molded-dining.jpg",
    rating: "4.8 (64 Ulasan)",
    material: "Polypropylene Daur Ulang Kokoh & Kaki Kayu Beech Solid",
    dimensions: "54 x 46 x 81 cm",
    description: "Desain minimalis Nordik yang tangguh, mudah dibersihkan, dan nyaman untuk momen bersantap bersama keluarga tercinta."
  },
  {
    id: 4,
    title: "Nakas Kayu Skandinavia Duco",
    category: "Kamar Tidur & Samping Tempat Tidur",
    price: 2450000,
    priceFormatted: "Rp 2.450.000",
    image: "assets/images/table-bedside.jpg",
    rating: "4.9 (41 Ulasan)",
    material: "Kayu Mahoni & Finishing Matte Duco Ramah Lingkungan",
    dimensions: "50 x 40 x 55 cm",
    description: "Nakas samping tempat tidur dengan laci lapang bersistem soft-close. Tampilan putih bersih berpadu kaki kayu natural yang hangat."
  },
  {
    id: 5,
    title: "Kursi Bistro Industrial Metal",
    category: "Kafe, Dapur & Teras",
    price: 1350000,
    priceFormatted: "Rp 1.350.000",
    image: "assets/images/chair-metal-bistro.jpg",
    rating: "4.7 (83 Ulasan)",
    material: "Baja Tempa Anti Karat & Powder Coating Terracotta Tahan Cuaca",
    dimensions: "45 x 45 x 85 cm",
    description: "Kombinasi ketangguhan industrial klasik Perancis dengan sentuhan warna terracotta kontemporer yang tahan lama untuk indoor maupun outdoor."
  }
];

// App State
let cart = JSON.parse(localStorage.getItem('arunika_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('arunika_wishlist')) || [];
let currentModalProductId = null;
let currentModalQty = 1;

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initWishlistUI();
  updateCartUI();
  initModals();
  initSearch();
});

// Format Currency
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}

// Sticky Header & Mobile Nav
function initHeader() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  function openMobileMenu() {
    if (navMenu) navMenu.classList.add('active');
    if (mobileBackdrop) mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
}

// Wishlist Functionality
function initWishlistUI() {
  const counter = document.getElementById('wishlist-counter');
  if (counter) counter.textContent = wishlist.length;

  // Update heart buttons
  document.querySelectorAll('.wishlist-heart-btn').forEach((btn, index) => {
    const parentCard = btn.closest('[data-product-id]');
    if (parentCard) {
      const pid = parseInt(parentCard.getAttribute('data-product-id'));
      if (wishlist.includes(pid)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Dihapus dari daftar disukai: ${product ? product.title : ''}`);
  } else {
    wishlist.push(productId);
    showToast(`Disimpan ke daftar disukai: ${product ? product.title : ''}`);
  }

  localStorage.setItem('arunika_wishlist', JSON.stringify(wishlist));
  initWishlistUI();
}

// Cart Management
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += quantity;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: quantity
    });
  }

  saveCart();
  updateCartUI();
  showToast(`Ditambahkan ke keranjang: ${product.title}`);
  openCartDrawer();
}

function updateCartQty(productId, delta) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    updateCartUI();
  }
}

function removeCartItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('arunika_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const cartCounter = document.getElementById('cart-counter');
  const drawerCounter = document.getElementById('cart-drawer-count');
  const subtotalElem = document.getElementById('cart-subtotal-price');
  const itemsContainer = document.getElementById('cart-items-container');

  if (cartCounter) cartCounter.textContent = totalCount;
  if (drawerCounter) drawerCounter.textContent = totalCount;
  if (subtotalElem) subtotalElem.textContent = formatRupiah(totalPrice);

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart-message">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-7z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <p style="margin-top: 12px;">Keranjang belanja Anda kosong</p>
        <button class="btn btn-pill-primary" style="margin-top: 16px; font-size: 0.85rem;" onclick="closeCartDrawer()">Mulai Berbelanja</button>
      </div>
    `;
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${formatRupiah(item.price)}</div>
          <div class="cart-item-actions">
            <div class="cart-qty-ctrl">
              <button onclick="updateCartQty(${item.id}, -1)">-</button>
              <span>${item.qty}</span>
              <button onclick="updateCartQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${item.id})">Hapus</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Cart Drawer Open/Close
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-drawer-overlay');
const btnCart = document.getElementById('btn-cart');
const btnCloseCart = document.getElementById('btn-close-cart');

function openCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }
}

function closeCartDrawer() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }
}

if (btnCart) btnCart.addEventListener('click', openCartDrawer);
if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);
if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

// Product Detail Modal
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  currentModalQty = 1;

  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-img').alt = product.title;
  document.getElementById('modal-product-cat').textContent = product.category;
  document.getElementById('modal-product-title').textContent = product.title;
  document.getElementById('modal-product-price').textContent = product.priceFormatted;
  document.getElementById('modal-product-desc').textContent = product.description;
  document.getElementById('modal-product-material').textContent = product.material;
  document.getElementById('modal-product-dims').textContent = product.dimensions;
  document.getElementById('modal-qty').textContent = currentModalQty;

  const modalBackdrop = document.getElementById('product-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.add('active');
}

function closeProductModal() {
  const modalBackdrop = document.getElementById('product-modal-backdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('active');
}

function incrementQty() {
  currentModalQty++;
  document.getElementById('modal-qty').textContent = currentModalQty;
}

function decrementQty() {
  if (currentModalQty > 1) {
    currentModalQty--;
    document.getElementById('modal-qty').textContent = currentModalQty;
  }
}

function initModals() {
  const modalBackdrop = document.getElementById('product-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProductModal();
    });
  }

  const modalAddCartBtn = document.getElementById('modal-add-cart-btn');
  if (modalAddCartBtn) {
    modalAddCartBtn.addEventListener('click', () => {
      if (currentModalProductId) {
        addToCart(currentModalProductId, currentModalQty);
        closeProductModal();
      }
    });
  }
}

// Search Drawer
function initSearch() {
  const searchBtn = document.getElementById('btn-search');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      setTimeout(() => searchInput.focus(), 100);
    });
  }

  if (closeSearchBtn && searchOverlay) {
    closeSearchBtn.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('active');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        const query = searchInput.value.trim();
        searchOverlay.classList.remove('active');
        showToast(`Mencari "${query}"... Menampilkan hasil.`);
        scrollToSection('koleksi-grid');
      }
    });
  }
}

function quickSearch(keyword) {
  const searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) searchOverlay.classList.remove('active');
  showToast(`Menampilkan koleksi: "${keyword}"`);
  scrollToSection('koleksi-grid');
}

// Toast System
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);
}

// Smooth Scroll helper
function scrollToSection(id) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

// Newsletter
function handleNewsletter(event) {
  event.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (input && input.value) {
    showToast(`Terima kasih! Email ${input.value} telah terdaftar untuk voucher eksklusif.`);
    input.value = '';
  }
}

// Checkout order mock
function checkoutOrder() {
  if (cart.length === 0) {
    showToast("Keranjang Anda masih kosong!");
    return;
  }
  showToast("Mengarahkan ke halaman checkout yang aman...");
  setTimeout(() => {
    alert("Terima kasih atas pesanan Anda di Arunika Living! Tim kurasi kami akan segera menghubungi Anda.");
    cart = [];
    saveCart();
    updateCartUI();
    closeCartDrawer();
  }, 1000);
}

// Wishlist Header Button Action
const btnWishlist = document.getElementById('btn-wishlist');
if (btnWishlist) {
  btnWishlist.addEventListener('click', () => {
    if (wishlist.length === 0) {
      showToast("Daftar disukai Anda masih kosong. Tekan ikon hati pada produk untuk menyimpan!");
    } else {
      showToast(`Anda memiliki ${wishlist.length} produk di daftar disukai.`);
      scrollToSection('koleksi-grid');
    }
  });
}
