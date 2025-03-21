const API_KEY = "iKbRioFV3EYa1DJzIrKhPIDLL7SmPSXmMEierTgK";
const BASE_NASA_URL = "https://api.nasa.gov";

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying (${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

async function fetchNasaData(endpoint, params = {}) {
  const urlParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  const url = `${BASE_NASA_URL}${endpoint}?${urlParams}`;
  return await fetchWithRetry(url);
}

// APOD fetching and displaying
async function loadAPOD() {
  try {
    const data = await fetchNasaData("/planetary/apod");
    displayAPODData(data);
  } catch (error) {
    console.error("Error fetching APOD:", error);
  }
}

function displayAPODData({ title, url, explanation }) {
  const apodContainer = document.getElementById("displayContent");
  apodContainer.innerHTML = `
    <h1>${title}</h1>
    <img src="${url}" alt="${title}">
    <p>${explanation}</p>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and display the APOD when the page loads
  await loadAPOD();

  // Mars Rover photos fetching and displaying
  async function loadMarsPhotos(
    camera = null,
    date = new Date().toISOString().split("T")[0]
  ) {
    try {
      const params = { earth_date: date, page: 1 };
      if (camera) params.camera = camera;

      const { photos } = await fetchNasaData(
        "/mars-photos/api/v1/rovers/curiosity/photos",
        params
      );
      if (photos.length) {
        displayMarsPhotos(photos.slice(0, 3));
      } else {
        console.warn("No photos available, fetching random photos instead.");
        fetchRandomMarsPhotos();
      }
    } catch (error) {
      console.error("Error fetching Mars photos:", error);
    }
  }

  function displayMarsPhotos(photos) {
    const marsContainer = document.getElementById("marsContent");
    marsContainer.innerHTML = photos
      .map(
        (photo) => `
    <img src="${photo.img_src}" alt="Mars Rover Photo by ${photo.rover.name} on ${photo.earth_date}">
  `
      )
      .join("");
  }

  // Fallback logic for random Mars photos
  async function fetchRandomMarsPhotos() {
    const randomDate = getRandomDate();
    console.log(`Fetching random photos for date: ${randomDate}`);
    await loadMarsPhotos(null, randomDate);
  }

  function getRandomDate() {
    const start = new Date(2012, 7, 6).getTime();
    const end = Date.now();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split("T")[0];
  }

  // Add event listener for fetching Mars Rover Photos based on camera
  document
    .getElementById("fetchPhotoButton")
    .addEventListener("click", async () => {
      const camera = document.getElementById("cameraSelect").value;
      await loadMarsPhotos(camera);
    });
});

// Theme toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function applyTheme(theme) {
  body.classList.toggle("light-mode", theme === "light");
  themeToggle.innerHTML =
    theme === "light"
    ? '<i class="fas fa-moon"></i>' 
    : '<i class="fas fa-sun"></i>';
}

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const theme = body.classList.toggle("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", theme);
  applyTheme(theme);
});
