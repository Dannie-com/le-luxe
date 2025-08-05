// script.js

const product = [
  {
    id: "001",
    name: "LEOPARD PRINT 2 PIECE",
    price: 50000,
    image: "images/leopard 2 piece.jpg",
    stock: 5,
    description: "A stylish LEOPARD PRINT 2 PIECE for parties or girls night out.",
    extraImages: [
      "images/blue-jacket-side.jpg",
      "images/blue-jacket-back.jpg"
    ]
  },
  {
    id: "002",
    name: "White Sneakers",
    price: 15000,
    image: "images/white-sneakers.jpg",
    stock: 0,
    description: "Classic white sneakers for everyday wear.",
    extraImages: [
      "images/white-sneakers-side.jpg",
      "images/white-sneakers-top.jpg"
    ]
  },
  // Add more products...
];



let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.innerText = cart.length;
}

// cart.js
document.addEventListener("DOMContentLoaded", updateCartCount);


function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // refresh cart page
  updateCartCount();
}



function searchProducts() {
  const input = document.getElementById("search-input").value.toLowerCase();
  const products = document.querySelectorAll(".product-card"); // All your product cards

  products.forEach(product => {
    const title = product.querySelector(".product-name").innerText.toLowerCase();
    product.style.display = title.includes(input) ? "block" : "none";
  });
}



function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItemsContainer.innerHTML += `
      <div class="card mb-3 p-3">
        <h5>${item.name} - ₦${item.price}</h5>
        <button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">Remove</button>
      </div>
    `;
  });

  totalElement.innerText = `Total: ₦${total}`;
}

// Run when cart page loads
if (document.title.includes("Cart")) {
  renderCart();
}

const paystackKey = "pk_test_xxxxxxxxxxxxxxxxxx"; // Replace with your Paystack public key

function payWithPaystack(totalAmount) {
  let handler = PaystackPop.setup({
    key: paystackKey,
    email: "customer@email.com", // You can replace this with user input
    amount: totalAmount * 100, // Paystack uses kobo
    currency: "NGN",
    callback: function (response) {
      alert("Payment successful! Ref: " + response.reference);
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCart();
    },
    onClose: function () {
      alert("Transaction cancelled");
    }
  });
  handler.openIframe();
}

document.getElementById("checkout-button")?.addEventListener("click", () => {
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  payWithPaystack(total);
});

const products = [ 
  // Your product array with id, name, price, image, description, etc.
];

// Listen for clicks on product cards
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    const productId = card.getAttribute('data-product-id');
    const product = products.find(p => p.id == productId);

    if (product) {
      showProductModal(product);
    }
  });
});

// Show product details in modal
function showProductModal(product) {
  document.getElementById('productModalLabel').textContent = product.name;
  document.getElementById('modalProductImage').src = product.image;
  document.getElementById('modalProductPrice').textContent = '₦' + product.price;
  document.getElementById('modalProductDescription').textContent = product.description;

  // Optional: Load extra images
  const extraImagesContainer = document.getElementById('extraImages');
  extraImagesContainer.innerHTML = '';
  if (product.extraImages) {
    product.extraImages.forEach(img => {
      const imgEl = document.createElement('img');
      imgEl.src = img;
      imgEl.style.width = '60px';
      imgEl.classList.add('img-thumbnail');
      extraImagesContainer.appendChild(imgEl);
    });
  }

  // Set Add to Cart button
  document.getElementById('modalAddToCart').onclick = () => {
    addToCart(product); // reuse your existing function
  };

  // Load reviews (we'll link to Firebase next step)
  loadProductReviews(product.id);

  // Open modal
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

// Get wishlist from localStorage or initialize as empty
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Handle heart button click
document.querySelectorAll(".wishlist-btn").forEach(btn => {
  const productId = btn.getAttribute("data-product-id");

  if (wishlist.includes(productId)) {
    btn.classList.add("text-danger"); // Highlight if already in wishlist
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering modal

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
      btn.classList.remove("text-danger");
    } else {
      wishlist.push(productId);
      btn.classList.add("text-danger");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  });
});

 function renderProducts() {
      const container = document.getElementById("productList");
      products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        col.innerHTML = `
          <div class="card shadow-sm h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text text-success">₦${product.price}</p>
              <button class="btn btn-outline-secondary" onclick="addToWishlist('${product.id}')">❤️ Add to Wishlist</button>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    }

    function addToWishlist(id) {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (!wishlist.includes(id)) {
        wishlist.push(id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Added to wishlist!");
      } else {
        alert("Already in wishlist!");
      }
    }



function openWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistBody = document.getElementById("wishlistModalBody");

  if (wishlist.length === 0) {
    wishlistBody.innerHTML = "<p>No items in wishlist.</p>";
  } else {
    wishlistBody.innerHTML = wishlist.map(item => `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">₦${item.price}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('wishlistModal'));
  modal.show();
}

 document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Simulate sending...
  const alertBox = document.getElementById("formAlert");
  alertBox.innerHTML = `<div class="alert alert-success">Message sent! We'll get back to you soon.</div>`;

  // Clear form fields
  document.getElementById("contactForm").reset();
});

