import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Contentful from '../../content/Contentful';
import { getBiblicalHomeVisual } from './homeThemeConfig';

/**
 * Single source of truth for homepage copy and links (biblical/traditional).
 */
const HomeSharedContent: React.FC = () => {
  const v = getBiblicalHomeVisual();

  return (
    <Container sx={v.containerSx}>
      <Paper elevation={0} sx={v.heroPaperSx}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h1" sx={v.heroTitleSx}>
            תלמוד ירושלמי
          </Typography>
          <Typography variant="h1" sx={v.heroTitleSx}>
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
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mt: 2,
            },
          ]}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h2Roboto">מהדורה דיגיטלית</Typography>
            <Typography variant="h2Roboto">עורך: פרופ׳ מנחם כ״ץ</Typography>
            <Typography variant="h2Roboto">עורך משנה: ד״ר הלל גרשוני</Typography>
            <br />
            <Typography variant="h3Roboto">פיתוח אתר: ירון בר</Typography>
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h2Roboto">Digital Critical Edition</Typography>
            <Typography variant="h2Roboto">Editor: Prof. Menachem Katz</Typography>
            <Typography variant="h2Roboto">Co-editor: Dr. Hillel Gershuni</Typography>
            <br />
            <Typography variant="h3Roboto">Site development: Yaron Bar</Typography>
          </Box>
        </Box>

        <Box sx={v.contentBoxSx}>
          <Contentful id="3ok9sYTx6RApf5klH223c4" />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box component={Link} to="/talmud/yevamot/001/001" sx={v.tractatePrimarySx}>
            מסכת יבמות
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Box component={Link} to="/talmud/gittin/001/001" sx={v.tractateSecondarySx}>
            מסכת גיטין
          </Box>
          <Box component={Link} to="/talmud/sota/001/001" sx={v.tractateSecondarySx}>
            מסכת סוטה
          </Box>
          <Box component={Link} to="/talmud/ketubbot/001/001" sx={v.tractateSecondarySx}>
            מסכת כתובות
          </Box>
          <Box
            component="a"
            href="https://schechter.ac.il/book/talmud-yerushalmi-kidushin"
            sx={v.tractateSecondarySx}>
            מסכת קידושין (מודפסת)
          </Box>
        </Box>

        <Box component={Link} to="/introduction" sx={v.introLinkSx}>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mt: 3, gap: 2 }}>
          <Box component="h3" sx={v.footerHeadingSx}>
            תלמוד ירושלמי (ע״ר)
          </Box>
          <Box component="h3" sx={v.footerHeadingSx}>
            Talmud Yerushalmi Hadigitali (R.A.)
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomeSharedContent;
