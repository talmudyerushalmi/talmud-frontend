import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import cc from '../assets/cc.png';
import { useBiblicalDesign } from '../context/biblical-design-context';
import { getBiblicalNavChrome } from '../context/biblicalNavChrome';

export const Footer = () => {
  const { navVariant } = useBiblicalDesign();
  const chrome = getBiblicalNavChrome(navVariant);
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
        fontFamily: '"Frank Ruhl Libre", Georgia, serif',
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
