/* src/admin/foundation/z-index.ts */

export const zIndex = {
  base: 1,
  card: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 500,
  modal: 1000,
  toast: 2000,
} as const;

export type ZIndexTokens = typeof zIndex;
