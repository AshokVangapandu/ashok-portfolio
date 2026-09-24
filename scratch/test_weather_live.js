// scratch/test_weather_live.js
const fetch = globalThis.fetch || require('node-fetch');

async function testWeather() {
  console.log('Testing live IP Geolocation and Open-Meteo Weather...');
  try {
    const ipRes = await fetch('https://freeipapi.com/api/json');
    const ipData = await ipRes.json();
    console.log('IP Location:', {
      ip: ipData.ipAddress,
      city: ipData.cityName,
      region: ipData.regionName,
      country: ipData.countryName,
      lat: ipData.latitude,
      lon: ipData.longitude
    });

    const lat = ipData.latitude || 17.3850;
    const lon = ipData.longitude || 78.4867;
    const city = ipData.cityName || 'Hyderabad';

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const wRes = await fetch(weatherUrl);
    const wData = await wRes.json();
    console.log('Current Weather:', {
      city: city,
      temp: wData.current_weather?.temperature,
      code: wData.current_weather?.weathercode
    });
  } catch (err) {
    console.error('Error during weather test:', err);
  }
}

testWeather();
