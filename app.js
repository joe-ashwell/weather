//? To do list
//* - Get users locations deets
//* - Translate location deets to city/region level (need API?)
//* - Fetch weather deets based on users location (create a function to input the location using a template literal (same as ISS project))
//* - Serve weather info to user on page

const weatherArray = [];
const positionObj = {};

const resultState = document.querySelector('h1.weather-result-hero');
const resultCountry = document.querySelector('h2.weather-result-hero');
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
  resultDate.innerHTML = convertTimestampToDate(weatherArray[0].current.dt * 1000);
  currentWeatherDescription.innerHTML = `${weatherArray[0].current.weather[0].description}`;
  currentTemp.innerHTML = `${convertKelvintoDegC(weatherArray[0].current.temp).toFixed(0)}°C`;
  heroSunrise.innerHTML = `${getTime(weatherArray[0].current.sunrise * 1000)}`;
  heroSunset.innerHTML = `${getTime(weatherArray[0].current.sunset * 1000)}`;

}

const displayHourlyWeather = () => {

  const weatherResultHourly = document.querySelector('div.weather-result-hourly');

  for (let index = 1; index < 25; index++) {

    let hourDiv = document.createElement('div')
    hourDiv.setAttribute('class', 'hourly-weather');
    let thatHour = weatherArray[0].hourly[index];
    // let icon;
    
    // if (thatHour.weather[0].description.toLowerCase() === 'overcast clouds') {
    //   icon = 'overcast.png'
    // } else if (thatHour.weather[0].description.toLowerCase() === 'light rain') {
    //   icon = 'rain.png'
    // } else if (thatHour.weather[0].description.toLowerCase() === 'moderate rain') {
    //   icon = 'rain.png'
    // } else if (thatHour.weather[0].description.toLowerCase() === 'broken clouds') {
    //   icon = 'clouds.png'
    // } else if (thatHour.weather[0].description.toLowerCase() === 'thunderstorm with rain') {
    //   icon = 'heavy-storm.png'
    // } 
    

    hourDiv.innerHTML = `
    
      <p>${convertTimestampToShortDate(thatHour.dt * 1000)} ${getTime(thatHour.dt * 1000)}</p>
      <img style="width: 50px;" src="https://openweathermap.org/img/w/${thatHour.weather[0].icon}.png">
      <p>${thatHour.weather[0].description}</p>
      <p>${convertKelvintoDegC(thatHour.temp).toFixed(0)}°C</p>

    `;

    console.log(hourDiv);
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
    
      <p>${convertTimestampToWeekday(thatDay.dt * 1000)}</p>
      <img style="width: 50px;" src="https://openweathermap.org/img/w/${thatDay.weather[0].icon}.png">
      <p>${thatDay.weather[0].description}</p>
      <p>${convertKelvintoDegC(thatDay.temp.day).toFixed(0)}°C</p>
      <p>${convertKelvintoDegC(thatDay.temp.night).toFixed(0)}°C</p>

    `;

    console.log(dailyDiv);
    weatherResultDaily.appendChild(dailyDiv);

  }

}

// Convert the Epoch timestamp to usable/readable date format
function convertTimestampToDate(timestamp) {

  let date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

}

// Convert the Epoch timestamp to usable/readable date format
function convertTimestampToShortDate(timestamp) {

  let date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}`;

}

function convertTimestampToWeekday(timestamp) {

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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