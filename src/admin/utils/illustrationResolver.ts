/* src/admin/utils/illustrationResolver.ts */

/**
 * Resolves the appropriate weather SVG illustration file name based on
 * the time of day greeting and the simplified weather condition.
 * 
 * @param greeting The time of day greeting (e.g., "Good Morning", "Morning", "Good Night").
 * @param condition The simplified weather condition (e.g., "Clear", "Partly Cloudy", "Rain").
 * @returns The resolved filename under assets/weather/ (e.g., "morning-clear.svg").
 */
export function resolveIllustration(greeting: string, condition: string): string {
  // 1. Normalize time of day
  const g = greeting.toLowerCase();
  let timeOfDay = 'morning';
  
  if (g.includes('afternoon')) {
    timeOfDay = 'afternoon';
  } else if (g.includes('evening')) {
    timeOfDay = 'evening';
  } else if (g.includes('night')) {
    timeOfDay = 'night';
  }

  // 2. Normalize condition to clear, cloudy, or rain
  const c = condition.toLowerCase();
  let mappedCondition = 'clear';

  if (c.includes('rain') || c.includes('thunderstorm') || c.includes('snow')) {
    mappedCondition = 'rain';
  } else if (c.includes('cloud') || c.includes('fog')) {
    mappedCondition = 'cloudy';
  }

  // 3. Key lookup for available illustrations
  const key = `${timeOfDay}-${mappedCondition}`;
  
  const availableIllustrations: Record<string, string> = {
    'morning-clear': 'morning-clear.svg',
    'morning-cloudy': 'morning-cloudy.svg',
    'morning-rain': 'morning-rain.svg',
    'afternoon-clear': 'afternoon-clear.svg',
    'afternoon-cloudy': 'afternoon-cloudy.svg',
    'evening-clear': 'evening-clear.svg',
    'evening-rain': 'evening-rain.svg',
    'night-clear': 'night-clear.svg',
    'night-rain': 'night-rain.svg'
  };

  if (availableIllustrations[key]) {
    return availableIllustrations[key];
  }

  // 4. Graceful fallbacks for missing cross-combinations
  if (timeOfDay === 'afternoon' && mappedCondition === 'rain') {
    return 'afternoon-cloudy.svg';
  }
  if (timeOfDay === 'evening' && mappedCondition === 'cloudy') {
    return 'evening-clear.svg';
  }
  if (timeOfDay === 'night' && mappedCondition === 'cloudy') {
    return 'night-clear.svg';
  }

  // Global default fallback
  return `${timeOfDay}-clear.svg`;
}
