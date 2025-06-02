// script.js
"use strict";

const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
const close = document.getElementById("close");
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// Show cart message
function showCartMessage(text, isError = false) {
  const msg = document.getElementById("cart-message");
  if (!msg) return;
  msg.textContent = text;
  msg.classList.add("show");
  msg.style.backgroundColor = isError ? "#e74c3c" : "#2ecc71";
  msg.style.color = "#fff";
  setTimeout(() => {
    msg.classList.remove("show");
  }, 2500);
}



let isCouponApplied = false;

function subtotal(cart) {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartContainer = document.getElementById("cart-items");
  const couponInput = document.getElementById("coupon-code");
  const applyBtn = document.getElementById("apply-coupon");
  const couponMsg = document.getElementById("coupon-msg");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Handle Add to Cart
  addToCartButtons.forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const sizeSelect = document.getElementById("size-select");
      if (sizeSelect && sizeSelect.value === "") {
        showCartMessage("Please select a size before adding to cart!",true);
        return;
      }
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const img = this.getAttribute("data-img");

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showCartMessage(`${name} added to cart!`);
    });
  });

  // Render Cart
  function renderCart() {
    if (!cartContainer) return;

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      const actions = document.getElementById("cart-actions");
      if (actions) actions.style.display = "none";
      return;
    }

    let totalBeforeDiscount = subtotal(cart);
    let discount = 0;
    if (isCouponApplied && totalBeforeDiscount >= 50) {
      discount = 50;
    }

    const shipping = totalBeforeDiscount - discount > 0 ? 25 : 0;
    const grandTotal = totalBeforeDiscount - discount + shipping;

    let html = `
      <table>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
    `;

    cart.forEach((item, index) => {
      const total = item.qty * item.price;
      html += `
        <tr>
          <td><img src="${item.img}" width="70" /></td>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td>${item.qty}</td>
          <td>$${total.toFixed(2)}</td>
          <td><button class="delete-btn" data-index="${index}">Remove</button></td>
        </tr>
      `;
    });

    html += `
      <tr><td colspan="4"><strong>Subtotal</strong></td><td colspan="2">$${totalBeforeDiscount.toFixed(2)}</td></tr>
      <tr><td colspan="4"><strong>Coupon Discount</strong></td><td colspan="2">- $${discount.toFixed(2)}</td></tr>
      <tr><td colspan="4"><strong>Shipping</strong></td><td colspan="2">+ $${shipping.toFixed(2)}</td></tr>
      <tr><td colspan="4"><strong>Grand Total</strong></td><td colspan="2"><strong>$${grandTotal.toFixed(2)}</strong></td></tr>
    </table>`;

    cartContainer.innerHTML = html;

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        if (cart[index].qty > 1) {
          cart[index].qty -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  // Apply Coupon
  applyBtn?.addEventListener("click", function () {
    const code = couponInput.value.trim().toUpperCase();

    if (code === "SHOPSP" && subtotal(cart) >= 50) {
      isCouponApplied = true;
      couponMsg.textContent = "Coupon applied successfully!";
      couponMsg.style.color = "green";
    } else {
      isCouponApplied = false;
      couponMsg.textContent = "Invalid or ineligible coupon!";
      couponMsg.style.color = "red";
    }

    renderCart();
  });

  renderCart();
});


// For animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }  else {
          entry.target.classList.remove('visible');
        }
      });
    },
    {
      threshold: 0.3
    }
  );

  document.querySelectorAll('.animate-towards-right').forEach(el => observer.observe(el));
  document.querySelectorAll('.animate-towards-left').forEach(el => observer.observe(el));
  document.querySelectorAll('.animate-towards-left').forEach(el => observer.observe(el));
  document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));



