/**
 * Header + footer chrome for the biblical/traditional site look.
 * Three palettes — same “language” as the homepage, different emphasis.
 */

export type BiblicalNavVariant = 'earth' | 'tekhelet' | 'wine';

export const BIBLICAL_NAV_OPTIONS: {
  id: BiblicalNavVariant;
  labelHe: string;
  labelEn: string;
  /** Short rationale shown in code review / docs — not UI. */
  rationale: string;
}[] = [
  {
    id: 'earth',
    labelHe: 'אדמה וקלף',
    labelEn: 'Earth & parchment',
    rationale:
      'Same browns as the homepage panels (#3d2914 → #2a1a0a) plus a thin gold rule — ' +
      'maximum cohesion; feels like one continuous manuscript frame.',
  },
  {
    id: 'tekhelet',
    labelHe: 'תכלת עמוק',
    labelEn: 'Deep tekhelet',
    rationale:
      'Night-sky blue-violet inspired by tekhelet tradition — still sacred/scholarly, ' +
      'not corporate MUI blue; contrasts warmly against parchment content.',
  },
  {
    id: 'wine',
    labelHe: 'יין וחותם',
    labelEn: 'Wine & seal',
    rationale:
      'Burgundy like wax seals on genizah bindings — dignified, slightly “royal”, ' +
      'pairs with gold accents without copying the brown panels literally.',
  },
];

export interface BiblicalNavChromeStyle {
  /** CSS background for AppBar + footer (gradient or solid). */
  barBackground: string;
  /** Bottom edge on header / top edge on footer. */
  accentBorder: string;
  /** Primary text & icons on the bars. */
  foreground: string;
  /** Nav links — slightly softer than pure white. */
  linkColor: string;
}

export function getBiblicalNavChrome(variant: BiblicalNavVariant): BiblicalNavChromeStyle {
  switch (variant) {
    case 'tekhelet':
      return {
        barBackground: 'linear-gradient(180deg, #1a2744 0%, #243552 55%, #1e2d42 100%)',
        accentBorder: '2px solid rgba(201, 162, 39, 0.45)',
        foreground: '#f0ebe0',
        linkColor: '#e8dcc8',
      };
    case 'wine':
      return {
        barBackground: 'linear-gradient(180deg, #4a2528 0%, #3d1f24 50%, #291418 100%)',
        accentBorder: '2px solid rgba(212, 175, 55, 0.4)',
        foreground: '#f4e8dc',
        linkColor: '#ecdcc8',
      };
    case 'earth':
    default:
      return {
        barBackground: 'linear-gradient(180deg, #4a3728 0%, #3d2914 45%, #2a1a0a 100%)',
        accentBorder: '2px solid rgba(201, 162, 39, 0.5)',
        foreground: '#f4e4c1',
        linkColor: '#e8dcc0',
      };
  }
}
