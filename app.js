const endpoint = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=bc23f6fca36dd2062739984568b51cfa";
const weather = [];

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => weather.push(data))
  .then(console.log(weather));

const positionArray = [];

navigator.geolocation.getCurrentPosition(function(position) {

  let latitude = position.coords.latitude;
  console.log(latitude);
  let longitude = position.coords.longitude;
  console.log(longitude);

  let altitude = position.coords.altitude;
  let accuracy = position.coords.accuracy;
  let altitudeAccuracy = position.coords.altitudeAccuracy;
  let heading = position.coords.height;
  let speed = position.coords.speed;
  let timestamp = position.timestamp;

  positionArray.push(latitude);

});

console.log(positionArray);