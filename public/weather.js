const skycons = new Skycons({color: "black"})

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
    const modal = document.querySelector(".weather-modal")

    modal.classList.remove("hide")
    modal.classList.add("show")
    
    const weatherDiv = document.getElementById("weatherData");
    const tempCel = weatherData.current.temp_c;
    const convert = Math.floor((tempCel * 9/5) + 32)
    weatherDiv.innerHTML = `
        <h2>Weather in ${weatherData.location.name}</h2>
        <p>Temperature:${convert} °F</p>
        <p>Condition: ${weatherData.current.condition.text}</p>
    `;

    const icon = getSkycon(weatherData.current.condition.text)
    skycons.remove("weatherIcon")
    skycons.set("weatherIcon", icon)
    skycons.play()

    
}

function getSkycon(conditionText) {
    const condition = conditionText.toLowerCase();

    if (condition.includes("clear")) return Skycons.CLEAR_DAY;
    if (condition.includes("sunny")) return Skycons.CLEAR_DAY;
    if (condition.includes("cloud")) return Skycons.CLOUDY;
    if (condition.includes("overcast")) return Skycons.CLOUDY;
    if (condition.includes("rain")) return Skycons.RAIN;
    if (condition.includes("snow")) return Skycons.SNOW;
    if (condition.includes("sleet")) return Skycons.SLEET;
    if (condition.includes("fog") || condition.includes("mist")) return Skycons.FOG;
    if (condition.includes("thunder")) return Skycons.THUNDER;

    return Skycons.PARTLY_CLOUDY_DAY;
}


