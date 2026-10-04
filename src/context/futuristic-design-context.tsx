import React from 'react';

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
