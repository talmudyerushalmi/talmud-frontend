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

/** Biblical / traditional homepage — sole homepage design. */
export const biblicalHomeVisual: HomeThemeVisual = {
  containerSx: { maxWidth: 720, pt: { xs: 10, md: 14 }, pb: 8 },
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

export function getBiblicalHomeVisual(): HomeThemeVisual {
  return biblicalHomeVisual;
}
