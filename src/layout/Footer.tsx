import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import cc from '../assets/cc.png';
import {
  FUTURISTIC_NAV_VARIANT,
  getFuturisticNavChrome,
} from '../context/futuristicNavChrome';

export const Footer = () => {
  const chrome = getFuturisticNavChrome(FUTURISTIC_NAV_VARIANT);
  const year = `2021-${new Date().getFullYear()}`;
  const hebYear = 'תשפ״א - תשפ״ו';
  const fullYear = `${hebYear} ${year}`;

  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        background: chrome.barBackground,
        borderTop: chrome.accentBorder,
        color: chrome.foreground,
        py: 0.5,
        zIndex: (theme) => theme.zIndex.drawer,
        fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
        fontSize: '0.9rem',
      }}>
      <Container>
        <Grid container>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Box
              sx={{
                display: 'inline-flex',
                direction: 'ltr',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 0.75,
                rowGap: 0,
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.78rem', sm: '0.9rem' },
              }}>
              <Box component="span" sx={{ direction: 'rtl' }}>
                מהדורה דיגיטלית גמישה
              </Box>
              <Box component="span" sx={{ opacity: 0.45, userSelect: 'none' }}>
                ·
              </Box>
              <Box component="span">Dynamic Critical Flexible Edition</Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            אתר בהקמה
          </Grid>
          <Grid item xs={12} sm={4} sx={{ position: 'relative', textAlign: 'center' }}>
            {fullYear}
            <Box
              component="img"
              src={cc}
              alt="cc"
              sx={{
                top: '0.15rem',
                pr: '0.3rem',
                height: '1.5rem',
                position: 'absolute',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
