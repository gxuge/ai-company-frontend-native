import colors from './colors';

export const BRAND_GREEN = colors.brand[500];
export const BRAND_GREEN_RGB = '155, 254, 3';
export const BRAND_GREEN_CSS_VAR = 'var(--color-brand-green)';
export const BRAND_GREEN_RGB_CSS_VAR = 'var(--color-brand-green-rgb)';

export function brandGreenRgba(alpha: number | string) {
  return `rgba(${BRAND_GREEN_RGB_CSS_VAR}, ${alpha})`;
}

