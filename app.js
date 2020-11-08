//? To do list
//* - Get users locations deets
//* - Translate location deets to city/region level (need API?)
//! - Fetch weather deets based on users location (create a function to input the location using a template literal (same as ISS project))
//! - Let user search for a location
//! - Serve weather info to user on page

const endpoint = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=bc23f6fca36dd2062739984568b51cfa";
const weather = [];

const cityEndpoint = 'https://geolocation-db.com/json/';
const positionArray = [];

const resultCity = document.querySelector('h1.weather-result');
const resultCountry = document.querySelector('h2.weather-result');


fetch(endpoint)
  .then(blob => blob.json())
  .then(data => weather.push(data))
  .then(console.log(weather));

fetch(cityEndpoint)
  .then(blob => blob.json())
  .then(data => positionArray.push(data))
  .then(displayLocationResults);

console.log(positionArray);

// Tried passing in the positionArray as an arguement, but that created a console error as when the script is ran initially the array is empty, so everything is undefined.
function displayLocationResults() {
  resultCity.innerHTML = `${positionArray[positionArray.length - 1].city}`;
  resultCountry.innerHTML = `${positionArray[positionArray.length - 1].country_name}`;
}
