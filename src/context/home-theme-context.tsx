import React, { createContext, useCallback, useContext, useMemo } from 'react';
import background from '../assets/leiden2.jpg';
import { useLocalStorage } from '../hooks/useLocalStorage';

/** Homepage concept preview — homepage (`/`) layout only. */
export type HomeThemeId = 'biblical' | 'academic' | 'futuristic';

const STORAGE_KEY = 'home-page-concept';
const DEFAULT_THEME: HomeThemeId = 'biblical';

export const HOME_THEME_OPTIONS: {
  id: HomeThemeId;
  labelHe: string;
  labelEn: string;
}[] = [
  { id: 'biblical', labelHe: 'מקראי / מסורתי', labelEn: 'Biblical / traditional' },
  { id: 'academic', labelHe: 'אקדמי / מחקרי', labelEn: 'Academic / research' },
  { id: 'futuristic', labelHe: 'עתידני / טכנולוגי', labelEn: 'Futuristic / tech' },
];

type HomeThemeContextValue = {
  themeId: HomeThemeId;
  setThemeId: (id: HomeThemeId) => void;
};

const HomeThemeContext = createContext<HomeThemeContextValue | null>(null);

export function HomeThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdRaw] = useLocalStorage<HomeThemeId>(
    STORAGE_KEY,
    DEFAULT_THEME,
  );

  const setThemeId = useCallback(
    (id: HomeThemeId) => {
      setThemeIdRaw(id);
    },
    [setThemeIdRaw],
  );

  const value = useMemo(
    () => ({ themeId, setThemeId }),
    [themeId, setThemeId],
  );

  return (
    <HomeThemeContext.Provider value={value}>{children}</HomeThemeContext.Provider>
  );
}

export function useHomeTheme() {
  const ctx = useContext(HomeThemeContext);
  if (!ctx) {
    throw new Error('useHomeTheme must be used within HomeThemeProvider');
  }
  return ctx;
}

/** Background styles for `App` when pathname is `/`. */
export function getHomePageBackgroundStyle(themeId: HomeThemeId): React.CSSProperties {
  switch (themeId) {
    case 'biblical':
      return {
        backgroundImage: `linear-gradient(rgba(62, 39, 18, 0.55), rgba(28, 18, 8, 0.75)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center -27rem',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      };
    case 'academic':
      return {
        backgroundColor: '#e8e4dc',
        backgroundImage: `
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(180deg, #f5f2eb 0%, #e0dcd2 100%)
        `,
        backgroundSize: '24px 24px, 24px 24px, 100% 100%',
        minHeight: '100vh',
      };
    case 'futuristic':
      return {
        backgroundColor: '#0a0e17',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 212, 255, 0.12), transparent),
          radial-gradient(ellipse 60% 40% at 80% 70%, rgba(124, 58, 237, 0.15), transparent),
          linear-gradient(165deg, #0a0e17 0%, #121a2e 45%, #0d1525 100%)
        `,
        minHeight: '100vh',
      };
    default:
      return { minHeight: '100vh' };
  }
}
