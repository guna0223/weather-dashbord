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