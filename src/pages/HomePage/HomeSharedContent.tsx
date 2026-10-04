import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Contentful from '../../content/Contentful';
import { getFuturisticHomeVisual } from './homeThemeConfig';

/** Homepage copy and links — futuristic / tech styling only. */
const HomeSharedContent: React.FC = () => {
  const v = getFuturisticHomeVisual();

  return (
    <Container sx={v.containerSx}>
      <Paper elevation={0} sx={v.heroPaperSx}>
        <Box
          sx={{
            display: 'flex',
            direction: 'ltr',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            width: '100%',
          }}>
          <Typography variant="h1" sx={[v.heroTitleSx, { direction: 'rtl', textAlign: 'left', flex: 1 }]}>
            תלמוד ירושלמי
          </Typography>
          <Typography variant="h1" sx={[v.heroTitleSx, { textAlign: 'right', flex: 1 }]}>
            Talmud Yerushalmi
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={v.mainPaperSx}>
        <Typography sx={[v.bodyTextSx, { textAlign: 'left' }]}>
          ISF Grant 1717/19, ISF Grant 1295/22
        </Typography>

        <Box
          sx={[
            v.bodyTextSx,
            {
              display: 'flex',
              direction: 'ltr',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              gap: 2,
              mt: 2,
              width: '100%',
            },
          ]}>
          <Box sx={{ direction: 'rtl', textAlign: 'left', flex: 1, minWidth: 0 }}>
            <Typography variant="h2Roboto" sx={{ textAlign: 'left' }}>
              מהדורה דיגיטלית גמישה
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '1.05rem', md: '1.35rem' }, mt: 0.5, textAlign: 'left' },
              ]}>
              עורך: פרופ׳ מנחם כ״ץ
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '0.95rem', md: '1.15rem' }, mt: 0.25, textAlign: 'left' },
              ]}>
              עורך משנה: ד״ר הלל גרשוני
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '0.85rem', md: '0.95rem' }, mt: 0.25, textAlign: 'left' },
              ]}>
              פיתוח אתר: ירון בר ואסף כורם
            </Typography>
          </Box>
          <Box sx={{ direction: 'ltr', textAlign: 'right', flex: 1, minWidth: 0 }}>
            <Typography variant="h2Roboto" sx={{ textAlign: 'right' }}>
              Digital Critical and Flexible Edition
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '1.05rem', md: '1.35rem' }, mt: 0.5, textAlign: 'right' },
              ]}>
              Editor: Prof. Menachem Katz
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '0.95rem', md: '1.15rem' }, mt: 0.25, textAlign: 'right' },
              ]}>
              Co-editor: Dr. Hillel Gershuni
            </Typography>
            <Typography
              sx={[
                v.bodyTextSx,
                { fontSize: { xs: '0.85rem', md: '0.95rem' }, mt: 0.25, textAlign: 'right' },
              ]}>
              Site development: Yaron Bar and Asaf Corem
            </Typography>
          </Box>
        </Box>

        <Box sx={v.contentBoxSx}>
          <Contentful id="3ok9sYTx6RApf5klH223c4" />
        </Box>

        <Box
          sx={{
            display: 'flex',
            direction: 'ltr',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mt: 1,
          }}>
          <Box component={Link} to="/talmud/yevamot/001/001" sx={v.tractatePrimarySx}>
            מסכת יבמות
          </Box>
          <Box component={Link} to="/talmud/gittin/001/001" sx={v.tractatePrimarySx}>
            מסכת גיטין
          </Box>
        </Box>

        <Box
          sx={{
            mt: 4,
            mb: 2,
            mx: 'auto',
            maxWidth: 640,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}>
          <Typography
            sx={[
              v.bodyTextSx,
              v.whiteLinkSx,
              { direction: 'rtl', textDecoration: 'none', lineHeight: 1.6 },
            ]}>
            שאר המסכתות – ממסכת ברכות עד מסכת נידה בשלבי פיתוח
          </Typography>
          <Typography
            sx={[
              v.bodyTextSx,
              v.whiteLinkSx,
              { direction: 'ltr', textDecoration: 'none', lineHeight: 1.6 },
            ]}>
            From Tractate Berakhot to Tractate Niddah — In Development
          </Typography>
        </Box>

        <Box component={Link} to="/introduction" sx={[v.introLinkSx, { mt: 2 }]}>
          מבוא
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            maxWidth: '26rem',
            mx: 'auto',
            mt: 2,
            flexWrap: 'wrap',
            gap: 1,
          }}>
          <Box
            component="a"
            href="https://assets.talmudyerushalmi.com/documents/guide_he.pdf"
            target="_blank"
            rel="noreferrer"
            sx={[v.whiteLinkSx, { display: 'block', textAlign: 'center' }]}>
            מדריך לשימוש במהדורה
          </Box>
          <Box
            component="a"
            href="https://assets.talmudyerushalmi.com/documents/guide_en-US.pdf"
            target="_blank"
            rel="noreferrer"
            sx={[v.whiteLinkSx, { display: 'block', textAlign: 'center' }]}>
            Guide for the Edition
          </Box>
        </Box>

        <Box
          component="a"
          href="https://forms.gle/rYsJ9ZV3vic5Xrcb9"
          target="_blank"
          rel="noreferrer"
          sx={[
            v.whiteLinkSx,
            v.bodyTextSx,
            {
              textAlign: 'center',
              display: 'block',
              mx: 'auto',
              mt: 2,
              maxWidth: 520,
            },
          ]}>
          The edition is being prepared... for updates, ideas and cooperation suggestions click here
        </Box>

        <Typography
          sx={[
            v.whiteLinkSx,
            v.bodyTextSx,
            {
              textAlign: 'center',
              display: 'block',
              mx: 'auto',
              mt: 2,
            },
          ]}>
          To support the edition click{' '}
          <Box component={Link} to="/support" sx={v.whiteLinkSx}>
            here
          </Box>
        </Typography>

        <Box
          sx={{
            display: 'flex',
            direction: 'ltr',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mt: 3,
            gap: 2,
            width: '100%',
          }}>
          <Box component="h3" sx={[v.footerHeadingSx, { direction: 'rtl', textAlign: 'left', flex: 1 }]}>
            תלמוד ירושלמי (ע״ר)
          </Box>
          <Box component="h3" sx={[v.footerHeadingSx, { textAlign: 'right', flex: 1 }]}>
            Talmud Yerushalmi Hadigitali (R.A.)
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomeSharedContent;
