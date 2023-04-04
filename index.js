const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

const API_KEY = process.env.API_KEY;

// Define a route for the root path of the application
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <div id='container'>
          <h1>Weather App</h1>
          <form action='/weather' method='get'>
            <label for='location'>Enter Location:</label>
            <input type='text' name='location' id='location' required>
            <button type='submit'>Get Weather</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Define a route for the weather API
app.get('/weather', (req, res) => {
  const location = req.query.location; // Read the location query parameter from the request
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

  // Make an HTTP GET request to the API using axios
  axios.get(url)
  .then(response => {
    const data = response.data;
    const cityName = data.name;
    const temperature = data.main.temp;
    const minTemp = data.main.temp_min;
    const maxTemp = data.main.temp_max;
    const press = data.main.pressure;
    const humid = data.main.humidity;
    const vis = (data.visibility)/1000;
    const windSpeed = data.wind.speed;
    const windDir = data.wind.deg;
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const message = `<div id="weather-info">
    <h2>Weather in ${cityName}</h2>
    <div class="weather-data">
      <p>Temperature:</p>
      <p>${temperature}&deg;C</p>
    </div>
    <div class="weather-data">
      <p>Minimum Temperature:</p>
      <p>${minTemp}&deg;C</p>
    </div>
    <div class="weather-data">
      <p>Maximum Temperature:</p>
      <p>${maxTemp}&deg;C</p>
    </div>
    <div class="weather-data">
      <p>Pressure:</p>
      <p>${press} hPa</p>
    </div>
    <div class="weather-data">
      <p>Humidity:</p>
      <p>${humid}%</p>
    </div>
    <div class="weather-data">
      <p>Visibility:</p>
      <p>${vis} Km</p>
    </div>
    <div class="weather-data">
      <p>Wind:</p>
      <p>${windSpeed}m/s ${windDir}&deg;</p>
    </div>
    <div class="weather-data">
      <p>Sunset Time:</p>
      <p>${sunsetTime}</p>
    </div>
  </div>`;

    const html = `
      <html>
        <head>
          <title>Weather App</title>
          <style>
          #weather-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-image: linear-gradient(to bottom, #ffcc33, #ff6699);
            border: 1px solid #ddd;
            padding: 10px;
            transition: background 0.5s ease-in-out;
          }
          .weather-data {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 5px;
          }
          h2 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          p {
            font-size: 18px;
            margin-bottom: 5px;
          }
          
          </style>
        </head>
        <body>
          <div id='container'>
            ${message}
          </div>
        </body>
      </html>
    `;

    res.send(html);
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error occurred while fetching weather data');
  });

})
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
