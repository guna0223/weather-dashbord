// DOM Elements
const searchBtn = document.querySelector("#searchBtn");
const cityInput = document.querySelector("#cityInput");
const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const weatherText = document.querySelector("#weather");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const feelsLike = document.querySelector("#feelsLike");
const loading = document.querySelector("#loading");
const weatherInfo = document.querySelector(".weather-info");
const tempImage = document.querySelector("#tempImage");
const themeToggle = document.querySelector("#themeToggle");
const suggestions = document.querySelector("#suggestions");
const errorContainer = document.querySelector("#errorContainer");
const bgImg = document.querySelector(".bg-img");

// Weather icons mapping
const weatherIcons = {
    sunny: '☀️',
    clear: '☀️',
    cloudy: '☁️',
    overcast: '☁️',
    partly_cloudy: '⛅',
    rain: '🌧️',
    drizzle: '🌦️',
    thunderstorm: '⛈️',
    snow: '❄️',
    fog: '🌫️',
    mist: '🌫️',
    default: '🌡️'
};

// Popular cities for quick access
const popularCities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore', 'Mumbai'];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showSuggestions();
    loadTheme();
});

// ------------------------------
// SEARCH FUNCTIONALITY
// ------------------------------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name!");
        shakeElement(cityInput);
        return;
    }
    fetchWeather(city);
});

// Enter key support
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) {
            showError("Please enter a city name!");
            shakeElement(cityInput);
            return;
        }
        fetchWeather(city);
    }
});

// ------------------------------
// FETCH WEATHER DATA
// ------------------------------
async function fetchWeather(city) {
    const url = `https://wttr.in/${city}?format=j1`;

    try {
        showLoading(true);
        errorContainer.innerHTML = '';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayWeather(data);
        
        // Update background based on weather
        updateBackground(data.current_condition[0].weatherDesc[0].value);
        
    } catch (error) {
        showError(`❌ City "${city}" not found. Please try again!`);
        shakeElement(document.querySelector('.container'));
    } finally {
        showLoading(false);
    }
}

// ------------------------------
// DISPLAY WEATHER INFO
// ------------------------------
function displayWeather(data) {
    const current = data.current_condition[0];
    const area = data.nearest_area[0];
    
    // Update main info with animation
    animateText(cityName, area.areaName[0].value);
    
    const tempC = Number(current.temp_C);
    const tempF = Number(current.temp_F);
    const feelsLikeC = Number(current.FeelsLikeC);
    
    animateText(temperature, `${tempC}°C / ${tempF}°F`);
    animateText(weatherText, current.weatherDesc[0].value);
    animateText(humidity, `${current.humidity}%`);
    animateText(wind, `${current.windspeedKmph} km/h`);
    animateText(feelsLike, `${feelsLikeC}°C`);
    
    // Set weather icon
    const weatherCondition = current.weatherDesc[0].value.toLowerCase();
    tempImage.src = getWeatherIconUrl(weatherCondition);
    tempImage.style.display = 'block';
    
    // Show weather info with animation
    weatherInfo.style.display = 'block';
    weatherInfo.style.animation = 'none';
    weatherInfo.offsetHeight; // Trigger reflow
    weatherInfo.style.animation = 'fadeInUp 0.5s ease-out';
    
    // Hide suggestions after search
    suggestions.innerHTML = '';
}

// ------------------------------
// LOADING STATE
// ------------------------------
function showLoading(isLoading) {
    if (isLoading) {
        loading.style.display = 'block';
        weatherInfo.style.display = 'none';
        errorContainer.innerHTML = '';
    } else {
        loading.style.display = 'none';
    }
}

// ------------------------------
// ERROR HANDLING
// ------------------------------
function showError(message) {
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.animation = 'none';
    errorContainer.offsetHeight;
    errorContainer.style.animation = 'fadeInUp 0.3s ease-out';
}

function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s ease';
}

// ------------------------------
// ANIMATIONS
// ------------------------------
function animateText(element, text) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        element.textContent = text;
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 150);
}

// ------------------------------
// WEATHER ICONS
// ------------------------------
function getWeatherIconUrl(condition) {
    // Use wttr.in's weather icons
    const iconMap = {
        'sunny': 'https://wttr.in/png/sunny.png',
        'clear': 'https://wttr.in/png/sunny.png',
        'cloudy': 'https://wttr.in/png/cloudy.png',
        'overcast': 'https://wttr.in/png/cloudy.png',
        'partly': 'https://wttr.in/png/partly_cloudy.png',
        'rain': 'https://wttr.in/png/rain.png',
        'drizzle': 'https://wttr.in/png/rain.png',
        'thunder': 'https://wttr.in/png/thunder.png',
        'snow': 'https://wttr.in/png/snow.png',
        'fog': 'https://wttr.in/png/fog.png',
        'mist': 'https://wttr.in/png/fog.png'
    };
    
    for (const [key, url] of Object.entries(iconMap)) {
        if (condition.includes(key)) {
            return url;
        }
    }
    
    return 'https://wttr.in/png/sunny.png';
}

// ------------------------------
// THEME TOGGLE
// ------------------------------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
        saveTheme('dark');
    } else {
        themeToggle.textContent = "🌙";
        saveTheme('light');
    }
});

function loadTheme() {
    const savedTheme = localStorage.getItem('weatherTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = "☀️";
    }
}

function saveTheme(theme) {
    localStorage.setItem('weatherTheme', theme);
}

// ------------------------------
// SUGGESTIONS
// ------------------------------
function showSuggestions() {
    suggestions.innerHTML = '';
    popularCities.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = city;
        btn.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        suggestions.appendChild(btn);
    });
}

// ------------------------------
// BACKGROUND UPDATE
// ------------------------------
function updateBackground(weatherCondition) {
    const condition = weatherCondition.toLowerCase();
    
    bgImg.classList.add('zoomed');
    
    setTimeout(() => {
        bgImg.classList.remove('zoomed');
    }, 500);
}

// ------------------------------
// KEYBOARD SHORTCUTS
// ------------------------------
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && document.activeElement !== cityInput) {
        e.preventDefault();
        cityInput.focus();
    }
    
    // Press 'Escape' to blur search
    if (e.key === 'Escape') {
        cityInput.blur();
    }
});

// ------------------------------
// COPY WEATHER INFO
// ------------------------------
weatherInfo.addEventListener('dblclick', () => {
    const temp = temperature.textContent;
    const city = cityName.textContent;
    const condition = weatherText.textContent;
    
    const textToCopy = `Weather in ${city}: ${temp}, ${condition}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Weather info copied!');
    });
});

// ------------------------------
// NOTIFICATION
// ------------------------------
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
