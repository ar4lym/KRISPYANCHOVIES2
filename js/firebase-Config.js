// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Firebase config
export const firebaseConfig = {
  apiKey: "AIzaSyC8ul32MS9avOm_W5yDcqh07J-T9d2Y0tw",
  authDomain: "itdxdda-asg1.firebaseapp.com",
  databaseURL: "https://itdxdda-asg1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itdxdda-asg1",
  storageBucket: "itdxdda-asg1.firebasestorage.app",
  messagingSenderId: "1029195562319",
  appId: "1:1029195562319:web:58900572288dc8b757993a",
  measurementId: "G-PKKVJ22GQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Sign Up
const habitatAnimals = {
  "Ocean": ["Jellyfish", "Sunfish"],
  "Arctic": ["Penguin", "Polarbear"],
  "Mangroove": ["Crocodile", "Frog"],
  "Coral Reef": ["Clownfish", "Mantaray"]
};

// Sign Up
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    console.log("User signed up successfully:", uid);

    // Create player data
    const playerData = {
      username: username,
      email: email,
      password: password,
      habitats: {}
    };

    // Add habitats → animals → stats
    for (const habitat in habitatAnimals) {
      playerData.habitats[habitat] = {};
      habitatAnimals[habitat].forEach(animal => {
        playerData.habitats[habitat][animal] = {
          timeTaken: 0,
          pointsEarned: 0
        };
      });
    }

    // Save to Firebase Realtime Database
    await set(ref(db, `players/${uid}`), playerData);

    console.log("Player data saved successfully!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error signing up:", error);
    alert("Sign up failed: " + error.message);
  }
});


$(document).ready(function () {

  var leaderboardData = [
    { rank: 1, name: "John Doe", score: 100 },
    { rank: 2, name: "Jane Smith", score: 90 },
    { rank: 3, name: "Mike Johnson", score: 80 },
    { rank: 4, name: "Sarah Williams", score: 70 },
    { rank: 5, name: "David Brown", score: 60 }
  ];

  function updateLeaderboard() {
    var table = $("#leaderboardTableBody");
    table.empty();

    leaderboardData.forEach(player => {
      table.append(`
            <tr>
              <td>${player.rank}</td>
              <td>${player.name}</td>
              <td>${player.score}</td>
            </tr>
          `);
    });
  }

  updateLeaderboard();

  setInterval(() => {
    leaderboardData.forEach(p => p.score += Math.floor(Math.random() * 10) + 1);

    leaderboardData.sort((a, b) => b.score - a.score);

    leaderboardData.forEach((p, i) => p.rank = i + 1);

    updateLeaderboard();
  }, 5000);

});