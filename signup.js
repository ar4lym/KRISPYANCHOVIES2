 // Import Firebase SDKs
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
    import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Sign Up
    document.getElementById("signupForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // Save user profile to Realtime Database
          set(ref(db, "users/" + user.uid), {
            email: user.email,
            createdAt: new Date().toISOString()
          });
          alert("Sign up successful!");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });

    // Log In
    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("Login successful!");
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });

    // Show user info
    const userInfoDiv = document.getElementById("userInfo");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userInfoDiv.innerHTML = `
          <p><strong>Logged in as:</strong> ${user.email}</p>
          <button id="logoutBtn">Log Out</button>
        `;
        document.getElementById("logoutBtn").addEventListener("click", () => {
          signOut(auth);
        });
      } else {
        userInfoDiv.innerHTML = "<p>No user logged in.</p>";
      }
    });