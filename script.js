// ===============================
// Cart Panel Toggle
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const cartPanel = document.getElementById("cart-panel");
    const openCartBtn = document.getElementById("open-cart");
    const closeCartBtn = document.getElementById("close-cart");
  
    if (openCartBtn && cartPanel) {
      openCartBtn.addEventListener("click", () => {
        cartPanel.classList.add("open");
        renderCart();
      });
    }
  
    if (closeCartBtn && cartPanel) {
      closeCartBtn.addEventListener("click", () => {
        cartPanel.classList.remove("open");
      });
    }
  
    window.addEventListener("click", (e) => {
      if (cartPanel && !cartPanel.contains(e.target) && !e.target.closest("#open-cart")) {
        cartPanel.classList.remove("open");
      }
    });
  
    renderCart(); // Always render cart
  });
  
  // ===============================
  // Local Storage Helpers
  // ===============================
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // ===============================
  // Render Cart Panel
  // ===============================
  function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
  
    if (!cartItemsContainer || !cartTotal) return;
  
    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <strong>${item.title}</strong><br>
        <small>Color: ${item.color || "N/A"}</small><br>
        <small>Size: ${item.size || "N/A"}</small><br>
        $${item.price.toFixed(2)} × 
        <button class="qty-btn" data-index="${index}" data-action="decrease">−</button>
        ${item.quantity}
        <button class="qty-btn" data-index="${index}" data-action="increase">+</button>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(div);
    });
  
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    attachCartEvents();
  }
  
  function attachCartEvents() {
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      });
    });
  
    document.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        const action = btn.dataset.action;
        const cart = getCart();
  
        if (action === "increase") cart[index].quantity += 1;
        if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity -= 1;
  
        saveCart(cart);
        renderCart();
      });
    });
  }
  
  // ===============================
  // Add to Cart from List Page
  // ===============================
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".product-card");
        const title = card.querySelector("h3").textContent;
        const price = parseFloat(card.querySelector("p").textContent.replace("$", ""));
        const selectedColorEl = card.querySelector(".color.selected");
  
        if (!selectedColorEl) {
          alert("Please select a color before adding to cart.");
          return;
        }
  
        const color = selectedColorEl.classList[1];
        const formattedColor = color.charAt(0).toUpperCase() + color.slice(1);
        const img = card.querySelector("img")?.src || "";
  
        const cart = getCart();
        const existingItem = cart.find(item => item.title === title && item.color === formattedColor);
  
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ title, price, quantity: 1, color: formattedColor, img });
        }
  
        saveCart(cart);
        renderCart();
        document.getElementById("cart-panel")?.classList.add("open");
      });
    });
  });
  
  // ===============================
  // Color Picker (List Page)
  // ===============================
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".color").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const siblings = swatch.parentElement.querySelectorAll(".color");
        siblings.forEach((s) => s.classList.remove("selected"));
        swatch.classList.add("selected");
      });
    });
  });
  
  // ===============================
  // Filtering Dropdowns
  // ===============================
  document.querySelectorAll(".dropdown-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const dropdown = button.parentElement;
      dropdown.classList.toggle("show");
    });
  });
  
  window.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  });
  
  // ===============================
  // Product Filtering
  // ===============================
  function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value.toLowerCase());
  }
  
  function applyFilters() {
    const selectedBrands = getCheckedValues("brand");
    const selectedColors = getCheckedValues("colour");
    const selectedSizes = getCheckedValues("size");
    const selectedTypes = getCheckedValues("type");
    const min = parseFloat(document.getElementById("min-price")?.value) || 0;
    const max = parseFloat(document.getElementById("max-price")?.value) || Infinity;
  
    document.querySelectorAll(".product-card").forEach((card) => {
      const brand = (card.dataset.brand || "").toLowerCase();
      const colours = (card.dataset.colour || "").toLowerCase().split(",");
      const size = (card.dataset.size || "").toLowerCase();
      const type = (card.dataset.type || "").toLowerCase();
      const price = parseFloat(card.dataset.price) || 0;
  
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(brand);
      const matchesColor = selectedColors.length === 0 || selectedColors.some((c) => colours.includes(c));
      const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(size);
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
      const matchesPrice = price >= min && price <= max;
  
      card.style.display = (matchesBrand && matchesColor && matchesSize && matchesType && matchesPrice) ? "block" : "none";
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    ["brand", "colour", "size", "type"].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        cb.addEventListener("change", applyFilters);
      });
    });
  
    ["min-price", "max-price"].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", () => {
          clearTimeout(window.priceTimeout);
          window.priceTimeout = setTimeout(applyFilters, 300);
        });
      }
    });
  
    applyFilters();
  });
  
  // ===============================
  // Product Page (Color, Size, Qty, Cart)
  // ===============================
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("productpage.html")) return;
  
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) return;
  
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("product-image").src = product.img;
    document.getElementById("product-image").alt = product.title;
  
    const colorContainer = document.getElementById("product-colors");
    product.colors.forEach((color) => {
      const span = document.createElement("span");
      span.classList.add("color", color.toLowerCase());
      span.setAttribute("data-color", color);
      colorContainer.appendChild(span);
    });
  
    document.querySelectorAll("#product-colors .color").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        document.querySelectorAll("#product-colors .color").forEach((c) => c.classList.remove("selected"));
        swatch.classList.add("selected");
      });
    });
  
    const sizes = ["10oz", "12oz", "14oz", "16oz"];
    const sizeContainer = document.getElementById("product-sizes");
    sizes.forEach((size) => {
      const btn = document.createElement("button");
      btn.classList.add("size-btn");
      btn.textContent = size;
      btn.setAttribute("data-size", size);
      sizeContainer.appendChild(btn);
    });
  
    document.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  
    let quantity = 1;
    const qtyDisplay = document.getElementById("quantity");
    document.getElementById("increase-qty").addEventListener("click", () => {
      quantity++;
      qtyDisplay.textContent = quantity;
    });
    document.getElementById("decrease-qty").addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
      }
    });
  
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      const selectedColor = document.querySelector("#product-colors .color.selected");
      const selectedSize = document.querySelector(".size-btn.selected");
  
      if (!selectedColor || !selectedSize) {
        alert("Please select both color and size.");
        return;
      }
  
      const cart = getCart();
      const existing = cart.find(item =>
        item.title === product.title &&
        item.color === selectedColor.dataset.color &&
        item.size === selectedSize.dataset.size
      );
  
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({
          title: product.title,
          price: product.price,
          color: selectedColor.dataset.color,
          size: selectedSize.dataset.size,
          quantity,
          img: product.img
        });
      }
  
      saveCart(cart);
      renderCart();
      alert("Item added to cart!");
    });
  });
  
  // ===============================
  // Open Product Page From List
  // ===============================
  function openProductPage(title, price, img, colors, description) {
    const productData = { title, price, img, colors, description };
    localStorage.setItem("selectedProduct", JSON.stringify(productData));
    window.location.href = "productpage.html";
  }
  
  // ===============================
  // Checkout Page Cart Display
  // ===============================
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("checkout.html")) return;
  
    const cart = getCart();
    const container = document.getElementById("checkout-items");
    const totalDisplay = document.getElementById("checkout-total");
    let total = 0;
  
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
  
      const div = document.createElement("div");
      div.classList.add("checkout-item");
      div.innerHTML = `
        <img src="${item.img || 'placeholder.jpg'}" alt="${item.title}" />
        <div>
          <strong>${item.title}</strong><br>
          ${item.color ? `Color: ${item.color}<br>` : ""}
          ${item.size ? `Size: ${item.size}<br>` : ""}
          <div class="qty">
            <button data-action="decrease" data-index="${index}">−</button>
            ${item.quantity}
            <button data-action="increase" data-index="${index}">+</button>
          </div>
          $${item.price.toFixed(2)}
        </div>
      `;
      container.appendChild(div);
    });
  
    totalDisplay.textContent = `$${total.toFixed(2)}`;
  
    container.querySelectorAll("button[data-action]").forEach(button => {
      button.addEventListener("click", () => {
        const index = parseInt(button.dataset.index);
        const action = button.dataset.action;
        if (action === "increase") cart[index].quantity += 1;
        if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity -= 1;
        saveCart(cart);
        location.reload();
      });
    });
  });