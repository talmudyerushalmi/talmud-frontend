import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Container, Paper, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import Contentful from '../content/Contentful';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  panel: {
    '&.MuiPaper-root': {
      backgroundColor: '#3f51b5',
      boxShadow: '#00000099 0 0 13px 5px',
      color: 'white',
      padding: '1rem',
      marginBottom: '1rem',
    },
  },
}));

const HomePage = (props) => {
  const classes = useStyles();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: '/', title: 'Homepage' });
  }, []);

  return (
    <>
      <Container
        style={{
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        }}>
        <Paper className={classes.panel} style={{ marginTop: '12rem' }}>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h1">תלמוד ירושלמי</Typography>
            <Typography variant="h1">Talmud Yerushalmi</Typography>
          </Box>
        </Paper>
        <Paper className={classes.panel}>
          <Typography style={{ textAlign: 'left' }}>ISF Grant 1717/19, ISF Grant 1295/22</Typography>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'right' }}>
              <Typography variant="h2Roboto">מהדורה דיגיטלית</Typography>
              <Typography variant="h2Roboto">עורך: פרופ׳ מנחם כ״ץ</Typography>
              <Typography variant="h2Roboto">עורך משנה: ד״ר הלל גרשוני</Typography>
              <br />
              <Typography variant="h3Roboto">פיתוח אתר: ירון בר</Typography>
            </div>
            <div style={{ textAlign: 'left' }}>
              <Typography variant="h2Roboto">Digital Critical Edition</Typography>
              <Typography variant="h2Roboto">Editor: Prof. Menachem Katz</Typography>
              <Typography variant="h2Roboto">Co-editor: Dr. Hillel Gershuni</Typography>
              <br />
              <Typography variant="h3Roboto">Site development: Yaron Bar</Typography>
            </div>
          </Box>
          <Box
            style={{
              padding: '1rem',
              maxWidth: '600px',
              margin: '2rem auto',
              color: 'black',
              boxShadow: '0px 0px 40px black',
              background: 'white',
              maxHeight: '20rem',
              overflow: 'scroll',
            }}>
            <Contentful id="3ok9sYTx6RApf5klH223c4"></Contentful>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/talmud/yevamot/001/001"
              style={{
                background: 'white',
                display: 'block',
                width: '10rem',
                margin: '1rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
                boxShadow: '0px 2px 23px black',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}>
              מסכת יבמות
            </Link>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/talmud/gittin/001/001"
              style={{
                background: '#c9c9c9',
                display: 'grid',
                margin: '1rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
                alignItems: 'center',
              }}>
              מסכת גיטין
            </Link>
            <Link
              to="/talmud/sota/001/001"
              style={{
                background: '#c9c9c9',
                display: 'grid',
                margin: '1rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
                alignItems: 'center',
              }}>
              מסכת סוטה
            </Link>
            <Link
              to="/talmud/ketubbot/001/001"
              style={{
                background: '#c9c9c9',
                display: 'grid',
                margin: '1rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
                alignItems: 'center',
              }}>
              מסכת כתובות
            </Link>
            <Link
              to="/talmud/qiddushin/001/001"
              style={{
                background: '#c9c9c9',
                display: 'grid',
                margin: '1rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
                alignItems: 'center',
              }}>
              מסכת קידושין (מודפסת)
            </Link>
          </Box>
          <Link
            to="/introduction"
            style={{
              display: 'block',
              width: '10rem',
              margin: '0rem auto',
              textAlign: 'center',
              fontSize: '1.5rem',
              color: 'white',
            }}>
            מבוא
          </Link>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              maxWidth: '26rem',
              margin: '0 auto',
            }}>
            <Link
              to="https://assets.talmudyerushalmi.com/documents/guide_he.pdf"
              target="_blank"
              style={{
                display: 'block',
                textAlign: 'center',
                color: 'white',
              }}>
              מדריך לשימוש במהדורה
            </Link>
            <Link
              to="https://assets.talmudyerushalmi.com/documents/guide_en-US.pdf"
              target="_blank"
              style={{
                display: 'block',
                textAlign: 'center',
                color: 'white',
              }}>
              Guide for the Edition
            </Link>
          </div>
          <a
            href="https://forms.gle/rYsJ9ZV3vic5Xrcb9"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'white',
              textAlign: 'center',
              display: 'block',
              margin: '1rem auto',
            }}>
            The edition is being prepared... for updates, ideas and cooperation suggestions click here
          </a>
          <p
            style={{
              color: 'white',
              textAlign: 'center',
              display: 'block',
              margin: '1rem auto',
            }}>
            To support the edition click{' '}
            <a href="mailto:digital.yerushalmi@gmail.com" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
              here
            </a>
          </p>
          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>תלמוד ירושלמי (ע״ר)</h3>
            <h3>Talmud Yerushalmi Hadigitali (R.A.)</h3>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default HomePage;
