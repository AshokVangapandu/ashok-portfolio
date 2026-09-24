const fetch = globalThis.fetch || require('node-fetch');

async function testHierarchy() {
  console.log('--- Testing Location & Weather Resolution Hierarchy ---');

  // Case 1: Browser Coordinates (Simulating Halasuru, Bengaluru: 12.9784, 77.6200)
  const browserLat = 12.9784;
  const browserLon = 77.6200;

  // Reverse geocode
  const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${browserLat}&longitude=${browserLon}&localityLanguage=en`);
  const geoData = await geoRes.json();
  const city = geoData.city || geoData.locality || 'Bengaluru';
  console.log('1. Browser Geolocation Simulated:');
  console.log('   Coordinates:', { browserLat, browserLon });
  console.log('   Reverse Geocoded City:', city, '| Locality:', geoData.locality, '| State:', geoData.principalSubdivision);

  // Weather lookup for exact coordinates
  const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${browserLat}&longitude=${browserLon}&current_weather=true`);
  const weatherData = await weatherRes.json();
  console.log('   Weather at coordinates:', {
    temperature: Math.round(weatherData.current_weather?.temperature),
    code: weatherData.current_weather?.weathercode
  });

  // Case 2: IP Fallback
  console.log('\n2. IP Geolocation Fallback:');
  const ipRes = await fetch('https://freeipapi.com/api/json');
  const ipData = await ipRes.json();
  console.log('   IP City:', ipData.cityName, '| Lat/Lon:', ipData.latitude, ipData.longitude);
}

testHierarchy();
