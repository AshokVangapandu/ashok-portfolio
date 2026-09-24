const fetch = globalThis.fetch || require('node-fetch');

async function testIpProviders() {
  const urls = [
    'https://ipapi.co/json/',
    'https://ipwho.is/',
    'https://freeipapi.com/api/json'
  ];

  for (const url of urls) {
    try {
      const start = Date.now();
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      const data = await res.json();
      console.log(`Success [${Date.now() - start}ms] from ${url}:`, {
        city: data.city || data.cityName,
        region: data.region || data.regionName,
        country: data.country_name || data.countryName || data.country,
        lat: data.latitude || data.lat,
        lon: data.longitude || data.lon
      });
    } catch (err) {
      console.log(`Failed from ${url}:`, err.message);
    }
  }
}

testIpProviders();
