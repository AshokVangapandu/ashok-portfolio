/* src/admin/foundation/colors.ts */

export const colors = {
  primary: '#7C3AED',
  primaryHover: '#6D28D9',
  secondary: '#A78BFA',
  background: '#FFFFFF',
  surface: '#F5F7FF',
  surfaceHover: '#EDEFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E5E7EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
  gradients: {
    primary: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    light: 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FF 100%)',
    surface: 'linear-gradient(135deg, #F5F7FF 0%, #E0E7FF 100%)',
  }
} as const;

export type ThemeColors = typeof colors;
