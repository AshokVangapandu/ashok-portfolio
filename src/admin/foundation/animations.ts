/* src/admin/foundation/animations.ts */

export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  transitionAll: 'transition-all',
  transitionLayout: 'transition-layout',
  hoverScale: 'hover-scale',
  activePress: 'active-press',
} as const;

export type AnimationsTokens = typeof animations;
