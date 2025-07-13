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

// Display 5-day forecast
function displayForecast(data) {
  forecastDiv.innerHTML = ""; // Clear previous forecast
  const forecastByDays = data.list.filter((_, index) => index % 8 === 0); // Filter out every 8th item for the 5-day forecast

  // Show the heading once forecast data is loaded
  forecastHeading.style.display = "block";
  forecastDiv.style.display = "grid"; // Ensure forecast grid is displayed

  forecastByDays.forEach((forecast) => {
    const { dt_txt, main, weather, wind } = forecast;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    const card = `
            <div class="forecast-card bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <p class="font-bold">${dt_txt.split(" ")[0]}</p>
                <img src="${iconUrl}" alt="Weather Icon" class="mx-auto w-16 h-16 my-2">
                <div class="space-y-2">
                    <div class="forecast-detail">
                        <p class="font-semibold">Temp:</p>
                        <p>${main.temp}°C</p>
                    </div>
                    <div class="forecast-detail">
                        <p class="font-semibold">Wind:</p>
                        <p>${wind.speed} m/s</p>
                    </div>
                    <div class="forecast-detail">
                        <p class="font-semibold">Humidity:</p>
                        <p>${main.humidity}%</p>
                    </div>
                </div>
            </div>
        `;
    forecastDiv.innerHTML += card;
  });
}

// Fetch weather for a city
async function fetchWeather(city) {
  if (!city) {
    currentWeatherDiv.style.display = "none";
    forecastDiv.style.display = "none";
    errorMessageDiv.style.display = "none";
    forecastMessage.style.display = "block";
    forecastHeading.style.display = "none";
    return;
  }

  currentWeatherDiv.style.display = "none";
  forecastDiv.style.display = "none";
  errorMessageDiv.style.display = "none";
  forecastMessage.style.display = "none";

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  const currentWeatherData = await fetchWeatherData(currentWeatherUrl);
  const forecastData = await fetchWeatherData(forecastUrl);

  if (currentWeatherData && forecastData) {
    displayCurrentWeather(currentWeatherData);
    displayForecast(forecastData);

    currentWeatherDiv.style.display = "block";
    forecastDiv.style.display = "grid";
    forecastHeading.style.display = "block";

    // Only add to recent if data is valid
    addToRecentSearches(city);
  } else {
    forecastDiv.style.display = "none";
    forecastHeading.style.display = "none";
  }
}

// Show error messages
function showError(message, type) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");
  errorMessageDiv.classList.add(type); // Show different styling based on error type
  errorMessageDiv.style.display = "block";
}

// Add Recent Search
function addToRecentSearches(city) {
  recentSearches = recentSearches.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  recentSearches.unshift(city);
  if (recentSearches.length > 10) {
    recentSearches = recentSearches.slice(0, 10);
  }
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  updateRecentSearchDropdown();
}

// Update recent search dropdown
function updateRecentSearchDropdown() {
  recentDropdown.innerHTML = '<option value="">-- Recent Searches --</option>';
  recentSearches.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    recentDropdown.appendChild(option);
  });
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

// Handle recent search selection
recentDropdown.addEventListener("change", (e) => {
  const city = e.target.value;
  if (city) {
    fetchWeather(city);
  }
});

// Initial Update for Recent Searches Dropdown
updateRecentSearchDropdown();
