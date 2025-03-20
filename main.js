const API_KEY = "iKbRioFV3EYa1DJzIrKhPIDLL7SmPSXmMEierTgK";
const APOD_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
const MARS_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${API_KEY}`;

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying... (${i + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

async function fetchNasaData() {
  try {
    const data = await fetchWithRetry(APOD_API_URL);
    displayAPODData(data);
  } catch (error) {
    console.error("Error fetching data from NASA API:", error);
  }
}

function displayAPODData(data) {
  const apodContainer = document.querySelector("#displayContent");

  const title = document.createElement("h1");
  title.textContent = data.title;

  const image = document.createElement("img");
  image.src = data.url;
  image.alt = data.title;

  const description = document.createElement("p");
  description.textContent = data.explanation;

  apodContainer.appendChild(title);
  apodContainer.appendChild(image);
  apodContainer.appendChild(description);
}

async function fetchMarsData(camera) {
  try {
    const today = new Date().toISOString().split("T")[0];
    let url = `${MARS_API_URL}&earth_date=${today}`;
    if (camera) {
      url += `&camera=${camera}`;   
    }
    const data = await fetchWithRetry(url);
    displayMarsData(data.photos, fetchRandomPhotos);
  } catch (error) {
    console.error("Error fetching data from NASA API:", error);
  }
}

function displayMarsData(photos, fetchRandomPhotos) {
  const marsContainer = document.querySelector("#marsContent");
  marsContainer.innerHTML = ""; // Clear previous content

  if (photos.length === 0) {
    const noPhotosMessage = document.createElement("p");
    noPhotosMessage.textContent = "No photos available for this date.";
    marsContainer.appendChild(noPhotosMessage);

    // Fetch random photos if no photos available for the selected date
    fetchRandomPhotos();
    return;
  }

  photos.slice(0, 3).forEach((photo) => {
    const img = document.createElement("img");
    img.src = photo.img_src;
    img.alt = `Mars Rover Photo taken by ${photo.rover.name} on ${photo.earth_date}`;
    marsContainer.appendChild(img);
  });
}

// Example usage of displayMarsData with a fallback function
function fetchRandomPhotos() {
  // Logic to fetch photos from random dates
  const randomDate = getRandomDate();
  console.log(`Fetching random photos for date: ${randomDate}`);
  fetchMarsPhotos(randomDate).then((randomPhotos) => {
    displayMarsData(randomPhotos, fetchRandomPhotos);
  });
}

function getRandomDate() {
  const start = new Date(2012, 7, 6); // Curiosity rover landing date
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function fetchMarsPhotos(date) {
  const apiKey = 'DEMO_KEY'; // Replace with your NASA API key
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${apiKey}`;
  console.log(`Fetching Mars photos for date: ${date}`);
  return fetch(url)
    .then(response => response.json())
    .then(data => data.photos);
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display the APOD when the page loads
  fetchNasaData();

  // Add event listener for fetching Mars Rover Photos based on camera
  document.getElementById("fetchPhotoButton").addEventListener("click", () => {
    const camera = document.getElementById("cameraSelect").value;
    fetchMarsData(camera);
  });
});

document.querySelector("#fetchPhotoButton").addEventListener("click", () => {
  console.log("Fetch Photo Button clicked");
  fetchMarsPhotosForSelectedDate();
});

function fetchMarsPhotosForSelectedDate() {
  const selectedDate = document.querySelector("#dateInput").value;
  console.log(`Fetching Mars photos for selected date: ${selectedDate}`);
  fetchMarsPhotos(selectedDate).then((photos) => {
    displayMarsData(photos, fetchRandomPhotos);
  });
}
