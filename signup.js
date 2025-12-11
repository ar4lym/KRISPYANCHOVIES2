// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyAWivCuDd-m04AEwGndHhg6z-BOKC2RAiA",
  authDomain: "dda-2025-5454f.firebaseapp.com",
  databaseURL: "https://dda-2025-5454f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dda-2025-5454f",
  storageBucket: "dda-2025-5454f.firebasestorage.app",
  messagingSenderId: "724817517035",
  appId: "1:724817517035:web:3c9ad0abc9393644bee1ae",
  measurementId: "G-591640SQ5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sign Up
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const newuser = {
    email: email,
    password: password,
  };

  const playerRef = ref(db, "users");

  set(playerRef, newuser);
});
