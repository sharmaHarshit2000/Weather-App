const API_KEY = "c8a71585e1c22754e816ebdf2bc3e364";
const currentWeatherDiv = document.getElementById("current-weather");
const forecastDiv = document.getElementById("forecast");
const forecastMessage = document.getElementById("forecast-message");
const forecastHeading = document.getElementById("forecast-heading");
const errorMessageDiv = document.getElementById("error-message");
const recentDropdown = document.getElementById("recent-dropdown");
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Fetch data from API
async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Invalid city");
    }
    return await response.json();
  } catch (error) {
    if (error.message === "Invalid city") {
      showError(
        "Invalid city. Please check the spelling or try another city.",
        "invalid-city"
      );
    } else {
      showError(
        "Network Error: Unable to reach the server. Please check your internet connection.",
        "network-error"
      );
    }
  }
}

// Display current weather
function displayCurrentWeather(data) {
  const { name, dt, main, weather, wind } = data;
  const date = new Date(dt * 1000).toLocaleDateString();
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  document.getElementById("weather-city").textContent = `${name}`;
  document.getElementById("weather-date").textContent = `(${date})`;
  document.getElementById("weather-temp").textContent = `Temp: ${main.temp}°C`;
  document.getElementById(
    "weather-wind"
  ).textContent = `Wind: ${wind.speed} m/s`;
  document.getElementById(
    "weather-humidity"
  ).textContent = `Humidity: ${main.humidity}%`;
  document.getElementById("weather-icon").src = iconUrl;
}

// Fetch weather for a city
async function fetchWeather(city) {
  if (!city) {
    // Clear previous weather data and show the default message when input is empty
    currentWeatherDiv.style.display = "none";
    forecastDiv.style.display = "none";
    errorMessageDiv.style.display = "none";
    forecastMessage.style.display = "block"; // Show the default message
    forecastHeading.style.display = "none"; // Hide forecast heading
    return;
  }

  // Clear previous weather data and error messages
  currentWeatherDiv.style.display = "none";
  forecastDiv.style.display = "none";
  errorMessageDiv.style.display = "none";
  forecastMessage.style.display = "none"; // Hide the default message on error

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  const currentWeatherData = await fetchWeatherData(currentWeatherUrl);
  if (currentWeatherData) {
    displayCurrentWeather(currentWeatherData);
    currentWeatherDiv.style.display = "block"; // Show current weather section
  }
}

// Show error messages
function showError(message, type) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");
  errorMessageDiv.classList.add(type); // Show different styling based on error type
  errorMessageDiv.style.display = "block";
}

// Event Listeners
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    // If the user enters an empty city name
    currentWeatherDiv.style.display = "none";
    forecastDiv.style.display = "none";
    errorMessageDiv.style.display = "none";
    forecastMessage.style.display = "block";
    forecastHeading.style.display = "none"; // Hide forecast heading when input is empty
  }
});

document
  .getElementById("current-location-btn")
  .addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        fetchWeatherData(url).then((data) => {
          if (data) {
            const city = data.name;
            fetchWeather(city);
          }
        });
      });
    }
  });
