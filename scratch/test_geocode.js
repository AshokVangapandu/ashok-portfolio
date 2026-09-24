const fetch = globalThis.fetch || require('node-fetch');

async function testHalasuruGeocode() {
  const lat = 12.9784;
  const lon = 77.6200;
  const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(geocodeUrl);
  const data = await res.json();
  console.log('BigDataCloud Halasuru response:', JSON.stringify(data, null, 2));
}

testHalasuruGeocode();
