/**
 * ======================================================
 * Firebase SDK Imports
 * ======================================================
 * - App initialization
 * - Authentication
 * - Realtime Database
 */
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/**
 * ======================================================
 * Firebase Configuration
 * ======================================================
 * Contains project-specific Firebase credentials
 */
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

/**
 * ======================================================
 * Firebase Initialization
 * ======================================================
 */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

/**
 * ======================================================
 * Habitat & Animal Definitions
 * ======================================================
 * Used to generate player progress structure
 */
const habitatAnimals = {
  "Ocean": ["Jellyfish", "Sunfish"],
  "Arctic": ["Penguin", "Polarbear"],
  "Mangroove": ["Crocodile", "Frog"],
  "Coral Reef": ["Clownfish", "Mantaray"]
};

/**
 * ======================================================
 * LOGIN HANDLER
 * ======================================================
 * Authenticates user and loads player data
 */
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

/**
 * ======================================================
 * SIGN-UP HANDLER
 * ======================================================
 * Creates a new user and initializes habitat data
 */
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

      localStorage.setItem("uid", uid);

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

/**
 * ======================================================
 * Get Top 5 Players by Habitat
 * ======================================================
 * @param {string} habitatName - Habitat to rank
 * @returns {Promise<Array>}
 */
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

/**
 * ======================================================
 * Pie Chart for homepage dashboard check the total downloads
 * ======================================================
 */

let downloadsChart;

function initDownloadChart() {
  const ctx = document.getElementById("downloadsChart");
  const totalsText = document.getElementById("totalsText");

  if (!ctx) return;

  const usersRef = ref(db, "players");

  // Listen for real-time updates
  onValue(usersRef, snapshot => {
    const data = snapshot.val() || {};
    const totalUsers = Object.keys(data).length;

    // Update the text
    totalsText.textContent = `Total Downloads: ${totalUsers}`;

    // Update the chart
    if (downloadsChart) {
      downloadsChart.data.datasets[0].data = [totalUsers];
      downloadsChart.update();
      return;
    }

    // Create chart if it doesn't exist yet
    downloadsChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Downloads"],
        datasets: [{
          data: [totalUsers],
          backgroundColor: ["#00b4d8"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDownloadChart();
  loadBestTimesChart();
});

/**
 * ======================================================
 * Bar graph for homepage dashboard to load best time for each habitat
 * ======================================================
 */

let habitatChart;

function loadBestTimesChart() {
  const ctx = document.getElementById("habitatBestChart");
  if (!ctx) return;

  const habitats = ["Ocean", "Arctic", "Mangroove", "Coral Reef"];
  const playersRef = ref(db, "players");

  onValue(playersRef, snapshot => {
    const data = snapshot.val() || {};
    const times = [];

    habitats.forEach(habitat => {
      let bestTime = Infinity;

      for (let uid in data) {
        const player = data[uid];
        if (!player.habitats || !player.habitats[habitat]) continue;

        for (let animal in player.habitats[habitat]) {
          const t = player.habitats[habitat][animal].timeTaken;
          if (t > 0 && t < bestTime) bestTime = t;
        }
      }

      times.push(bestTime === Infinity ? 0 : bestTime);
    });

    if (habitatChart) {
      habitatChart.data.datasets[0].data = times;
      habitatChart.update();
      return;
    }

    habitatChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: habitats,
        datasets: [{
          label: "Best Time (seconds)",
          data: times,
          backgroundColor: "#0077b6"
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Seconds" }
          }
        }
      }
    });
  });
}

/**
 * ======================================================
 * Display points in real-time on redeem page
 * ======================================================
 */

const uid = localStorage.getItem("uid");
const pointsText = document.getElementById("playerPoints");

onAuthStateChanged(auth, (user) => {
  if (!user || !pointsText) return;

  const uid = user.uid;
  const playerRef = ref(db, `players/${uid}`);

  onValue(playerRef, (snapshot) => {
    if (!snapshot.exists()) return;

    const player = snapshot.val();
    let totalPoints = 0;

    for (let habitat in player.habitats) {
      for (let animal in player.habitats[habitat]) {
        totalPoints += player.habitats[habitat][animal].pointsEarned || 0;
      }
    }

    pointsText.textContent = `${totalPoints} points`;
  });
});
/**
 * ======================================================
 * Updates leaderboard based on selected habitat filter real-time
 * and also shows all timings of the logged-in user
 * ======================================================
 */
const leaderboardBody = document.getElementById("leaderboardTableBody");
const allTimingsBody = document.getElementById("allTimingsBody");

let currentHabitat = "all";

function loadLeaderboard(selectedHabitat) {
  const playersRef = ref(db, "players");

  onValue(playersRef, snapshot => {
    leaderboardBody.innerHTML = "";
    allTimingsBody.innerHTML = "";

    if (!snapshot.exists()) {
      leaderboardBody.innerHTML = `<tr><td colspan="4">No data</td></tr>`;
      allTimingsBody.innerHTML = `<tr><td colspan="4">No runs yet</td></tr>`;
      return;
    }

    const players = snapshot.val();
    const loggedInUID = localStorage.getItem("uid");
    let allRecords = [];

    // Collect ALL timings
    for (const playerUID in players) {
      const player = players[playerUID];
      if (!player.habitats) continue;

      for (const habitatName in player.habitats) {
        for (const animal in player.habitats[habitatName]) {
          const record = player.habitats[habitatName][animal];
          if (!record.timeTaken || record.timeTaken <= 0) continue;

          allRecords.push({
            username: player.username || "Unknown",
            habitat: habitatName,
            animal: animal,
            time: record.timeTaken
          });

          // Your personal timings
          if (playerUID === loggedInUID) {
            allTimingsBody.innerHTML += `
              <tr>
                <td>${player.username || "You"}</td>
                <td>${habitatName}</td>
                <td>${animal}</td>
                <td>${record.timeTaken}</td>
              </tr>
            `;
          }
        }
      }
    }

    if (allTimingsBody.innerHTML === "") {
      allTimingsBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">No runs yet</td>
        </tr>
      `;
    }

    const topResults = [];
    const habitatsToCheck = selectedHabitat === "all" ? Object.keys(habitatAnimals) : [selectedHabitat];

    habitatsToCheck.forEach(habitat => {
      habitatAnimals[habitat].forEach(animal => {
        // Find the fastest timing for this animal
        const fastest = allRecords
          .filter(r => r.habitat === habitat && r.animal === animal)
          .sort((a, b) => a.time - b.time)
          .slice(0, 1); // top 1 per animal

        if (fastest.length > 0) topResults.push(fastest[0]);
      });
    });

    // Sort final top 5 across all checked animals/habitats
    const finalTop5 = topResults.sort((a, b) => a.time - b.time).slice(0, 5);

    if (finalTop5.length === 0) {
      leaderboardBody.innerHTML = `<tr><td colspan="4">No data</td></tr>`;
      return;
    }

    finalTop5.forEach((row, index) => {
      leaderboardBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${row.username}</td>
          <td>${row.animal} (${row.habitat})</td>
          <td>${row.time}</td>
        </tr>
      `;
    });
  });
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    loadLeaderboard(btn.dataset.habitat);
  });
});

// Initial load
loadLeaderboard("all");