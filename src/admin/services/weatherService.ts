/* src/admin/services/weatherService.ts */

export interface WeatherData {
  temperature: number;
  condition: string;
  city: string;
  weatherCode: number;
}

const CACHE_KEY = 'portfolio_weather_data';
const CACHE_EXPIRY_KEY = 'portfolio_weather_cache_expiry';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const FALLBACK_LAT = 17.3850;
const FALLBACK_LON = 78.4867;
const FALLBACK_CITY = 'Hyderabad';

/**
 * Maps WMO Weather Interpretation Codes (from Open-Meteo) to simplified condition names.
 */
export function mapWeatherCodeToCondition(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82)
  ) {
    return 'Rain';
  }
  if (
    (code >= 71 && code <= 77) ||
    (code >= 85 && code <= 86)
  ) {
    return 'Snow';
  }
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clear';
}

/**
 * Wraps browser Geolocation API in a Promise.
 */
function getBrowserCoordinates(): Promise<{ latitude: number; longitude: number; isFallback: boolean }> {
  return new Promise((resolve) => {
    // Log permission status if available
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        console.log('[Weather Diagnostics] Geolocation permission status:', status.state);
      }).catch((e) => {
        console.warn('[Weather Diagnostics] Permission check failed:', e);
      });
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      console.warn('[Weather Diagnostics] navigator.geolocation is undefined. Using fallback Hyderabad coordinates.');
      resolve({ latitude: FALLBACK_LAT, longitude: FALLBACK_LON, isFallback: true });
      return;
    }

    console.log('[Weather Diagnostics] Requesting navigator.geolocation.getCurrentPosition...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[Weather Diagnostics] Geolocation SUCCEEDED:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isFallback: false,
        });
      },
      (error) => {
        console.warn('[Weather Diagnostics] Geolocation FAILED/DENIED. Using fallback coordinates. Error:', error);
        resolve({ latitude: FALLBACK_LAT, longitude: FALLBACK_LON, isFallback: true });
      },
      { timeout: 6000, enableHighAccuracy: false }
    );
  });
}

/**
 * Reverses coordinates into a human-readable city name using a free, keyless endpoint.
 */
async function fetchCityName(lat: number, lon: number, isFallback: boolean): Promise<string> {
  if (isFallback) {
    console.log('[Weather Diagnostics] isFallback is true, returning fallback city name:', FALLBACK_CITY);
    return FALLBACK_CITY;
  }

  const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  console.log('[Weather Diagnostics] Geocoding API Request URL:', geocodeUrl);
  
  try {
    const response = await fetch(geocodeUrl);
    if (!response.ok) throw new Error('Geocoding API responded with error');
    const data = await response.json();
    console.log('[Weather Diagnostics] Geocoding API Response:', data);
    const resolvedCity = data.city || data.locality || data.principalSubdivision || 'Current Location';
    console.log('[Weather Diagnostics] Geocoding resolved city name:', resolvedCity);
    return resolvedCity;
  } catch (err) {
    console.error('[Weather Service] Failed to reverse-geocode city name:', err);
    return 'Current Location';
  }
}

/**
 * Attempts to retrieve coordinates based on the user's public IP address as a fallback.
 */
async function getIPCoordinates(): Promise<{ latitude: number; longitude: number; city: string } | null> {
  console.log('[Weather Diagnostics] Attempting IP-based geolocation fallback...');
  try {
    const response = await fetch('https://freeipapi.com/api/json');
    if (!response.ok) throw new Error('IP Geolocation API responded with error');
    const data = await response.json();
    console.log('[Weather Diagnostics] IP Geolocation API Response:', data);
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.cityName || 'Current Location',
      };
    }
  } catch (e) {
    console.warn('[Weather Diagnostics] IP Geolocation failed:', e);
  }
  return null;
}

/**
 * Fetches current weather data from Open-Meteo with 15-minute caching.
 * @param forceRefresh Set to true to bypass cache and force a new API fetch.
 */
export async function getWeatherData(forceRefresh = false): Promise<WeatherData> {
  // 1. Check local cache validity
  if (!forceRefresh && typeof window !== 'undefined') {
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    const cachedExpiryStr = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cachedDataStr && cachedExpiryStr) {
      const expiry = parseInt(cachedExpiryStr, 10);
      if (expiry > Date.now()) {
        try {
          const cachedData = JSON.parse(cachedDataStr) as WeatherData;
          console.log('[Weather Service] Returning cached weather:', cachedData);
          return cachedData;
        } catch (e) {
          console.warn('[Weather Service] Failed to parse cached weather, refetching...');
        }
      }
    }
  }

  // 2. Request user location (with fallback to IP geolocation and then Hyderabad)
  let coords = await getBrowserCoordinates();
  let cityName = '';
  let isFallbackUsed = false;

  if (coords.isFallback) {
    // Browser geolocation failed or was denied. Try IP-based lookup.
    const ipCoords = await getIPCoordinates();
    if (ipCoords) {
      coords = {
        latitude: ipCoords.latitude,
        longitude: ipCoords.longitude,
        isFallback: false,
      };
      cityName = ipCoords.city;
      console.log('[Weather Diagnostics] IP-based geolocation resolved coordinates successfully:', coords);
    } else {
      // Both browser and IP geolocation failed, use hardcoded Hyderabad fallback
      coords = {
        latitude: FALLBACK_LAT,
        longitude: FALLBACK_LON,
        isFallback: true,
      };
      cityName = FALLBACK_CITY;
      isFallbackUsed = true;
      console.log('[Weather Diagnostics] Geolocation and IP Geolocation failed. Using Hyderabad fallback.');
    }
  }

  // 3. Resolve city name if it wasn't already fetched by IP API
  if (!cityName) {
    cityName = await fetchCityName(coords.latitude, coords.longitude, coords.isFallback);
  }

  // 4. Fetch weather from Open-Meteo
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
    console.log('[Weather Diagnostics] Open-Meteo API Request URL:', weatherUrl);
    
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo responded with status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    console.log('[Weather Diagnostics] Open-Meteo API Response:', weatherData);
    const current = weatherData.current_weather;

    if (!current) {
      throw new Error('Invalid weather response payload');
    }

    const resolved: WeatherData = {
      temperature: Math.round(current.temperature),
      condition: mapWeatherCodeToCondition(current.weathercode),
      city: cityName,
      weatherCode: current.weathercode,
    };

    console.log('[Weather Diagnostics] Final resolved WeatherData:', resolved);

    // 5. Cache response
    if (typeof window !== 'undefined') {
      try {
        if (!isFallbackUsed) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(resolved));
          localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION_MS));
          console.log('[Weather Service] Cache updated with dynamic weather data.');
        } else {
          // Clear cache on complete fallback to Hyderabad to ensure retry on reload
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_EXPIRY_KEY);
          console.log('[Weather Service] Fallback coordinates used. Clearing weather cache.');
        }
      } catch (err) {
        console.warn('[Weather Service] Failed to manage cache in localStorage:', err);
      }
    }

    return resolved;
  } catch (err) {
    console.error('[Weather Service] API fetch error:', err);
    throw err;
  }
}
