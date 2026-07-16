/* src/admin/services/greetingService.ts */

export interface GreetingInfo {
  greeting: string;      // e.g., "Good Morning"
  emoji: string;         // e.g., "☀️"
  userName: string;      // e.g., "Ashok"
  message: string;       // e.g., "Perfect day to build something amazing."
  fullGreeting: string;  // e.g., "Good Morning ☀️"
}

const MORNING_MESSAGES = [
  "Perfect day to build something amazing.",
  "Fresh morning. Time to turn ideas into reality.",
  "Every great product starts with today's first commit."
];

const AFTERNOON_MESSAGES = [
  "Keep the momentum going.",
  "Hope your day is going well.",
  "Another opportunity to build something great."
];

const EVENING_MESSAGES = [
  "Great progress today. Let's finish strong.",
  "The day isn't over yet.",
  "Time to wrap up another productive day."
];

const NIGHT_MESSAGES = [
  "Don't forget to push today's commits.",
  "Time to recharge for tomorrow.",
  "Rest well. Tomorrow brings new ideas."
];

/**
 * Gets a random element from an array of strings.
 */
function getRandomMessage(messages: string[]): string {
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

/**
 * Dynamically resolves the user's greeting, first name, and a motivational message
 * based on the browser's current hour.
 * 
 * @param fullName The full name or display name of the authenticated user.
 * @returns GreetingInfo containing the greeting parts and message.
 */
export function getGreetingInfo(fullName?: string | null): GreetingInfo {
  const hour = new Date().getHours();
  
  let greeting = "Good Morning";
  let emoji = "☀️";
  let message = "";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    emoji = "☀️";
    message = getRandomMessage(MORNING_MESSAGES);
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    emoji = "🌤️";
    message = getRandomMessage(AFTERNOON_MESSAGES);
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
    emoji = "🌇";
    message = getRandomMessage(EVENING_MESSAGES);
  } else {
    greeting = "Good Night";
    emoji = "🌙";
    message = getRandomMessage(NIGHT_MESSAGES);
  }

  // Extract the first name or fallback to "Administrator" or "Admin"
  let userName = "Administrator";
  if (fullName && fullName.trim()) {
    const trimmed = fullName.trim();
    // In case the full name is an email, extract the name portion before the @
    if (trimmed.includes("@")) {
      userName = trimmed.split("@")[0];
    } else {
      userName = trimmed.split(/\s+/)[0];
    }
  }

  return {
    greeting,
    emoji,
    userName,
    message,
    fullGreeting: `${greeting} ${emoji}`
  };
}
