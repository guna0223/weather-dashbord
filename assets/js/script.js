


// ========================
// DOM ELEMENT SELECTIONS
// ========================
// These elements correspond to the new HTML structure

// Search elements
const searchBtn = document.querySelector("#searchBtn");
const cityInput = document.querySelector("#cityInput");

// Weather display elements
const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const weatherText = document.querySelector("#weather");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const feelsLike = document.querySelector("#feelsLike");
const visibilityEl = document.querySelector("#visibility");
const pressureEl = document.querySelector("#pressure");
const uvIndexEl = document.querySelector("#uvIndex");
const tempImage = document.querySelector("#tempImage");

// UI container elements
const loading = document.querySelector("#loading");
const weatherInfo = document.querySelector("#weatherInfo");
const suggestions = document.querySelector("#suggestions");
const errorContainer = document.querySelector("#errorContainer");
const notification = document.querySelector("#notification");

// Theme toggle
const themeToggle = document.querySelector("#themeToggle");

// Copy button (NEW - added for new UI)
const copyWeatherBtn = document.querySelector("#copyWeatherBtn");


// ========================
// WEATHER ICONS CONFIG
// ========================
// Maps weather conditions to Font Awesome icons
const weatherIcons = {
    sunny: 'fa-sun',
    clear: 'fa-sun',
    cloudy: 'fa-cloud',
    overcast: 'fa-cloud',
    partly: 'fa-cloud-sun',
    rain: 'fa-cloud-rain',
    drizzle: 'fa-cloud-showers-heavy',
    thunderstorm: 'fa-bolt',
    snow: 'fa-snowflake',
    fog: 'fa-smog',
    mist: 'fa-smog',
    default: 'fa-temperature-high'
};


// ========================
// POPULAR CITIES LIST
// ========================
// Quick access cities displayed in the UI
const popularCities = [
    'New York', 
    'London', 
    'Tokyo', 
    'Paris', 
    'Sydney', 
    'Dubai', 
    'Singapore', 
    'Mumbai'
];


// ========================
// INITIALIZATION
// ========================
// Runs when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show popular city suggestions
    renderSuggestions();
    
    // Load saved theme preference
    loadTheme();
});


// ========================
// SEARCH FUNCTIONALITY
// ========================
// Handle search button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError("Please enter a city name!");
        shakeElement(cityInput);
        return;
    }
    
    fetchWeather(city);
});


// Handle Enter key in search input
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


// ========================
// WEATHER DATA FETCHING
// ========================
// Fetches weather data from wttr.in API
async function fetchWeather(city) {
    // Using wttr.in weather API - free, no API key required
    const url = `https://wttr.in/${city}?format=j1`;

    try {
        // Show loading state
        showLoading(true);
        
        // Clear any previous errors
        errorContainer.innerHTML = '';
        
        // Fetch weather data from API
        const response = await fetch(url);
        
        // Check if city was found
        if (!response.ok) {
            throw new Error("City not found");
        }

        // Parse JSON response
        const data = await response.json();
        
        // Display weather information
        displayWeather(data);
        
    } catch (error) {
        // Show error message to user
        showError(`❌ City "${city}" not found. Please try again!`);
        
        // Shake the container for visual feedback
        shakeElement(document.querySelector('.container'));
        
    } finally {
        // Hide loading indicator
        showLoading(false);
    }
}


// ========================
// WEATHER DISPLAY
// ========================
// Updates the UI with weather data
function displayWeather(data) {
    // Extract current conditions from API response
    const current = data.current_condition[0];
    const area = data.nearest_area[0];
    
    // Update city name with animation
    animateText(cityName, area.areaName[0].value);
    
    // Parse temperature values
    const tempC = Number(current.temp_C);
    const tempF = Number(current.temp_F);
    const feelsLikeC = Number(current.FeelsLikeC);
    
    // Update temperature display
    animateText(temperature, `${tempC}°C`);
    
    // Update temperature unit with Fahrenheit
    const tempUnit = document.querySelector('.temp-unit');
    if (tempUnit) {
        tempUnit.textContent = `/ ${tempF}°F`;
    }
    
    // Update weather condition description
    const weatherDesc = current.weatherDesc[0].value;
    animateText(weatherText, weatherDesc);
    
    // Update detail cards
    animateText(humidity, `${current.humidity}%`);
    animateText(wind, `${current.windspeedKmph} km/h`);
    animateText(feelsLike, `${feelsLikeC}°C`);
    
    // Update visibility (NEW)
    if (visibilityEl) {
        const visibility = Number(current.visibility) / 10; // Convert to km
        animateText(visibilityEl, `${visibility.toFixed(1)} km`);
    }
    
    // Update pressure (NEW)
    if (pressureEl) {
        animateText(pressureEl, `${current.pressure} hPa`);
    }
    
    // Update UV index (placeholder - API doesn't provide this)
    if (uvIndexEl) {
        // Using a calculated value based on cloud cover as approximation
        const cloudCover = Number(current.cloudcover);
        const uvIndex = cloudCover > 50 ? 'Low' : (cloudCover > 20 ? 'Moderate' : 'High');
        animateText(uvIndexEl, uvIndex);
    }
    
    // Set weather icon based on condition
    const weatherCondition = weatherDesc.toLowerCase();
    tempImage.src = getWeatherIconUrl(weatherCondition);
    tempImage.style.display = 'block';
    
    // Add error handler for icon loading
    tempImage.onerror = function() {
        // Fallback to a simple emoji if image fails
        this.style.display = 'none';
        // Create a fallback emoji element
        const fallback = document.createElement('div');
        fallback.className = 'weather-icon-fallback';
        fallback.style.cssText = 'font-size: 60px; margin: 10px auto;';
        fallback.textContent = getWeatherEmoji(weatherCondition);
        tempImage.parentElement.appendChild(fallback);
    };
    
    // Show weather info section with animation
    weatherInfo.classList.add('active');
    weatherInfo.style.animation = 'none';
    weatherInfo.offsetHeight; // Trigger reflow to restart animation
    weatherInfo.style.animation = 'fadeInUp 0.5s ease-out';
    
    // Clear suggestions after successful search
    suggestions.innerHTML = '';
    
    // Re-render suggestions (hide quick cities after search)
    renderSuggestions();
}


// ========================
// LOADING STATE MANAGEMENT
// ========================
// Shows or hides the loading indicator
function showLoading(isLoading) {
    if (isLoading) {
        loading.classList.add('active');
        weatherInfo.classList.remove('active');
        errorContainer.innerHTML = '';
    } else {
        loading.classList.remove('active');
    }
}


// ========================
// ERROR HANDLING
// ========================
// Displays error message to user
function showError(message) {
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.animation = 'none';
    errorContainer.offsetHeight;
    errorContainer.style.animation = 'fadeInUp 0.3s ease-out';
}


// ========================
// ANIMATION FUNCTIONS
// ========================
// Adds text update animation
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


// Shakes an element for visual feedback
function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.5s ease';
}


// ========================
// WEATHER ICONS
// ========================
// Returns appropriate weather icon URL based on condition
function getWeatherIconUrl(condition) {
    // Icon mapping for wttr.in PNG icons
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
    
    // Find matching icon based on condition keywords
    for (const [key, url] of Object.entries(iconMap)) {
        if (condition.includes(key)) {
            return url;
        }
    }
    
    // Default to sunny if no match
    return 'https://wttr.in/png/sunny.png';
}

// Fallback emoji icons for when images fail to load
function getWeatherEmoji(condition) {
    if (condition.includes('sunny') || condition.includes('clear')) return '☀️';
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('partly')) return '⛅';
    if (condition.includes('rain') || condition.includes('drizzle')) return '🌧️';
    if (condition.includes('thunder') || condition.includes('storm')) return '⛈️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('fog') || condition.includes('mist')) return '🌫️';
    return '🌡️';


// ========================
// THEME TOGGLE FUNCTIONALITY
// ========================
// Toggle between light and dark themes
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    
    if (document.body.classList.contains("dark")) {
        // Switch to sun icon for dark mode
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        saveTheme('dark');
    } else {
        // Switch to moon icon for light mode
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        saveTheme('light');
    }
});


// Load saved theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('weatherTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}


// Save theme preference to localStorage
function saveTheme(theme) {
    localStorage.setItem('weatherTheme', theme);
}


// ========================
// CITY SUGGESTIONS
// ========================
// Render popular city quick-access buttons
function renderSuggestions() {
    suggestions.innerHTML = '<span class="quick-label">Popular:</span>';
    
    popularCities.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = city;
        
        // Add click handler for quick city selection
        btn.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
        });
        
        suggestions.appendChild(btn);
    });
}


// ========================
// KEYBOARD SHORTCUTS
// ========================
// Global keyboard event listener
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search input
    if (e.key === '/' && document.activeElement !== cityInput) {
        e.preventDefault();
        cityInput.focus();
    }
    
    // Press 'Escape' to blur search input
    if (e.key === 'Escape') {
        cityInput.blur();
    }
});


// ========================
// COPY WEATHER INFO
// ========================
// Copy weather information to clipboard
// NEW: Added dedicated button instead of double-click
if (copyWeatherBtn) {
    copyWeatherBtn.addEventListener('click', () => {
        const temp = temperature.textContent;
        const unit = document.querySelector('.temp-unit')?.textContent || '';
        const city = cityName.textContent;
        const condition = weatherText.textContent;
        const humid = humidity.textContent;
        const windSpeed = wind.textContent;
        
        const textToCopy = `Weather in ${city}: ${temp}${unit}, ${condition}\nHumidity: ${humid}\nWind: ${windSpeed}`;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('📋 Weather info copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showNotification('❌ Failed to copy weather info');
        });
    });
}


// Double-click on weather info still works for copying
weatherInfo.addEventListener('dblclick', () => {
    const temp = temperature.textContent;
    const city = cityName.textContent;
    const condition = weatherText.textContent;
    
    const textToCopy = `Weather in ${city}: ${temp}, ${condition}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Weather info copied!');
    });
});


// ========================
// NOTIFICATION SYSTEM
// ========================
// Show toast notification (NEW - improved notification)
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 2.5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}
