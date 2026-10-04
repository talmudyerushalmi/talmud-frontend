/** Header + footer chrome matching the futuristic / tech homepage. */

export type FuturisticNavVariant = 'cyan' | 'violet' | 'slate' | 'abyss';

/** Production header/footer chrome (cyan / ציאן לילה). */
export const FUTURISTIC_NAV_VARIANT: FuturisticNavVariant = 'cyan';

export interface FuturisticNavChromeStyle {
  barBackground: string;
  accentBorder: string;
  foreground: string;
  linkColor: string;
}

export function getFuturisticNavChrome(
  variant: FuturisticNavVariant,
): FuturisticNavChromeStyle {
  switch (variant) {
    case 'violet':
      return {
        barBackground:
          'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1638 100%)',
        accentBorder: '2px solid rgba(167, 139, 250, 0.45)',
        foreground: '#e2e8f0',
        linkColor: '#c4b5fd',
      };
    case 'slate':
      return {
        barBackground:
          'linear-gradient(180deg, #0f1419 0%, #1a2332 55%, #0d1218 100%)',
        accentBorder: '2px solid rgba(52, 211, 153, 0.35)',
        foreground: '#cbd5e1',
        linkColor: '#6ee7b7',
      };
    case 'abyss':
      return {
        barBackground:
          'linear-gradient(180deg, #0c0c12 0%, #12121a 50%, #08080c 100%)',
        accentBorder: '1px solid rgba(34, 211, 238, 0.22)',
        foreground: '#a8b4c4',
        linkColor: '#67e8f9',
      };
    case 'cyan':
    default:
      return {
        barBackground:
          'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0a0e17 100%)',
        accentBorder: '2px solid rgba(34, 211, 238, 0.4)',
        foreground: '#e2e8f0',
        linkColor: '#67e8f9',
      };
  }
}
