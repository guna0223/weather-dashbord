const searchBtn = document.querySelector("#searchBtn");
const cityInput = document.querySelector('#cityInput');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const weather = document.querySelector('#weather');
const humidity = document.querySelector('#humidity');
const wind = document.querySelector('#wind');
const loading = document.querySelector('#loading')
const weatherinfo = document.querySelector('.weather-info');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    console.log(city)
    if (city) {
        fetchWether(city);
    }
});

async function fetchWether(city) {
    const url = `https://wttr.in/${city}?format=j1`

    try {
        loading.style.display = 'block'
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`city not fount`)
        }
        const data = await response.json();
        displayWether(data);
        loading.style.display = 'none';
    } catch (error) { }
}

function displayWether(data) {
    const currentCondition = data.current_condition[0];
    cityName.textContent = data.nearest_area[0].areaName[0].value;
    temperature.textContent = `temperature: ${currentCondition.temp_C} c`;
    weather.textContent = `weather : ${currentCondition.weatherDesc[0].value}`;
    humidity.textContent = `humidity : ${currentCondition.humidity}%`;
    wind.textContent = `Wind speed : ${currentCondition.windspeedKmph} km/h`;
    weatherinfo.style.display = "block"
}

function displayWether(data) {
    const currentCondition = data.current_condition[0];
    const tempC = Number(currentCondition.temp_C);

    cityName.textContent = data.nearest_area[0].areaName[0].value;
    temperature.textContent = `Temperature: ${tempC}°C`;
    weather.textContent = `Weather : ${currentCondition.weatherDesc[0].value}`;
    humidity.textContent = `Humidity : ${currentCondition.humidity}%`;
    wind.textContent = `Wind speed : ${currentCondition.windspeedKmph} km/h`;
    weatherinfo.style.display = "block";

    const tempImage = document.getElementById("tempImage");

    if (tempC > 50) {
        tempImage.style.backgroundColor = "red";
    } else {
        tempImage.style.backgroundColor = "green";
    }
    tempImage.style.display = "block";
}


const themeImg = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeImg.style.backgroundColor= "";
    } else {
        themeImg.style.backgroundImage = "url('/assets/images/sun.png')";
    }
});
