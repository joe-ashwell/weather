//? To do list
//* - Get users locations deets
//* - Translate location deets to city/region level (need API?)
//* - Fetch weather deets based on users location (create a function to input the location using a template literal (same as ISS project))
//* - Serve weather info to user on page

const weatherArray = [];
const positionObj = {};

const resultHero = document.querySelector('div.weather-result-hero');
const resultState = document.querySelector('h1.weather-result-hero');
const resultCountry = document.querySelector('p.weather-result-hero-country');
const resultDate = document.querySelector('p.weather-result-hero');
const currentWeatherDescription = document.querySelector('p.middle-hero-weather');
const currentTemp = document.querySelector('p.middle-hero-temp');
const heroSunrise = document.querySelector('p.right-hero-sunrise');
const heroSunset = document.querySelector('p.right-hero-sunset');

const getLocation = () => {

  navigator.geolocation.getCurrentPosition(function(position) {

    positionObj.latitude = position.coords.latitude;
    positionObj.longitude = position.coords.longitude;

    const reverseGeocodeEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${positionObj.longitude},${positionObj.latitude}.json?access_token=pk.eyJ1Ijoiam9lYXNod2VsbCIsImEiOiJja2gxdzBkN2MwOHdtMnVsc2t5MG1jOGJ2In0.LG1Bdwg4-nRKZ0gOic6BPw`;

    fetch(reverseGeocodeEndpoint)
      .then(blob => blob.json())
      .then(data => positionObj.locationInfo = data.features);

    //didn't work initially, needed to pass the position object into it to get it to run successfully
    getLocalWeather(positionObj);

  })

};

const getLocalWeather = (location) => {

  let weatherEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=minutely&appid=bc23f6fca36dd2062739984568b51cfa`;

  fetch(weatherEndpoint)
    .then(blob => blob.json())
    .then(data => weatherArray.push(data))
    .then(displayHero)
    .then(displayHourlyWeather)
    .then(displayDailyWeather)

}


// Tried passing in the positionArray as an arguement, but that created a console error as when the script is ran initially the array is empty, so everything is undefined.
const displayHero = () => {

  resultState.innerHTML = `${positionObj.locationInfo[4].text}`;
  resultCountry.innerHTML = `${positionObj.locationInfo[6].text}`;
  resultDate.innerHTML = `${getTime(weatherArray[0].current.dt * 1000)} - ${convertTimestampToWeekday(weatherArray[0].current.dt * 1000)}, ${convertTimestampToDate(weatherArray[0].current.dt * 1000)}`;
  currentWeatherDescription.innerHTML = `${weatherArray[0].current.weather[0].description}, feels like ${convertKelvintoDegC(weatherArray[0].current.feels_like).toFixed(0)}°C`;
  currentTemp.innerHTML = `${convertKelvintoDegC(weatherArray[0].current.temp).toFixed(0)}°C`;
  heroSunrise.innerHTML = `${getTime(weatherArray[0].current.sunrise * 1000)}`;
  heroSunset.innerHTML = `${getTime(weatherArray[0].current.sunset * 1000)}`;

  if (weatherArray[0].current.weather[0].main.toLowerCase().includes('thunderstorm')) {
    resultHero.classList.add('thunder-hero');
  } else if (weatherArray[0].current.weather[0].main.toLowerCase().includes('drizzle')) {
    resultHero.classList.add('rain-hero');
  } else if (weatherArray[0].current.weather[0].main.toLowerCase().includes('rain')) {
    resultHero.classList.add('rain-hero');
  } else if (weatherArray[0].current.weather[0].main.toLowerCase().includes('snow')) {
    resultHero.classList.add('snow-hero');
  } else if (weatherArray[0].current.weather[0].main.toLowerCase().includes('clear')) {
    resultHero.classList.add('clear-hero');
  } else if (weatherArray[0].current.weather[0].main.toLowerCase().includes('clouds')) {
    resultHero.classList.add('cloud-hero');
  }

}

const displayHourlyWeather = () => {

  const weatherResultHourly = document.querySelector('div.weather-result-hourly');

  for (let index = 1; index < 25; index++) {

    let hourDiv = document.createElement('div')
    hourDiv.setAttribute('class', 'hourly-weather');
    let thatHour = weatherArray[0].hourly[index];

    if ((new Date(thatHour.dt * 1000).getHours()) > 16 || (new Date(thatHour.dt * 1000).getHours()) < 7) {
      hourDiv.classList.add('night');
    }

    hourDiv.innerHTML = `

    <div class="hourly-header">
      <p class="hourly-time">${getTime(thatHour.dt * 1000)} - ${convertTimestampToShortDate(thatHour.dt * 1000)}</p>
      <img src="https://openweathermap.org/img/w/${thatHour.weather[0].icon}.png">
    </div>


    <div class="hourly-content">
      <p class="weather-current-description">${thatHour.weather[0].description}</p>
      <p class="hourly-temp">${convertKelvintoDegC(thatHour.temp).toFixed(0)}°C</p>
      <p class="hourly-temp-feels">feels like ${convertKelvintoDegC(thatHour.feels_like).toFixed(0)}°C</p>
    </div>
    `;

    weatherResultHourly.appendChild(hourDiv);

  }

}

const displayDailyWeather = () => {

  const weatherResultDaily = document.querySelector('div.weather-result-daily');

  for (let index = 1; index < 8; index++) {

    let dailyDiv = document.createElement('div')
    dailyDiv.setAttribute('class', 'daily-weather');
    let thatDay = weatherArray[0].daily[index];

    dailyDiv.innerHTML = `
    
      <p>${convertTimestampToWeekday(thatDay.dt * 1000)}, ${convertTimestampToDate(thatDay.dt * 1000)}</p>
      <img style="width: 50px;" src="https://openweathermap.org/img/w/${thatDay.weather[0].icon}.png">
      <p>${thatDay.weather[0].description}</p>
      <p>${convertKelvintoDegC(thatDay.temp.day).toFixed(0)}°C</p>
      <p>${convertKelvintoDegC(thatDay.temp.night).toFixed(0)}°C</p>

    `;

    weatherResultDaily.appendChild(dailyDiv);

  }

}

// Convert the Epoch timestamp to usable/readable date format
function convertTimestampToDate(timestamp) {

  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let date = new Date(timestamp);
  return `${date.getDate()} ${monthsOfYear[date.getMonth()]} ${date.getFullYear()}`;

}

// Convert the Epoch timestamp to usable/readable date format
function convertTimestampToShortDate(timestamp) {

  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let date = new Date(timestamp);
  return `${date.getDate()} ${monthsOfYear[date.getMonth()]}`;

}

function convertTimestampToWeekday(timestamp) {

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let date = new Date(timestamp);
  return `${weekdays[date.getDay()]}`;

}

function getTime(timestamp) {

  let time = new Date(timestamp);

  if (time.getHours() < 10) {
    hours = `0${time.getHours()}`;
  } else {
    hours = `${time.getHours()}`;
  }

  if (time.getMinutes() < 10) {
    minutes = `0${time.getMinutes()}`;
  } else {
    minutes = `${time.getMinutes()}`;
  }

  return `${hours}:${minutes}`;

}

// Convert valuse from kelvin to deg c
function convertKelvintoDegC(kelvin) {

  return -273.15 + kelvin;

}

// Invoke getLocation on load
window.addEventListener('load', getLocation);