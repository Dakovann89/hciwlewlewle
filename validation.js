const menu = {
  pizza:    ["Pizza Margherita", "Pizza Diavola", "Pizza Quattro Formaggi"],
  pasta:    ["Penne al Ragu", "Spaghetti Carbonara", "Penne Arrabbiata"],
  tiramisu: ["Classic Tiramisu", "Tiramisu Pistachio", "Chocolate Tiramisu"],
  gelato:   ["Pistachio Gelato", "Chocolate Gelato", "Strawberry Gelato"]
};

const buttons      = document.querySelectorAll(".menuBtn");
const variant      = document.getElementById("variant");
const cartBox      = document.getElementById("cart");
const pickupInfo   = document.getElementById("pickupInfo");
const addressGroup = document.getElementById("addressGroup");
const radios       = document.querySelectorAll('input[name="delivery"]');

let cart = [];

function showError(id, msg) { document.getElementById(id).textContent = msg; }
function clearError(id)     { document.getElementById(id).textContent = "";  }

buttons.forEach(btn => {
  btn.onclick = () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    variant.innerHTML = `<option value="">Choose Variant</option>`;
    menu[btn.dataset.type].forEach(item => {
      variant.innerHTML += `<option value="${item}">${item}</option>`;
    });
  };
});

document.getElementById("addBtn").onclick = () => {
  if (!variant.value) { showError("cartError", "Please choose a menu and variant first."); return; }
  clearError("cartError");
  const exist = cart.find(i => i.name === variant.value);
  exist ? exist.qty++ : cart.push({ name: variant.value, qty: 1 });
  renderCart();
};

function renderCart() {
  if (!cart.length) { cartBox.innerHTML = `<p class="empty">No order yet</p>`; return; }
  cartBox.innerHTML = cart.map((item, i) => `
    <div class="cartItem">
      <div>${item.name}</div>
      <div class="cartRight">
        <button class="qtyBtn" onclick="changeQty(${i}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qtyBtn" onclick="changeQty(${i}, 1)">+</button>
      </div>
    </div>`).join("");
}

function changeQty(i, delta) {
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  renderCart();
}

radios.forEach(r => {
  r.addEventListener("change", () => {
    const isDelivery = r.value === "delivery" && r.checked;
    pickupInfo.style.display   = r.value === "pickup" && r.checked ? "block" : "none";
    addressGroup.style.display = isDelivery ? "block" : "none";
    if (!isDelivery) { document.getElementById("address").value = ""; clearError("addressError"); }
  });
});

function validateName(v) {
  if (!v)       { showError("nameError", "Full name is required."); return false; }
  if (v.length < 3) { showError("nameError", "Name must be at least 3 characters."); return false; }
  clearError("nameError"); return true;
}

function validatePhone(v) {
  if (!v) { showError("phoneError", "Phone number is required."); return false; }
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c < 48 || c > 57) { showError("phoneError", "Phone number must contain digits only."); return false; }
  }
  if (v.length < 8 || v.length > 10) { showError("phoneError", "Phone number must be 8–10 digits."); return false; }
  clearError("phoneError"); return true;
}

function validateCart() {
  if (!cart.length) { showError("cartError", "Please add at least one item."); return false; }
  clearError("cartError"); return true;
}

function validateDelivery() {
  if (!document.querySelector('input[name="delivery"]:checked')) {
    showError("deliveryError", "Please choose a delivery option."); return false;
  }
  clearError("deliveryError"); return true;
}

function validateAddress() {
  const checked = document.querySelector('input[name="delivery"]:checked');
  if (!checked || checked.value !== "delivery") { clearError("addressError"); return true; }
  const addr = document.getElementById("address").value.trim();
  if (!addr) { showError("addressError", "Delivery address is required."); return false; }
  clearError("addressError"); return true;
}

function validatePayment() {
  if (!document.querySelector('input[name="payment"]:checked')) {
    showError("paymentError", "Please choose a payment method."); return false;
  }
  clearError("paymentError"); return true;
}

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const name  = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const ok = validateName(name) & validatePhone(phone) & validateCart()
           & validateDelivery() & validateAddress() & validatePayment();
  if (ok) {
    alert("Order placed successfully! Thank you, " + name + ".");
    cart = [];
    renderCart();
    e.target.reset();
    pickupInfo.style.display = addressGroup.style.display = "none";
  }
});