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
        textAlign: 'center',
        zIndex: (theme) => theme.zIndex.drawer,
        fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
        fontSize: '0.9rem',
      }}>
      <Container>
        <Grid container>
          <Grid item sm={4}>
            מהדורה דיגיטלית Digital Critical Edition
          </Grid>
          <Grid item sm={4}>
            אתר בהקמה
          </Grid>
          <Grid item sm={4} sx={{ position: 'relative' }}>
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
