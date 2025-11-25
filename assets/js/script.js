const searchBtn = document.querySelector("#searchBtn");
const cityInput = document.querySelector("#cityInput");

const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const weatherText = document.querySelector("#weather");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");

const loading = document.querySelector("#loading");
const weatherInfo = document.querySelector(".weather-info");
const tempImage = document.querySelector("#tempImage");

const themeToggle = document.querySelector("#themeToggle");

// ------------------------------
// SEARCH BUTTON
// ------------------------------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    fetchWeather(city);
});


// ------------------------------
// FETCH WEATHER DATA
// ------------------------------
async function fetchWeather(city) {
    const url = `https://wttr.in/${city}?format=j1`;

    try {
        weatherInfo.style.display = "none";
        loading.style.display = "block";
        loading.textContent = "Loading...";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        showError("City not found. Try again!");
    } finally {
        loading.style.display = "none";
    }
}


// ------------------------------
// DISPLAY WEATHER INFO
// ------------------------------
function displayWeather(data) {
    const current = data.current_condition[0];
    const tempC = Number(current.temp_C);

    cityName.textContent = data.nearest_area[0].areaName[0].value;
    temperature.textContent = `Temperature: ${tempC}°C`;
    weatherText.textContent = `Weather: ${current.weatherDesc[0].value}`;
    humidity.textContent = `Humidity: ${current.humidity}%`;
    wind.textContent = `Wind Speed: ${current.windspeedKmph} km/h`;

    weatherInfo.style.display = "block";

    updateTempIcon(tempC);
}


// ------------------------------
// SHOW ERROR
// ------------------------------
function showError(msg) {
    loading.style.display = "block";
    loading.textContent = msg;
    loading.style.color = "red";

    weatherInfo.style.display = "none";

    setTimeout(() => {
        loading.style.display = "none";
        loading.style.color = "white";
    }, 2000);
}



// ------------------------------
// THEME TOGGLE
// ------------------------------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
        themeToggle.src = "/assets/images/sun.png";
    } else {
        themeToggle.textContent = "🌙";
        themeToggle.src = "/assets/images/moon.png";
    }
});
