const WeatherApp = class {
    constructor(apiKey, currentWeatherSelector, forecastWeatherSelector, locationNameSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.currentWeatherBlock = document.querySelector(currentWeatherSelector);
        this.forecastWeatherBlock = document.querySelector(forecastWeatherSelector);
        this.locationNameBlock = document.querySelector(locationNameSelector);

        this.backgroundImages = {
            "01d": "url('img/clear_sky.jpg')",
            "01n": "url('img/clear_sky.jpg')",
            "02d": "url('img/few_clouds.jpg')",
            "02n": "url('img/few_clouds.jpg')",
            "03d": "url('img/scattered_clouds.jpg')",
            "03n": "url('img/scattered_clouds.jpg')",
            "04d": "url('img/broken_clouds.jpg')",
            "04n": "url('img/broken_clouds.jpg')",
            "09d": "url('img/shower_rain.jpg')",
            "09n": "url('img/shower_rain.jpg')",
            "10d": "url('img/rain.jpg')",
            "10n": "url('img/rain.jpg')",
            "11d": "url('img/thunderstorm.jpg')",
            "11n": "url('img/thunderstorm.jpg')",
            "13d": "url('img/snow.jpg')",
            "13n": "url('img/snow.jpg')",
            "50d": "url('img/mist.jpg')",
            "50n": "url('img/mist.jpg')"
        };
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.updateBackgroundImage(this.currentWeather.weather[0].icon);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getWeather(query) {
        this.locationNameBlock.innerText = query;
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    updateBackgroundImage(icon) {
        const backgroundImage = this.backgroundImages[icon];
        if (backgroundImage) {
            document.body.style.backgroundImage = backgroundImage;
        }
    }

    drawWeather() {
        this.currentWeatherBlock.innerHTML = '';
        this.forecastWeatherBlock.innerHTML = '';

        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description, true);
            this.currentWeatherBlock.appendChild(weatherBlock);
        }

        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description, false);
                this.forecastWeatherBlock.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description, isCurrent) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = isCurrent ? "weather-block current-weather-block" : "weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-temperature-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("84818068b0d51eafb818c59b298c13a2", "#current-weather-container", "#forecast-weather-container", "#location-name");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});