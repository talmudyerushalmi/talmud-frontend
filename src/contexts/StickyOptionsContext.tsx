import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StickyOptionsContextType {
  optionsComponent: ReactNode;
  setOptionsComponent: (component: ReactNode) => void;
}

const StickyOptionsContext = createContext<StickyOptionsContextType | undefined>(undefined);

export const StickyOptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [optionsComponent, setOptionsComponent] = useState<ReactNode>(null);

  return (
    <StickyOptionsContext.Provider
      value={{
        optionsComponent,
        setOptionsComponent,
      }}
    >
      {children}
    </StickyOptionsContext.Provider>
  );
};

export const useStickyOptions = () => {
  const context = useContext(StickyOptionsContext);
  if (context === undefined) {
    throw new Error('useStickyOptions must be used within a StickyOptionsProvider');
  }
  return context;
};
