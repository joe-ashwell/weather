//? To do list
//* - Get users locations deets
//* - Translate location deets to city/region level (need API?)
//! - Fetch weather deets based on users location (create a function to input the location using a template literal (same as ISS project))
//! - Let user search for a location
//! - Serve weather info to user on page

let weatherEndpoint;
const weatherArray = [];
const currentWeather = [];
const hourlyWeather = [];
const dailyWeather = [];


const cityEndpoint = 'https://geolocation-db.com/json/';
const positionArray = [];

const resultState = document.querySelector('h1.weather-result-hero');
const resultCountry = document.querySelector('h2.weather-result-hero');
const resultDate = document.querySelector('p.weather-result-hero');

const currentWeatherDescription = document.querySelector('p.middle-hero-weather');
const currentTemp = document.querySelector('p.middle-hero-temp');

// Function to get the endpoint of users location
function getLocationEndpoint() {

  fetch(cityEndpoint)
    .then(blob => blob.json())
    .then(data => positionArray.push(data))
    .then(getLocalWeather)
    .then(displayHero);
  
}

// function to get the weather info based on the users location
function getLocalWeather() {

  weatherEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${positionArray[positionArray.length-1].latitude}&lon=${positionArray[positionArray.length-1].longitude}&exclude=minutely&appid=bc23f6fca36dd2062739984568b51cfa`;

  fetch(weatherEndpoint)
    .then(blob => blob.json())
    .then(data => {
      weatherArray.push(data)
      currentWeather.push(data.current)
      dailyWeather.push(data.daily)
      hourlyWeather.push(data.hourly)
    })
    .then(console.log(weatherArray))
    .then(console.log(currentWeather))
    .then(console.log(dailyWeather))
    .then(console.log(hourlyWeather))
    .then(displayHero);


}

// Tried passing in the positionArray as an arguement, but that created a console error as when the script is ran initially the array is empty, so everything is undefined.
function displayHero() {

  resultState.innerHTML = `${positionArray[positionArray.length - 1].state}`;
  resultCountry.innerHTML = `${positionArray[positionArray.length - 1].country_name}`;
  resultDate.innerHTML = convertTimestampToDate(1604911709101);

  currentWeatherDescription.innerHTML = `${weatherArray[0].current.weather[0].description}`;
  currentTemp.innerHTML = `${convertKelvintoDegC(weatherArray[0].current.temp).toFixed(0)}°C`

}

function convertTimestampToDate(timestamp) {

  let date = new Date(timestamp);
  return `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;

}

function convertKelvintoDegC(kelvin) {

  return -273.15 + kelvin;

}

// Invoke getLocationEndpoint on load
window.addEventListener('load', getLocationEndpoint);