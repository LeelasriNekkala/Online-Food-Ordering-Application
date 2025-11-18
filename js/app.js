// Modern JS: IIFE to avoid globals
(() => {
  // ----- Simple product list (replace image filenames with yours) -----
  const products = [
    {
      id: "p1",
      title: "Margherita Pizza",
      category: "Pizza",
      price: 299,
      img: "assets/pizza2.png",
    },
    {
      id: "p2",
      title: "Pepperoni Pizza",
      category: "Pizza",
      price: 349,
      img: "assets/pizza3.png",
    },
    {
      id: "p3",
      title: "Spicy Chicken Kabab",
      category: "Chicken",
      price: 199,
      img: "assets/chiken2.png",
    },
    {
      id: "p4",
      title: "Juicy Chicken Kabab",
      category: "Chicken",
      price: 240,
      img: "assets/chicken.png",
    },
    {
      id: "p5",
      title: "Veg Fried Rice",
      category: "Rice",
      price: 179,
      img: "assets/rice1.png",
    },
    {
      id: "p6",
      title: "Chicken Kabab Biryani",
      category: "Rice",
      price: 399,
      img: "assets/rice2.png",
    },
    {
      id: "p7",
      title: "Veg Biryani",
      category: "Rice",
      price: 299,
      img: "assets/rice3.png",
    },
    {
      id: "p8",
      title: "Fresh Lemon Drink",
      category: "Drinks",
      price: 199,
      img: "assets/drink1.jpg",
    },
    {
      id: "p9",
      title: "Refreshing Podina Drink",
      category: "Drinks",
      price: 199,
      img: "assets/drink2.png",
    },
    {
      id: "p10",
      title: "Special Veg Noodles",
      category: "Noodles",
      price: 199,
      img: "assets/noodles1.png",
    },
    {
      id: "p11",
      title: "Spicy Veg Noodles",
      category: "Noodles",
      price: 199,
      img: "assets/noodles2.png",
    },
    {
      id: "p12",
      title: "Italian Style Pasta",
      category: "Pasta",
      price: 99,
      img: "assets/pasta1.png",
    },
    // {
    //   id: "p13",
    //   title: "Veg Pasta",
    //   category: "Pasta",
    //   price: 99,
    //   img: "assets/pasta2.png",
    // },
  ];

  // DOM elements
  const productsRow = document.getElementById("productsRow");
  const categorySelect = document.getElementById("categorySelect");
  const cartBtn = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");
  const cartCanvasEl = document.getElementById("cartCanvas");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const payAmountText = document.getElementById("payAmountText");
  const alertPlaceholder = document.getElementById("alertPlaceholder");

  // Bootstrap Offcanvas instance
  let cartOffcanvas;
  document.addEventListener("DOMContentLoaded", () => {
    cartOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartCanvasEl);
  });

  // ----- Utilities -----
  const notify = (msg, type = "success", timeout = 2500) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>`;
    alertPlaceholder.appendChild(wrapper);
    setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance(
        wrapper.querySelector(".alert")
      );
      alert.close();
    }, timeout);
  };

  // Local storage wrappers
  const storage = {
    get(key, defaultVal) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultVal;
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
  };

  // ----- Auth (very simple) -----
  const usersKey = "ofa_users";
  const sessionKey = "ofa_session";

  function registerUser({ name, email, password }) {
    const list = storage.get(usersKey, []);
    if (list.find((u) => u.email === email))
      throw new Error("Email already registered");
    list.push({ name, email, password });
    storage.set(usersKey, list);
  }

  function loginUser({ email, password }) {
    const list = storage.get(usersKey, []);
    const user = list.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");
    storage.set(sessionKey, user);
  }

  function getCurrentUser() {
    return storage.get(sessionKey, null);
  }

  function logoutUser() {
    localStorage.removeItem(sessionKey);
  }

  // ----- Cart management -----
  const cartKey = "ofa_cart";
  function getCart() {
    return storage.get(cartKey, []);
  }
  function saveCart(c) {
    storage.set(cartKey, c);
  }

  function addToCart(productId, qty = 1) {
    const p = products.find((product) => product.id === productId);
    if (!p) return;
    const cart = getCart();
    const items = cart.find((item) => item.id === productId);
    if (items) items.qty += qty;
    else
      cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty });
    saveCart(cart);
    renderCart();
    notify(`${p.title} added to cart`);
  }

  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((product) => product.id !== productId);
    saveCart(cart);
    renderCart();
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find((product) => product.id === productId);
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart(cart);
    renderCart();
  }

  function clearCart() {
    saveCart([]);
    renderCart();
  }

  function cartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // ----- Rendering -----
  function renderProducts(list = products) {
    productsRow.innerHTML = "";
    const fragment = document.createDocumentFragment();

    list.forEach((product) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

      col.innerHTML = `
        <div class="product-card h-100 d-flex flex-column">
          <img src="${product.img}" alt="${escapeHtml(product.title)}">
          <div class="mt-2">
            <h6 class="mb-1">${escapeHtml(product.title)}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <strong>₹${product.price}</strong>
              <div>
                <button data-id="${
                  product.id
                }" class="btn btn-sm btn-outline-primary add-cart-btn">Add</button>
              </div>
            </div>
          </div>
        </div>
      `;
      fragment.appendChild(col);
    });

    productsRow.appendChild(fragment);
  }

  function renderCategories() {
    const categories = Array.from(
      new Set(products.map((product) => product.category))
    );
    categorySelect.innerHTML =
      `<option value="all">All Categories</option>` +
      categories.map((c) => `<option value="${c}">${c}</option>`).join("");
  }

  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = "";
    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<div class="text-muted">Cart is empty</div>`;
    } else {
      const frag = document.createDocumentFragment();
      cart.forEach((item) => {
        const div = document.createElement("div");
        div.className = "cart-item d-flex align-items-center";
        div.innerHTML = `
          <img src="${
            item.img
          }" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:.5rem;margin-right:.75rem;">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <strong>${escapeHtml(
                  item.title
                )}</strong> <div class="text-muted small">₹${
          item.price
        } each</div>
              </div>
              <div>
                <button data-id="${
                  item.id
                }" class="btn btn-sm btn-link text-danger remove-item">Remove</button>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2 mt-2 qty-controls">
              <button class="btn btn-outline-secondary btn-sm minus" data-id="${
                item.id
              }">-</button>
              <div class="border px-2 py-1 rounded">${item.qty}</div>
              <button class="btn btn-outline-secondary btn-sm plus" data-id="${
                item.id
              }">+</button>
            </div>
          </div>
        `;
        frag.appendChild(div);
      });
      cartItemsEl.appendChild(frag);
    }

    cartCount.textContent = getCart().reduce(
      (sum, index) => sum + index.qty,
      0
    );
    cartTotalEl.textContent = `₹${cartTotal()}`;
    payAmountText.textContent = `₹${cartTotal()}`;
  }

  // ----- Helpers -----
  function escapeHtml(text) {
    return String(text).replace(
      /[&<>"'`=\/]/g,
      (s) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "/": "&#x2F;",
          "`": "&#x60;",
          "=": "&#x3D;",
        }[s])
    );
  }

  // ----- Events -----
  // Add to cart (event delegation)
  document.addEventListener("click", (e) => {
    if (e.target.matches(".add-cart-btn")) {
      const id = e.target.dataset.id;
      addToCart(id, 1);
    }
    if (e.target.matches("#cartBtn") || e.target.closest("#cartBtn")) {
      cartOffcanvas.show();
    }
    // remove item
    if (e.target.matches(".remove-item")) {
      const id = e.target.dataset.id;
      removeFromCart(id);
    }
    if (e.target.matches(".minus")) {
      const id = e.target.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.id === id);
      if (item) updateQty(id, item.qty - 1);
    }
    if (e.target.matches(".plus")) {
      const id = e.target.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.id === id);
      if (item) updateQty(id, item.qty + 1);
    }
  });

  // category filter
  categorySelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "all") renderProducts(products);
    else renderProducts(products.filter((p) => p.category === val));
  });

  // registration form
  const registerForm = document.getElementById("registerForm");
  registerForm?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document
      .getElementById("regEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("regPassword").value;

    // basic client validation
    if (!name || !validateEmail(email) || password.length < 6) {
      registerForm.classList.add("was-validated");
      return;
    }

    try {
      registerUser({ name, email, password });
      notify("Registration successful. You can now login", "success");
      // switch to login tab
      const loginTab = document.getElementById("tab-login");
      new bootstrap.Tab(loginTab).show();
      registerForm.reset();
    } catch (err) {
      notify(err.message, "danger");
    }
  });

  // login form
  const loginForm = document.getElementById("loginForm");
  loginForm?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = document
      .getElementById("loginEmail")
      .value.trim()
      .toLowerCase();
    const password = document.getElementById("loginPassword").value;
    if (!validateEmail(email) || !password) {
      loginForm.classList.add("was-validated");
      return;
    }
    try {
      loginUser({ email, password });
      notify("Login successful", "success");
      document
        .getElementById("authModal")
        ?.querySelector(".btn-close")
        ?.click();
    } catch (err) {
      notify(err.message, "danger");
    }
  });

  // Checkout button: ensure logged in & cart not empty
  checkoutBtn?.addEventListener("click", (ev) => {
    const user = getCurrentUser();
    const cart = getCart();
    if (!user) {
      ev.preventDefault();
      notify("Please login or register before checkout", "warning");
      // switch to auth modal
      const authModalEl = document.getElementById("authModal");
      const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
      authModal.show();
      // show login tab
      document.getElementById("tab-login") &&
        new bootstrap.Tab(document.getElementById("tab-login")).show();
      return;
    }
    if (!cart.length) {
      ev.preventDefault();
      notify("Cart is empty", "warning");
      cartOffcanvas.hide();
      return;
    }
    // set pay amount text is handled in renderCart
  });

  // Payment form (simulation)
  const paymentForm = document.getElementById("paymentForm");
  paymentForm?.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!paymentForm.checkValidity()) {
      paymentForm.classList.add("was-validated");
      return;
    }

    // minimal validation
    const cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s+/g, "");
    if (!/^\d{12,19}$/.test(cardNumber)) {
      notify("Enter valid card number", "danger");
      return;
    }

    // simulate payment processing
    notify("Payment processing...", "info", 1200);
    setTimeout(() => {
      // success
      const user = getCurrentUser();
      const total = cartTotal();
      clearCart();
      notify(
        `Payment successful! ₹${total} charged. Thank you, ${
          user?.name || "Customer"
        }.`,
        "success",
        5000
      );
      document
        .getElementById("checkoutModal")
        ?.querySelector(".btn-close")
        ?.click();
      cartOffcanvas.hide();
    }, 1200);
  });

  // Utility validate email
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Format card number input with spaces
  const cardNumberInput = document.getElementById("cardNumber");
  cardNumberInput?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 19);
    v = v.match(/.{1,4}/g)?.join(" ") || v;
    e.target.value = v;
  });

  // init
  function init() {
    renderProducts(products);
    renderCategories();
    renderCart();
    // prefill pay amount text
    payAmountText.textContent = `₹${cartTotal()}`;
  }

  init();
})();
