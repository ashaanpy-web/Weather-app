const API_KEY = 'a4d0e35a98be0e3152546c31f2d585e0';
const BASE_URL_WEATHER = 'https://api.openweathermap.org/data/2.5/weather';
const BASE_URL_FORECAST = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Fetches current weather data from OpenWeatherMap API for a given city
 */
async function getWeatherData(city) {
    try {
        const url = `${BASE_URL_WEATHER}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return null;
    }
}

/**
 * Fetches current weather data using latitude and longitude
 */
async function getWeatherByLocation(lat, lon) {
    try {
        const url = `${BASE_URL_WEATHER}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch weather data by location:", error);
        return null;
    }
}

/**
 * Fetches 5-day/3-hour forecast data for a given city
 */
async function getForecastData(city) {
    try {
        const url = `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch forecast data:", error);
        return null;
    }
}

/**
 * Fetches 5-day/3-hour forecast data using latitude and longitude
 */
async function getForecastByLocation(lat, lon) {
    try {
        const url = `${BASE_URL_FORECAST}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch forecast data by location:", error);
        return null;
    }
}

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const temperatureEl = document.querySelector('.glass-text');
const cityNameEl = document.querySelector('.city');
const weatherIconEl = document.getElementById('weather-icon');
const humidityEl = document.getElementById('humidity');
const visibilityEl = document.getElementById('visibility');
const feelsLikeEl = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast-container');
const trendPath = document.getElementById('trend-path');

/**
 * Maps OpenWeatherMap weather conditions to local image paths
 */
function getWeatherIcon(condition) {
    const mainCondition = condition.toLowerCase();
    if (mainCondition === 'clear') return './images/sun.png';
    else if (mainCondition === 'clouds') return './images/cloudy.png';
    else if (mainCondition === 'rain' || mainCondition === 'drizzle' || mainCondition === 'thunderstorm') return './images/cloudy(2).png'; 
    else return './images/weather.png';
}

/**
 * Maps OpenWeatherMap weather conditions to dynamic CSS gradients
 */
function getBackgroundGradient(condition, iconId) {
    const mainCondition = condition.toLowerCase();
    const isNight = iconId.includes('n'); 
    
    if (mainCondition === 'clear') {
        return isNight 
            ? 'linear-gradient(135deg, #141E30 0%, #243B55 100%)' // Night
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'; // Day
    } else if (mainCondition === 'clouds') {
        return 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)';
    } else if (mainCondition === 'rain' || mainCondition === 'drizzle' || mainCondition === 'thunderstorm') {
        return 'linear-gradient(135deg, #373B44 0%, #4286f4 100%)';
    } else if (mainCondition === 'snow') {
        return 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)';
    } else {
        return 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'; // Default
    }
}

/**
 * Updates the Current Weather UI elements
 */
function updateWeatherUI(data) {
    if (!data) return;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°`;
    cityNameEl.textContent = data.name;

    if (data.weather && data.weather.length > 0) {
        const condition = data.weather[0].main;
        const iconId = data.weather[0].icon;
        weatherIconEl.src = getWeatherIcon(condition);
        document.body.style.backgroundImage = getBackgroundGradient(condition, iconId);
    }
    humidityEl.textContent = `${data.main.humidity}%`;
    visibilityEl.textContent = `${(data.visibility / 1000).toFixed(1)}km`;
    feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°`;
}

/**
 * Formats a timestamp into a short time string (e.g., "3 PM")
 */
function formatTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours} ${ampm}`;
}

/**
 * Updates the Hourly Forecast UI cards
 */
function updateForecastUI(data) {
    if (!data || !data.list) return;
    forecastContainer.innerHTML = ''; // Clear old items

    // Take the next 6 items (18 hours)
    const forecastItems = data.list.slice(0, 6);

    forecastItems.forEach(item => {
        const timeString = formatTime(item.dt);
        const condition = item.weather[0].main;
        const temp = Math.round(item.main.temp);
        
        const html = `
            <div class="flex flex-col items-center min-w-[70px] py-3 transition-colors hover:bg-white/20 cursor-pointer rounded-2xl border border-transparent hover:border-white/20">
                <span class="text-xs font-semibold text-white/60">${timeString}</span>
                <img src="${getWeatherIcon(condition)}" class="w-10 h-10 my-2 drop-shadow-md object-contain" />
                <span class="text-xl font-bold text-white/90">${temp}°</span>
            </div>
        `;
        forecastContainer.insertAdjacentHTML('beforeend', html);
    });
}

/**
 * Updates the SVG Temperature Trend Graph
 */
function updateTrendGraph(data) {
    if (!data || !data.list) return;
    const temps = data.list.slice(0, 6).map(item => Math.round(item.main.temp));
    
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1; // Prevent division by zero

    // Map temps to SVG coordinates (ViewBox: 0 0 400 100)
    // We map Y between 20 (top) and 80 (bottom) so it fits beautifully
    const points = temps.map((temp, index) => {
        const x = (index / (temps.length - 1)) * 400;
        const y = 80 - ((temp - minTemp) / range) * 60;
        return {x, y};
    });

    // Create a smooth bezier curve path
    if (points.length > 0) {
        let d = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i - 1].x + points[i].x) / 2;
            const yc = (points[i - 1].y + points[i].y) / 2;
            d += ` Q ${points[i - 1].x},${points[i - 1].y} ${xc},${yc}`;
        }
        d += ` T ${points[points.length - 1].x},${points[points.length - 1].y}`;
        trendPath.setAttribute('d', d);
    }
}

/**
 * Toggles the skeleton loading UI
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        // Replace text with pulsing skeleton divs
        temperatureEl.innerHTML = '<div class="h-24 w-32 bg-white/30 rounded-3xl animate-pulse mx-auto"></div>';
        cityNameEl.innerHTML = '<div class="h-10 w-48 bg-white/30 rounded-xl animate-pulse mx-auto mt-2"></div>';
        humidityEl.innerHTML = '<div class="h-8 w-16 bg-white/30 rounded-lg animate-pulse mx-auto"></div>';
        visibilityEl.innerHTML = '<div class="h-8 w-16 bg-white/30 rounded-lg animate-pulse mx-auto"></div>';
        feelsLikeEl.innerHTML = '<div class="h-8 w-16 bg-white/30 rounded-lg animate-pulse mx-auto"></div>';
        
        // Fade out the weather icon
        weatherIconEl.classList.add('animate-pulse', 'opacity-50', 'grayscale');

        // Inject skeleton forecast cards
        forecastContainer.innerHTML = '';
        for(let i=0; i<6; i++) {
            forecastContainer.insertAdjacentHTML('beforeend', `
                <div class="flex flex-col items-center min-w-[70px] py-3 rounded-2xl bg-white/10 border border-white/20 animate-pulse">
                    <div class="h-4 w-10 bg-white/20 rounded mb-2"></div>
                    <div class="w-10 h-10 bg-white/20 rounded-full my-2"></div>
                    <div class="h-6 w-8 bg-white/20 rounded mt-2"></div>
                </div>
            `);
        }
        
        // Hide the trend path by clearing it
        trendPath.setAttribute('d', '');
    } else {
        // Restore icon opacity
        weatherIconEl.classList.remove('animate-pulse', 'opacity-50', 'grayscale');
    }
}

/**
 * Controller to fetch and update everything for a specific city
 */
async function loadWeatherForCity(city) {
    setLoadingState(true);
    
    const weatherData = await getWeatherData(city);
    if (weatherData) updateWeatherUI(weatherData);

    const forecastData = await getForecastData(city);
    if (forecastData) {
        updateForecastUI(forecastData);
        updateTrendGraph(forecastData);
    }
    
    setLoadingState(false);
}

/**
 * Controller to fetch and update everything by location
 */
async function loadWeatherForLocation(lat, lon) {
    setLoadingState(true);
    
    const weatherData = await getWeatherByLocation(lat, lon);
    if (weatherData) updateWeatherUI(weatherData);

    const forecastData = await getForecastByLocation(lat, lon);
    if (forecastData) {
        updateForecastUI(forecastData);
        updateTrendGraph(forecastData);
    }
    
    setLoadingState(false);
}

// Event Listener for the Search Form
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        await loadWeatherForCity(city);
        cityInput.value = ''; 
    }
});

// Load weather on startup
window.addEventListener('DOMContentLoaded', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                await loadWeatherForLocation(position.coords.latitude, position.coords.longitude);
            },
            async (error) => {
                console.warn("Geolocation denied or failed. Loading default city.", error);
                await loadWeatherForCity('New York');
            }
        );
    } else {
        loadWeatherForCity('New York');
    }
});
