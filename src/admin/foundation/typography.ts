/* src/admin/foundation/typography.ts */

export const typography = {
  headingXl: 'text-heading-xl',
  headingLg: 'text-heading-lg',
  headingMd: 'text-heading-md',
  sectionTitle: 'text-section-title',
  cardTitle: 'text-card-title',
  subtitle: 'text-subtitle',
  body: 'text-body',
  caption: 'text-caption',
  label: 'text-label',
  buttonText: 'text-button',
} as const;

export type TypographyTokens = typeof typography;
