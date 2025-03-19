const API_KEY = "iKbRioFV3EYa1DJzIrKhPIDLL7SmPSXmMEierTgK";
const APOD_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
const MARS_API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${API_KEY}`;

async function fetchNasaData() {
  try {
    const response = await fetch(APOD_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
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

async function fetchMarsData(date, camera) {
  try {
    let url = `${MARS_API_URL}&earth_date=${date}`;
    if (camera) {
      url += `&camera=${camera}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayMarsData(data.photos);
  } catch (error) {
    console.error("Error fetching data from NASA API:", error);
  }
}

function displayMarsData(photos) {
  const marsContainer = document.querySelector("#marsContent");
  marsContainer.innerHTML = ""; // Clear previous content

  if (photos.length === 0) {
    const noPhotosMessage = document.createElement("p");
    noPhotosMessage.textContent = "No photos available for this date.";
    marsContainer.appendChild(noPhotosMessage);
    return;
  }

  const photo = photos[0]; // Display only the first photo
  const img = document.createElement("img");
  img.src = photo.img_src;
  img.alt = `Mars Rover Photo taken by ${photo.rover.name} on ${photo.earth_date}`;
  marsContainer.appendChild(img);
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display the APOD when the page loads
  fetchNasaData();

  // Add event listener for fetching Mars Rover Photos based on date and camera
  document.getElementById("fetchPhotoButton").addEventListener("click", () => {
    const date = document.getElementById("dateInput").value;
    const camera = document.getElementById("cameraSelect").value;
    if (date) {
      fetchMarsData(date, camera);
    } else {
      alert("Please select a date.");
    }
  });
});
