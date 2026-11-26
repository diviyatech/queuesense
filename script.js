
const places = [
  {
    id: 1,
    name: "City General Hospital",
    category: "Hospital",
    location: "Central District",
    icon: "🏥",
    crowd: "High",
    wait: 35,
    reports: 28,
    updated: "4 min ago"
  },
  {
    id: 2,
    name: "Metro Shopping Mall",
    category: "Shopping",
    location: "City Centre",
    icon: "🛍️",
    crowd: "Moderate",
    wait: 18,
    reports: 19,
    updated: "6 min ago"
  },
  {
    id: 3,
    name: "Central Railway Station",
    category: "Transport",
    location: "Main Railway Road",
    icon: "🚆",
    crowd: "High",
    wait: 30,
    reports: 35,
    updated: "3 min ago"
  },
  {
    id: 4,
    name: "Green Leaf Restaurant",
    category: "Restaurant",
    location: "Market Street",
    icon: "🍽️",
    crowd: "Low",
    wait: 5,
    reports: 12,
    updated: "8 min ago"
  },
  {
    id: 5,
    name: "City Government Office",
    category: "Government",
    location: "Administrative Zone",
    icon: "🏢",
    crowd: "Moderate",
    wait: 22,
    reports: 21,
    updated: "5 min ago"
  },
  {
    id: 6,
    name: "Heritage Tourist Park",
    category: "Tourism",
    location: "Riverside Avenue",
    icon: "🌳",
    crowd: "Low",
    wait: 7,
    reports: 13,
    updated: "10 min ago"
  }
];

let totalReports = 128;

const placesGrid = document.getElementById("placesGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const crowdFilter = document.getElementById("crowdFilter");

const modal = document.getElementById("reportModal");
const reportForm = document.getElementById("reportForm");
const reportPlace = document.getElementById("reportPlace");
const reportCrowd = document.getElementById("reportCrowd");
const reportWait = document.getElementById("reportWait");

function getCrowdClass(level) {
  return level.toLowerCase();
}

function renderPlaces() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const crowd = crowdFilter.value;

  const filteredPlaces = places.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(search) ||
      place.location.toLowerCase().includes(search);

    const matchesCategory =
      category === "All" || place.category === category;

    const matchesCrowd =
      crowd === "All" || place.crowd === crowd;

    return matchesSearch && matchesCategory && matchesCrowd;
  });

  placesGrid.innerHTML = "";

  filteredPlaces.forEach(place => {
    const card = document.createElement("article");
    card.className = "place-card";

    card.innerHTML = `
      <div class="place-top">
        <span class="place-icon">${place.icon}</span>
        <span class="crowd-badge crowd-${getCrowdClass(place.crowd)}">
          ${place.crowd} Crowd
        </span>
      </div>

      <h3>${place.name}</h3>
      <p class="place-location">
        ${place.category} · ${place.location}
      </p>

      <div class="place-details">
        <div>
          <small>Estimated wait</small>
          <strong class="wait-time">${place.wait} min</strong>
        </div>
        <div>
          <small>Community reports</small>
          <strong>${place.reports}</strong>
        </div>
      </div>

      <p class="report-info">
        ◷ Last updated ${place.updated}
      </p>
    `;

    placesGrid.appendChild(card);
  });

  document.getElementById("emptyState").hidden =
    filteredPlaces.length !== 0;
}

function updateDashboard() {
  const low = places.filter(p => p.crowd === "Low").length;
  const moderate = places.filter(p => p.crowd === "Moderate").length;
  const high = places.filter(p => p.crowd === "High").length;

  const averageWait = Math.round(
    places.reduce((sum, p) => sum + p.wait, 0) / places.length
  );

  document.getElementById("totalPlaces").textContent =
    String(places.length).padStart(2, "0");

  document.getElementById("lowCount").textContent =
    String(low).padStart(2, "0");

  document.getElementById("moderateCount").textContent =
    String(moderate).padStart(2, "0");

  document.getElementById("highCount").textContent =
    String(high).padStart(2, "0");

  document.getElementById("statPlaces").textContent =
    String(places.length).padStart(2, "0");

  document.getElementById("statReports").textContent =
    totalReports;

  document.getElementById("statAverage").textContent =
    averageWait + " min";
}

function populateReportPlaces() {
  reportPlace.innerHTML = "";

  places.forEach(place => {
    const option = document.createElement("option");
    option.value = place.id;
    option.textContent = place.name;
    reportPlace.appendChild(option);
  });
}

function openModal() {
  populateReportPlaces();
  document.getElementById("formMessage").textContent = "";
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

document.getElementById("openReport")
  .addEventListener("click", openModal);

document.getElementById("heroReport")
  .addEventListener("click", openModal);

document.getElementById("closeReport")
  .addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeModal();
  }
});

searchInput.addEventListener("input", renderPlaces);

categoryFilter.addEventListener("change", renderPlaces);

crowdFilter.addEventListener("change", renderPlaces);

reportForm.addEventListener("submit", event => {
  event.preventDefault();

  const selectedPlace = places.find(
    p => p.id === Number(reportPlace.value)
  );

  const selectedCrowd = reportCrowd.value;
  const selectedWait = Number(reportWait.value);

  if (!selectedPlace || !selectedCrowd) {
    return;
  }

  if (
    !Number.isInteger(selectedWait) ||
    selectedWait < 0 ||
    selectedWait > 300
  ) {
    alert("Enter a waiting time between 0 and 300 minutes.");
    return;
  }

  selectedPlace.crowd = selectedCrowd;
  selectedPlace.wait = selectedWait;
  selectedPlace.reports += 1;
  selectedPlace.updated = "Just now";

  totalReports += 1;

  renderPlaces();
  updateDashboard();

  document.getElementById("formMessage").textContent =
    "Your crowd report was submitted successfully!";

  showToast("Crowd report submitted!");

  reportForm.reset();

  setTimeout(closeModal, 1300);
});

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// Initial dashboard setup
renderPlaces();
updateDashboard();
populateReportPlaces();

