// html elements linked by dom 
const quantityBoxes = document.querySelectorAll(".food_quantity");
const cartIcon = document.querySelector(".fa-cart-shopping");
const cartItems = document.getElementById("cart_items");
const totalPriceElement = document.getElementById("totalPrice");

// for cart popup
const cartPopup = document.createElement("div");
cartPopup.id = "cart_popup";
cartPopup.style.position = "fixed";
cartPopup.style.top = "95px";
cartPopup.style.right = "50px";
cartPopup.style.background = "#fff";
cartPopup.style.padding = "15px";
cartPopup.style.borderRadius = "15px";
cartPopup.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
cartPopup.style.display = "none";
cartPopup.style.maxHeight = "350px";
cartPopup.style.overflowY = "auto";
document.body.appendChild(cartPopup);

// it is used to store data to avoid clear cart after refresh page
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// to show items in cart
cartIcon.addEventListener("click", () => {
  cartPopup.style.display =
    cartPopup.style.display === "none" ? "block" : "none";
});

// to save the cart in local storage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// update cart ui
function updateCart() {
  cartPopup.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;

  const items = Object.keys(cart);

  if (items.length === 0) {
    cartPopup.innerHTML = "<p>Your cart is empty</p>";
    cartItems.innerText = "0";
    totalPriceElement.innerText = "0.00";
    saveCart();
    return;
  }

  items.forEach((item) => {
    const { quantity, price } = cart[item];
    totalQty += quantity;
    totalPrice += quantity * price;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.marginBottom = "8px";

    row.innerHTML = `
      <span>${item} x ${quantity}</span>
      <span>
        ₹${(quantity * price).toFixed(2)}
        <button style="margin-left:6px;background:red;color:white;border:none;border-radius:50%;cursor:pointer;">✖</button>
      </span>
    `;

    row.querySelector("button").addEventListener("click", () => {
      delete cart[item];
      syncQuantities();
      updateCart();
    });

    cartPopup.appendChild(row);
  });

  // order button 
  const orderBtn = document.createElement("button");
  orderBtn.innerText = "ORDER NOW";
  orderBtn.style.width = "100%";
  orderBtn.style.marginTop = "10px";
  orderBtn.style.padding = "10px";
  orderBtn.style.background = "green";
  orderBtn.style.color = "white";
  orderBtn.style.border = "none";
  orderBtn.style.borderRadius = "8px";
  orderBtn.style.cursor = "pointer";

  orderBtn.addEventListener("click", placeOrder);
  cartPopup.appendChild(orderBtn);

  cartItems.innerText = totalQty;
  totalPriceElement.innerText = totalPrice.toFixed(2);
  saveCart();
}

// place order
function placeOrder() {
  alert("✅ Order placed successfully!");

  cart = {};
  localStorage.removeItem("cart");

  syncQuantities();
  cartPopup.style.display = "none";
  cartItems.innerText = "0";
  totalPriceElement.innerText = "0.00";
}

// sync ui quantity
function syncQuantities() {
  quantityBoxes.forEach((box) => {
    const card = box.closest(".card_container");
    const title = card.querySelector(".food_title").innerText.trim();
    const icons = box.querySelectorAll("i");
    const minusBtn = icons[0];
    const plusBtn = icons[1];
    const qty = cart[title]?.quantity || 0;

    box.innerHTML = "";
    const span = document.createElement("span");
    span.className = "count";
    span.innerText = qty;

    box.appendChild(minusBtn);
    box.appendChild(span);
    box.appendChild(plusBtn);
  });
}
// quantity goals
quantityBoxes.forEach((box) => {
  const icons = box.querySelectorAll("i");
  const minusBtn = icons[0];
  const plusBtn = icons[1];
  const card = box.closest(".card_container");
  const title = card.querySelector(".food_title").innerText.trim();
  const price = parseFloat(
    card.querySelector(".food_price").innerText.replace(/[^\d.]/g, "")
  );

  let currentQty = cart[title]?.quantity || 0;

  function renderQty() {
    box.innerHTML = "";
    const span = document.createElement("span");
    span.className = "count";
    span.innerText = currentQty;
    box.appendChild(minusBtn);
    box.appendChild(span);
    box.appendChild(plusBtn);
  }

  renderQty();

  minusBtn.addEventListener("click", () => {
    if (currentQty > 0) {
      currentQty--;
      if (currentQty === 0) {
        delete cart[title];
      } else {
        cart[title].quantity = currentQty;
      }
      renderQty();
      updateCart();
    }
  });

  plusBtn.addEventListener("click", () => {
    if (currentQty >= 10) return;
    currentQty++;
    cart[title] = { quantity: currentQty, price };
    renderQty();
    updateCart();
  });
});

// initial load
syncQuantities();
updateCart();
