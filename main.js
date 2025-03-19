const API_KEY = "iKbRioFV3EYa1DJzIrKhPIDLL7SmPSXmMEierTgK";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

async function fetchNasaData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayNasaData(data);
  } catch (error) {
    console.error("Error fetching data from NASA API:", error);
  }
}

function displayNasaData(data) {
  const apodContainer = document.getElementById("apod-container");

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
