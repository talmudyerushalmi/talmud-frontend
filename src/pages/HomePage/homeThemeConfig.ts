import { Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';

export interface HomeThemeVisual {
  containerSx: SystemStyleObject<Theme>;
  heroPaperSx: SystemStyleObject<Theme>;
  mainPaperSx: SystemStyleObject<Theme>;
  heroTitleSx: SystemStyleObject<Theme>;
  bodyTextSx: SystemStyleObject<Theme>;
  contentBoxSx: SystemStyleObject<Theme>;
  tractatePrimarySx: SystemStyleObject<Theme>;
  tractateSecondarySx: SystemStyleObject<Theme>;
  introLinkSx: SystemStyleObject<Theme>;
  whiteLinkSx: SystemStyleObject<Theme>;
  footerHeadingSx: SystemStyleObject<Theme>;
}

/** Futuristic / tech homepage — sole homepage design. */
export const futuristicHomeVisual: HomeThemeVisual = {
  containerSx: { maxWidth: 960, pt: { xs: 10, md: 12 }, pb: 8 },
  heroPaperSx: {
    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 27, 75, 0.88) 100%)',
    border: '1px solid rgba(0, 212, 255, 0.35)',
    boxShadow: '0 0 40px rgba(0, 212, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
    borderRadius: 3,
    color: '#e2e8f0',
    p: 3,
    mb: 2,
    backdropFilter: 'blur(12px)',
  },
  mainPaperSx: {
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.98) 100%)',
    border: '1px solid rgba(124, 58, 237, 0.35)',
    boxShadow: '0 8px 48px rgba(0, 0, 0, 0.5)',
    borderRadius: 3,
    color: '#cbd5e1',
    p: { xs: 2, md: 4 },
    backdropFilter: 'blur(8px)',
  },
  heroTitleSx: {
    fontFamily: '"Orbitron", "Segoe UI", sans-serif',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  bodyTextSx: {
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
    letterSpacing: '0.01em',
  },
  contentBoxSx: {
    p: 2.5,
    maxWidth: 640,
    mx: 'auto',
    my: 3,
    color: '#e2e8f0',
    bgcolor: 'rgba(15, 23, 42, 0.85)',
    border: '1px solid rgba(34, 211, 238, 0.25)',
    borderRadius: 2,
    maxHeight: '20rem',
    overflow: 'auto',
    boxShadow: 'inset 0 0 24px rgba(0, 212, 255, 0.05)',
  },
  tractatePrimarySx: {
    background: 'linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)',
    color: '#fff',
    display: 'block',
    width: '11rem',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 2,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    fontFamily: '"IBM Plex Sans", sans-serif',
    boxShadow: '0 0 20px rgba(34, 211, 238, 0.35)',
    '&:hover': {
      boxShadow: '0 0 28px rgba(167, 139, 250, 0.5)',
      transform: 'translateY(-1px)',
    },
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  tractateSecondarySx: {
    bgcolor: 'rgba(30, 41, 59, 0.8)',
    color: '#67e8f9',
    display: 'grid',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 2,
    textDecoration: 'none',
    alignItems: 'center',
    border: '1px solid rgba(34, 211, 238, 0.2)',
    fontFamily: '"IBM Plex Sans", sans-serif',
    '&:hover': {
      borderColor: 'rgba(167, 139, 250, 0.5)',
      bgcolor: 'rgba(51, 65, 85, 0.9)',
    },
  },
  introLinkSx: {
    display: 'block',
    width: '10rem',
    mx: 'auto',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#22d3ee',
    textDecoration: 'underline',
    textUnderlineOffset: 4,
    fontWeight: 600,
    '&:hover': { color: '#a78bfa' },
  },
  whiteLinkSx: { color: '#67e8f9', textDecoration: 'underline' },
  footerHeadingSx: {
    fontFamily: '"Orbitron", sans-serif',
    color: '#94a3b8',
    fontSize: '0.85rem',
    letterSpacing: '0.08em',
    m: 0,
  },
};

export function getFuturisticHomeVisual(): HomeThemeVisual {
  return futuristicHomeVisual;
}
