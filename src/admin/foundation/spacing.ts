/* src/admin/foundation/spacing.ts */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
  layoutSm: '40px',
  layoutMd: '48px',
  layoutLg: '64px',
} as const;

export type SpacingTokens = typeof spacing;
