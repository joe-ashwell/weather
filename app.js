//? To do list
//* - Get users locations deets
//* - Translate location deets to city/region level (need API?)
//* - Fetch weather deets based on users location (create a function to input the location using a template literal (same as ISS project))
//! - Serve weather info to user on page

let weatherEndpoint;
const weatherArray = [];

const resultState = document.querySelector('h1.weather-result-hero');
const resultCountry = document.querySelector('h2.weather-result-hero');
const resultDate = document.querySelector('p.weather-result-hero');

const currentWeatherDescription = document.querySelector('p.middle-hero-weather');
const currentTemp = document.querySelector('p.middle-hero-temp');

const positionObj = {};

const getLocation = () => {

  navigator.geolocation.getCurrentPosition(function(position) {

    positionObj.latitude = position.coords.latitude;
    positionObj.longitude = position.coords.longitude;
    console.log(positionObj);
    //didn't work initially, needed to pass the position object into it to get it to run successfully
    getLocalWeather(positionObj);

  })

};

const getLocalWeather = (location) => {

  weatherEndpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.latitude}&lon=${location.longitude}&exclude=minutely&appid=bc23f6fca36dd2062739984568b51cfa`;

  fetch(weatherEndpoint)
    .then(blob => blob.json())
    .then(data => weatherArray.push(data))
    .then(console.log(weatherArray))
    .then(displayHero);
  
    console.log(location);

}


// Tried passing in the positionArray as an arguement, but that created a console error as when the script is ran initially the array is empty, so everything is undefined.
const displayHero = () => {

  resultState.innerHTML = `${positionObj.latitude}`;
  resultCountry.innerHTML = `${positionObj.longitude}`;
  resultDate.innerHTML = convertTimestampToDate(1604911709101);

  currentWeatherDescription.innerHTML = `${weatherArray[0].current.weather[0].description}`;
  currentTemp.innerHTML = `${convertKelvintoDegC(weatherArray[0].current.temp).toFixed(0)}°C`

}

// Convert the Epoch timestamp to usable/readable date format
function convertTimestampToDate(timestamp) {

  let date = new Date(timestamp);
  return `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;

}

// Convert valuse from kelvin to deg c
function convertKelvintoDegC(kelvin) {

  return -273.15 + kelvin;

}

// Invoke getLocation on load
window.addEventListener('load', getLocation);