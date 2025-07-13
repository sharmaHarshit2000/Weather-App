# 🌤️ Weather App

A responsive weather dashboard built with HTML, Tailwind CSS, and vanilla JavaScript.  
It allows users to search for current weather and 5-day forecasts by city or current location using the OpenWeatherMap API.

---

## 🚀 Live Demo

🌐 [Click here to view the app](https://apps-weather-forecast.netlify.app/)

---

## 📸 Preview

![Weather App Screenshot](./public/preview.jpg)

---

## ✨ Features

- 🔍 Search weather by city name
- 📍 Get weather using your current location
- 🗓️ View 5-day weather forecast
- 📌 Recently searched cities (stored in localStorage)
- 🧠 Intelligent error messages (invalid city/network issues)
- 📱 Fully responsive UI with Tailwind CSS

---

## ⚙️ Technologies Used

- HTML
- Tailwind CSS
- Vanilla JavaScript (ES6)
- OpenWeatherMap API
- LocalStorage
- Netlify (for deployment)

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sharmaHarshit2000/Weather-App.git
cd Weather-App
```

### 2. Install dependencies

> If you want to use Tailwind CLI for custom builds:

```bash
npm install
```

### 3. Build Tailwind CSS (if needed)

```bash
npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/output.css --watch
```

Or simply use the included `output.css` for development.

---

### 🔐 API Key Setup

This app uses the OpenWeatherMap API.

Set API_KEY path at `src/js/config.js`:

```javascript
// filepath: src/js/config.js
const API_KEY = "your_api_key_here";
```

---

### 🧩 Folder Structure

```
WEATHER-APP/
├── public/
│   ├── _redirects
│   └── favicon.jpg
├── src/
│   ├── css/
│   │   ├── input.css
│   │   └── output.css
│   ├── js/
│   │   ├── config.js
│   │   └── script.js
│   └── style.css
├── index.html
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

- [OpenWeatherMap API](https://openweathermap.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Netlify](https://www.netlify.com/)

Made with ❤️ by Harshit Sharma
