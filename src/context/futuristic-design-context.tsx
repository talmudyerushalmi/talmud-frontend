import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FuturisticNavVariant } from './futuristicNavChrome';

const NAV_STORAGE_KEY = 'futuristic-nav-chrome';

type FuturisticDesignContextValue = {
  navVariant: FuturisticNavVariant;
  setNavVariant: (v: FuturisticNavVariant) => void;
};

const FuturisticDesignContext = createContext<FuturisticDesignContextValue | null>(
  null,
);

export function FuturisticDesignProvider({ children }: { children: React.ReactNode }) {
  const [navVariant, setNavVariantRaw] = useLocalStorage<FuturisticNavVariant>(
    NAV_STORAGE_KEY,
    'cyan',
  );

  const setNavVariant = useCallback(
    (v: FuturisticNavVariant) => {
      setNavVariantRaw(v);
    },
    [setNavVariantRaw],
  );

  const value = useMemo(
    () => ({ navVariant, setNavVariant }),
    [navVariant, setNavVariant],
  );

  return (
    <FuturisticDesignContext.Provider value={value}>
      {children}
    </FuturisticDesignContext.Provider>
  );
}

export function useFuturisticDesign() {
  const ctx = useContext(FuturisticDesignContext);
  if (!ctx) {
    throw new Error('useFuturisticDesign must be used within FuturisticDesignProvider');
  }
  return ctx;
}

/** Homepage background — futuristic only. */
export function getFuturisticHomePageBackgroundStyle(): React.CSSProperties {
  return {
    backgroundColor: '#0a0e17',
    backgroundImage: `
      radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 212, 255, 0.12), transparent),
      radial-gradient(ellipse 60% 40% at 80% 70%, rgba(124, 58, 237, 0.15), transparent),
      linear-gradient(165deg, #0a0e17 0%, #121a2e 45%, #0d1525 100%)
    `,
    minHeight: '100vh',
  };
}
