// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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
export const auth = getAuth(app);
export const db = getDatabase(app);

// ======================================================
// SIGN UP
// ======================================================

const habitatAnimals = {
  "Ocean": ["Jellyfish", "Sunfish"],
  "Arctic": ["Penguin", "Polarbear"],
  "Mangroove": ["Crocodile", "Frog"],
  "Coral Reef": ["Clownfish", "Mantaray"]
};

// LOGIN FORM
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const snapshot = await get(ref(db, "players/" + uid));

      if (snapshot.exists()) {
        const playerData = snapshot.val();

        localStorage.setItem("playerData", JSON.stringify(playerData));
        localStorage.setItem("uid", uid);

        window.location.href = "index.html";
      } else {
        alert("No player data found.");
      }

    } catch (error) {
      alert("Login error: " + error.message);
      console.error(error);
    }
  });
}

// SIGNUP FORM
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const playerData = {
        username,
        email,
        password,
        habitats: {}
      };

      for (const habitat in habitatAnimals) {
        playerData.habitats[habitat] = {};
        habitatAnimals[habitat].forEach(animal => {
          playerData.habitats[habitat][animal] = {
            timeTaken: 0,
            pointsEarned: 0
          };
        });
      }

      await set(ref(db, `players/${uid}`), playerData);
      window.location.href = "index.html";

    } catch (error) {
      alert("Sign up error: " + error.message);
      console.error(error);
    }
  });
}

// ======================================================
// 🔥 LEADERBOARD RETRIEVAL LOGIC
// ======================================================
export async function getTop5ByHabitat(habitatName) {
  const playersRef = ref(db, "players");
  const snapshot = await get(playersRef);

  if (!snapshot.exists()) return [];

  const players = snapshot.val();
  let results = [];

  for (let uid in players) {
    const player = players[uid];

    if (!player.habitats || !player.habitats[habitatName]) continue;

    let bestTime = Infinity;
    let bestAnimal = null;

    // Check each animal under the habitat
    for (let animal in player.habitats[habitatName]) {
      const time = player.habitats[habitatName][animal].timeTaken;

      if (time > 0 && time < bestTime) {
        bestTime = time;
        bestAnimal = animal;
      }
    }

    if (bestTime !== Infinity) {
      results.push({
        username: player.username,
        timeTaken: bestTime,
        animal: bestAnimal
      });
    }
  }

  results.sort((a, b) => a.timeTaken - b.timeTaken);

  return results.slice(0, 5);
}
