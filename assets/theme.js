/* MadDrop Shopify Theme - theme.js */
'use strict';

// ========================
// Cart AJAX
// ========================
function addToCart(variantId, quantity) {
  quantity = quantity || 1;
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    updateCartCount();
    showCartNotification(data.product_title);
  })
  .catch(function(err) { console.error('Add to cart error:', err); });
}

function updateCartCount() {
  fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
  .then(function(res) { return res.json(); })
  .then(function(cart) {
    var counts = document.querySelectorAll('.header-cart');
    counts.forEach(function(el) {
      el.textContent = 'CART (' + cart.item_count + ')';
    });
  });
}

function showCartNotification(title) {
  var notif = document.getElementById('cart-notification');
  if (notif) {
    notif.hidden = false;
    setTimeout(function() { notif.hidden = true; }, 3000);
  }
}

// Intercept add-to-cart form submissions for AJAX
document.addEventListener('submit', function(e) {
  var form = e.target;
  if (form.id === 'AddToCartForm') {
    e.preventDefault();
    var variantId = form.querySelector('[name="id"]').value;
    var qty = parseInt(form.querySelector('[name="quantity"]').value) || 1;
    addToCart(variantId, qty);
  }
  if (form.id === 'AddToCartForm' || form.classList.contains('product-card__form')) {
    e.preventDefault();
    var vid = form.querySelector('[name="id"]').value;
    var q = parseInt(form.querySelector('[name="quantity"]').value) || 1;
    addToCart(vid, q);
  }
});

// ========================
// Mobile Menu
// ========================
document.addEventListener('DOMContentLoaded', function() {
  // Sticky header hide on scroll down
  var header = document.getElementById('SiteHeader');
  if (header && header.classList.contains('site-header--sticky')) {
    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 80) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Close mobile menu on link click
  var mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      document.getElementById('MobileMenu').classList.remove('is-open');
    });
  });

  // Animate elements on scroll
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.product-card, .journal-card, .collab-benefits').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(el);
    });
    document.addEventListener('animationend', function() {}, false);
  }
});

// Add visible class styles via JS
var styleEl = document.createElement('style');
styleEl.textContent = '.is-visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleEl);
