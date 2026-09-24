/* src/admin/services/weatherService.ts */

export interface WeatherData {
  temperature: number;
  condition: string;
  city: string;
  locality?: string | null;
  state?: string | null;
  country?: string | null;
  weatherCode: number;
  locationSource: 'browser' | 'ip' | 'fallback';
  accuracy?: number | null;
  latitude: number;
  longitude: number;
}

const CACHE_KEY = 'portfolio_weather_data_v2';
const CACHE_EXPIRY_KEY = 'portfolio_weather_cache_expiry_v2';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const FALLBACK_LAT = 12.9716;
const FALLBACK_LON = 77.5946;
const FALLBACK_CITY = 'Bengaluru';

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
 * 1. Request precise user coordinates from Browser Geolocation API.
 */
function getBrowserCoordinates(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  source: 'browser';
} | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      console.log('[Weather] navigator.geolocation is not available.');
      resolve(null);
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        console.log('[Weather] Browser Geolocation permission:', status.state);
        if (status.state === 'denied') {
          resolve(null);
          return;
        }
      }).catch(() => {});
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[Weather] Browser Geolocation SUCCEEDED:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: 'browser'
        });
      },
      (error) => {
        console.warn('[Weather] Browser Geolocation unavailable/denied:', error.message);
        resolve(null);
      },
      {
        timeout: 7000,
        enableHighAccuracy: true,
        maximumAge: 5 * 60 * 1000
      }
    );
  });
}

/**
 * 2. Reverse-geocodes coordinates into structured locality, city, state, country.
 */
interface ReverseGeocodeResult {
  locality: string | null;
  city: string;
  state: string | null;
  country: string | null;
  displayName: string;
}

async function reverseGeocodeCoordinates(lat: number, lon: number): Promise<ReverseGeocodeResult> {
  try {
    const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(geocodeUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Geocoding API responded with HTTP ${response.status}`);
    const data = await response.json();

    const country = data.countryName || 'India';
    const state = data.principalSubdivision || 'Karnataka';
    const rawCity = data.city || (data.locality && !data.locality.toLowerCase().includes('district') ? data.locality : 'Bengaluru');

    let locality: string | null = null;
    if (data.locality && data.locality !== rawCity && !data.locality.toLowerCase().includes('district')) {
      locality = data.locality;
    } else if (Array.isArray(data.localityInfo?.administrative)) {
      const neighborhood = data.localityInfo.administrative.find(
        (a: any) => a.adminLevel >= 8 && a.name && a.name !== rawCity
      );
      if (neighborhood?.name) {
        locality = neighborhood.name;
      }
    }

    let displayName = rawCity;
    if (locality && locality !== rawCity && !rawCity.includes(locality)) {
      displayName = `${locality}, ${rawCity}`;
    }

    return {
      locality,
      city: rawCity,
      state,
      country,
      displayName
    };
  } catch (err) {
    console.warn('[Weather] Reverse geocoding failed, using coordinates city fallback:', err);
    return {
      locality: null,
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      displayName: 'Bengaluru'
    };
  }
}

/**
 * 3. Fallback: Attempts IP-based geolocation when browser geolocation is denied or times out.
 */
async function getIPCoordinates(): Promise<{
  latitude: number;
  longitude: number;
  city: string;
  state?: string;
  country?: string;
  source: 'ip';
} | null> {
  console.log('[Weather] Attempting IP-based geolocation fallback...');
  const endpoints = [
    {
      url: 'https://ipwho.is/',
      parse: (d: any) => (d.success !== false && d.latitude && d.longitude ? {
        latitude: d.latitude,
        longitude: d.longitude,
        city: d.city || 'Bengaluru',
        state: d.region,
        country: d.country,
        source: 'ip' as const
      } : null)
    },
    {
      url: 'https://freeipapi.com/api/json',
      parse: (d: any) => (d.latitude && d.longitude ? {
        latitude: d.latitude,
        longitude: d.longitude,
        city: d.cityName || 'Bengaluru',
        state: d.regionName,
        country: d.countryName,
        source: 'ip' as const
      } : null)
    }
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        const parsed = ep.parse(data);
        if (parsed) {
          console.log('[Weather] IP Geolocation resolved:', parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`[Weather] IP endpoint ${ep.url} failed:`, err);
    }
  }
  return null;
}

/**
 * 4. Main Weather Fetcher: Follows strict priority (Browser GPS -> Reverse Geocoding -> IP fallback -> Coordinates Weather API).
 * @param forceRefresh Bypass 15-minute cache
 */
export async function getWeatherData(forceRefresh = false): Promise<WeatherData> {
  // Check local cache validity
  if (!forceRefresh && typeof window !== 'undefined') {
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    const cachedExpiryStr = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cachedDataStr && cachedExpiryStr) {
      const expiry = parseInt(cachedExpiryStr, 10);
      if (expiry > Date.now()) {
        try {
          const cachedData = JSON.parse(cachedDataStr) as WeatherData;
          return cachedData;
        } catch (_) {
          // Invalidate corrupted cache
        }
      }
    }
  }

  // Step 1: Attempt Browser Geolocation
  let lat = FALLBACK_LAT;
  let lon = FALLBACK_LON;
  let resolvedCity = FALLBACK_CITY;
  let resolvedLocality: string | null = null;
  let resolvedState: string | null = null;
  let resolvedCountry: string | null = null;
  let source: 'browser' | 'ip' | 'fallback' = 'fallback';
  let accuracy: number | null = null;

  const browserCoords = await getBrowserCoordinates();

  if (browserCoords) {
    // Priority 1: Browser GPS Coordinates
    lat = browserCoords.latitude;
    lon = browserCoords.longitude;
    source = 'browser';
    accuracy = browserCoords.accuracy;

    // Priority 2: Reverse Geocoding from precise coordinates
    const geocode = await reverseGeocodeCoordinates(lat, lon);
    resolvedCity = geocode.displayName;
    resolvedLocality = geocode.locality;
    resolvedState = geocode.state;
    resolvedCountry = geocode.country;
  } else {
    // Priority 3: IP Geolocation Fallback
    const ipCoords = await getIPCoordinates();
    if (ipCoords) {
      lat = ipCoords.latitude;
      lon = ipCoords.longitude;
      source = 'ip';
      resolvedCity = ipCoords.city;
      resolvedState = ipCoords.state || null;
      resolvedCountry = ipCoords.country || null;
    } else {
      source = 'fallback';
      lat = FALLBACK_LAT;
      lon = FALLBACK_LON;
      resolvedCity = FALLBACK_CITY;
      resolvedState = 'Karnataka';
      resolvedCountry = 'India';
    }
  }

  // Priority 4: Weather lookup directly using exact coordinates
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(6000) });
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo responded with status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    if (!current) {
      throw new Error('Invalid weather response payload');
    }

    const resolved: WeatherData = {
      temperature: Math.round(current.temperature),
      condition: mapWeatherCodeToCondition(current.weathercode),
      city: resolvedCity,
      locality: resolvedLocality,
      state: resolvedState,
      country: resolvedCountry,
      weatherCode: current.weathercode,
      locationSource: source,
      accuracy,
      latitude: lat,
      longitude: lon
    };

    // Cache the resolved location and weather
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(resolved));
        localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION_MS));
      } catch (err) {
        console.warn('[Weather] LocalStorage cache write failed:', err);
      }
    }

    return resolved;
  } catch (err) {
    console.error('[Weather Service] Weather API fetch failed:', err);
    return {
      temperature: 30,
      condition: 'Clear',
      city: resolvedCity,
      weatherCode: 0,
      locationSource: source,
      latitude: lat,
      longitude: lon
    };
  }
}

export default getWeatherData;
