import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import cc from '../assets/cc.png';
import { useFuturisticDesign } from '../context/futuristic-design-context';
import { getFuturisticNavChrome } from '../context/futuristicNavChrome';

export const Footer = () => {
  const { navVariant } = useFuturisticDesign();
  const chrome = getFuturisticNavChrome(navVariant);
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
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: 'flex',
                direction: 'ltr',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                gap: 1,
                width: '100%',
              }}>
              <Box sx={{ direction: 'rtl', textAlign: 'left', flex: 1 }}>
                מהדורה דיגיטלית גמישה
              </Box>
              <Box sx={{ direction: 'ltr', textAlign: 'right', flex: 1 }}>
                Digital Critical and Flexible Edition
              </Box>
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
