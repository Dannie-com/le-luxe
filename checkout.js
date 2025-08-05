// /js/checkout.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Your Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXXXXX",
  appId: "XXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const order = {
    name: e.target.name.value,
    address: e.target.address.value,
    phone: e.target.phone.value,
    date: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "orders"), order);
    alert("Order placed successfully!");
    e.target.reset();
  } catch (err) {
    console.error("Error saving order: ", err);
    alert("Failed to save order.");
  }
});
