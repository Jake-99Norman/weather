const skycons = new Skycons({ color: "black" });
skycons.play();

async function getWeather(city) {
    // const apiKey = "6273b4868f1b471db3d222510240306";

    // const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    const response = await fetch(`./api/weather?city=${city}`);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return response.json();
}

async function showWeather() {
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const weatherData = await getWeather(city);
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById("weatherData").innerHTML =
            "<p>Could not fetch weather data. Please try again.</p>";
        console.error(error);
    }
}

function displayWeather(weatherData) {
    const modal = document.querySelector(".weather-modal");
    modal.classList.remove("hide");
    modal.classList.add("show");

    const weatherDiv = document.getElementById("weatherData");
    const tempC = weatherData.temp;
    const tempF = Math.floor((tempC * 9) / 5 + 32);

    weatherDiv.innerHTML = `
        <h2>Weather in ${weatherData.city}</h2>
        <p>Temperature: ${tempF} °F</p>
        <p>Condition: ${weatherData.description}</p>
    `;

    const icon = getSkycon(weatherData.description);
    skycons.remove("weatherIcon");
    skycons.set("weatherIcon", icon);
}

function getSkycon(conditionText) {
    const condition = conditionText.toLowerCase();

    if (condition.includes("clear") || condition.includes("sunny")) {
        return skycons.CLEAR_DAY;
    }
    if (condition.includes("cloud") || condition.includes("overcast")) {
        return skycons.CLOUDY;
    }
    if (condition.includes("rain")) {
        return skycons.RAIN;
    }
    if (condition.includes("snow")) {
        return skycons.SNOW;
    }
    if (condition.includes("sleet")) {
        return skycons.SLEET;
    }
    if (condition.includes("fog") || condition.includes("mist")) {
        return skycons.FOG;
    }
    if (condition.includes("thunder")) {
        return skycons.THUNDER;
    }

    return skycons.PARTLY_CLOUDY_DAY;
}


