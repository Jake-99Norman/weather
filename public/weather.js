async function getWeather(city) {
    const apiKey = "6273b4868f1b471db3d222510240306";
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

async function showWeather() {
    const cityInput = document.getElementById("cityInput").value;
    try {
        const weatherData = await getWeather(cityInput);
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById("weatherData").innerText = 'Could not fetch weather data.';
    }
}

function displayWeather(weatherData) {
    const weatherDiv = document.getElementById("weatherData");
    const tempCel = weatherData.current.temp_c;
    const convert = Math.floor((tempCel * 9/5) + 32)
    weatherDiv.innerHTML = `
        <h2>Weather in ${weatherData.location.name}</h2>
        <p>Temperature:${convert} °F</p>
        <p>Condition: ${weatherData.current.condition.text}</p>
    `;
}