import { Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import { HomeThemeId } from '../../context/home-theme-context';

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

const biblical: HomeThemeVisual = {
  containerSx: { maxWidth: 720, pt: { xs: 10, md: 14 }, pb: 6 },
  heroPaperSx: {
    background: 'linear-gradient(135deg, #5c4033 0%, #3d2914 50%, #2a1a0a 100%)',
    border: '2px solid rgba(212, 175, 55, 0.45)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
    borderRadius: 2,
    color: '#f4e4c1',
    p: 2.5,
    mb: 2,
  },
  mainPaperSx: {
    background: 'linear-gradient(180deg, #4a3728 0%, #352618 100%)',
    border: '2px solid rgba(201, 162, 39, 0.35)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
    borderRadius: 2,
    color: '#f0e6d2',
    p: 3,
  },
  heroTitleSx: {
    fontFamily: '"Frank Ruhl Libre", "David Libre", Georgia, serif',
    fontWeight: 700,
    letterSpacing: '0.02em',
    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  bodyTextSx: {
    fontFamily: '"Frank Ruhl Libre", "David Libre", Georgia, serif',
  },
  contentBoxSx: {
    p: 2,
    maxWidth: 600,
    mx: 'auto',
    my: 3,
    color: '#2c1810',
    bgcolor: '#faf6ee',
    border: '1px solid #c9a227',
    borderRadius: 1,
    maxHeight: '20rem',
    overflow: 'auto',
    boxShadow: 'inset 0 0 24px rgba(92, 64, 51, 0.15)',
  },
  tractatePrimarySx: {
    bgcolor: '#faf6ee',
    color: '#5c4033',
    display: 'block',
    width: '10rem',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 1,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1.15rem',
    border: '2px solid #c9a227',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    '&:hover': { bgcolor: '#fff8e7' },
  },
  tractateSecondarySx: {
    bgcolor: 'rgba(250, 246, 238, 0.85)',
    color: '#4a3728',
    display: 'grid',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 1,
    textDecoration: 'none',
    alignItems: 'center',
    border: '1px solid rgba(201, 162, 39, 0.5)',
  },
  introLinkSx: {
    display: 'block',
    width: '10rem',
    mx: 'auto',
    textAlign: 'center',
    fontSize: '1.35rem',
    color: '#f4e4c1',
    textDecoration: 'underline',
    textUnderlineOffset: 4,
  },
  whiteLinkSx: { color: '#f4e4c1', textDecoration: 'underline' },
  footerHeadingSx: {
    fontFamily: '"Frank Ruhl Libre", serif',
    color: '#e8dcc8',
    m: 0,
  },
};

const academic: HomeThemeVisual = {
  containerSx: { maxWidth: 900, pt: { xs: 10, md: 12 }, pb: 8 },
  heroPaperSx: {
    bgcolor: '#fff',
    border: '1px solid #c5c0b6',
    borderLeft: '6px solid #1a4480',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: 0,
    color: '#1a1a1a',
    p: 3,
    mb: 2,
  },
  mainPaperSx: {
    bgcolor: '#fff',
    border: '1px solid #c5c0b6',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    borderRadius: 0,
    color: '#2d2d2d',
    p: { xs: 2, md: 4 },
  },
  heroTitleSx: {
    fontFamily: '"Libre Baskerville", "Times New Roman", serif',
    fontWeight: 400,
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
  bodyTextSx: {
    fontFamily: '"Source Serif 4", "Times New Roman", serif',
    fontSize: '1rem',
    lineHeight: 1.65,
  },
  contentBoxSx: {
    p: 2.5,
    maxWidth: 640,
    mx: 'auto',
    my: 3,
    color: '#1a1a1a',
    bgcolor: '#f8f7f4',
    border: '1px solid #d4d0c8',
    borderRadius: 0,
    maxHeight: '20rem',
    overflow: 'auto',
  },
  tractatePrimarySx: {
    bgcolor: '#1a4480',
    color: '#fff',
    display: 'block',
    width: '11rem',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 0,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    fontFamily: '"Source Serif 4", serif',
    letterSpacing: '0.02em',
    '&:hover': { bgcolor: '#153660' },
  },
  tractateSecondarySx: {
    bgcolor: '#f0eeea',
    color: '#1a4480',
    display: 'grid',
    m: 1,
    textAlign: 'center',
    p: 2,
    borderRadius: 0,
    textDecoration: 'none',
    alignItems: 'center',
    border: '1px solid #c5c0b6',
    fontFamily: '"Source Serif 4", serif',
    '&:hover': { bgcolor: '#e8e6e0' },
  },
  introLinkSx: {
    display: 'block',
    width: '10rem',
    mx: 'auto',
    textAlign: 'center',
    fontSize: '1.15rem',
    color: '#1a4480',
    fontWeight: 600,
    textDecoration: 'none',
    borderBottom: '2px solid #1a4480',
  },
  whiteLinkSx: { color: '#1a4480', textDecoration: 'underline' },
  footerHeadingSx: {
    fontFamily: '"Libre Baskerville", serif',
    color: '#444',
    fontSize: '1rem',
    fontWeight: 400,
    m: 0,
  },
};

const futuristic: HomeThemeVisual = {
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
    textDecoration: 'none',
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

export function getHomeThemeVisual(themeId: HomeThemeId): HomeThemeVisual {
  switch (themeId) {
    case 'academic':
      return academic;
    case 'futuristic':
      return futuristic;
    case 'biblical':
    default:
      return biblical;
  }
}
