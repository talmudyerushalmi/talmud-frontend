import React, { createContext, useCallback, useContext, useMemo } from 'react';
import background from '../assets/leiden2.jpg';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { BiblicalNavVariant } from './biblicalNavChrome';

const NAV_STORAGE_KEY = 'biblical-nav-chrome';

type BiblicalDesignContextValue = {
  navVariant: BiblicalNavVariant;
  setNavVariant: (v: BiblicalNavVariant) => void;
};

const BiblicalDesignContext = createContext<BiblicalDesignContextValue | null>(null);

export function BiblicalDesignProvider({ children }: { children: React.ReactNode }) {
  const [navVariant, setNavVariantRaw] = useLocalStorage<BiblicalNavVariant>(
    NAV_STORAGE_KEY,
    'earth',
  );

  const setNavVariant = useCallback(
    (v: BiblicalNavVariant) => {
      setNavVariantRaw(v);
    },
    [setNavVariantRaw],
  );

  const value = useMemo(
    () => ({ navVariant, setNavVariant }),
    [navVariant, setNavVariant],
  );

  return (
    <BiblicalDesignContext.Provider value={value}>
      {children}
    </BiblicalDesignContext.Provider>
  );
}

export function useBiblicalDesign() {
  const ctx = useContext(BiblicalDesignContext);
  if (!ctx) {
    throw new Error('useBiblicalDesign must be used within BiblicalDesignProvider');
  }
  return ctx;
}

/** Homepage background — biblical/traditional only. */
export function getBiblicalHomePageBackgroundStyle(): React.CSSProperties {
  return {
    backgroundImage: `linear-gradient(rgba(62, 39, 18, 0.55), rgba(28, 18, 8, 0.75)), url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center -27rem',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };
}
