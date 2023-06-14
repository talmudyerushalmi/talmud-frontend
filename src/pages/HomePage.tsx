import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Container, Paper, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

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
          <Typography style={{ textAlign: 'left', paddingBottom: '1rem' }}>ISF Grant 1717/19</Typography>
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
          <Link
            to="/workshop2023"
            style={{
              background: 'white',
              display: 'block',
              width: '20rem',
              margin: '2rem auto',
              textAlign: 'center',
              padding: '1rem',
              borderRadius: '0.5rem',
              color: 'blue',
              textDecoration: 'none',
            }}>
            ISF workshop - Editions of Classical Jewish Literature in the Digital Era
          </Link>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/talmud/yevamot/001/001"
              style={{
                background: 'white',
                display: 'block',
                width: '10rem',
                margin: '2rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
              }}>
              מסכת יבמות
            </Link>
            <Link
              to="/talmud/gittin/001/001"
              style={{
                background: 'white',
                display: 'block',
                width: '10rem',
                margin: '2rem 1rem',
                textAlign: 'center',
                padding: '1rem',
                borderRadius: '0.5rem',
                color: 'blue',
                textDecoration: 'none',
              }}>
              מסכת גיטין
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
          <a
            href="http://ircdl2022.dei.unipd.it/downloads/papers/IRCDL_2022_paper_3.pdf"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              width: '20rem',
              margin: '0rem auto',
              textAlign: 'center',
              padding: '0.2rem',
              color: 'white',
            }}>
            Talmud Yerushalmi Critical Digital Edition
          </a>
          <Link
            to="/steering"
            style={{
              display: 'block',
              width: '14rem',
              margin: '0rem auto',
              textAlign: 'center',
              padding: '0.2rem',
              color: 'white',
            }}>
            ועדת היגוי, עמיתי מחקר ושותפים
          </Link>
          <a
            href="https://youtu.be/A1tMRN7iRxU"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'white',
              textAlign: 'center',
              display: 'block',
              width: '10rem',
              margin: '0rem auto',
              padding: '0.2rem',
            }}>
            סרטון הדגמה
          </a>
          <div
            style={{
              background: '#4067b5',
              width: '50%',
              margin: '1rem auto',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}>
            <a
              href="https://drive.google.com/file/d/1-Zbc3BVqnMOkUNbyWRzgJqrnezAiM9Rz/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                width: '20rem',
                margin: '0rem auto',
                textAlign: 'center',
                padding: '0.2rem',
                color: 'white',
              }}>
              ירושלמי יבמות פרק ראשון - מפת הסוגיות
            </a>
            <a
              href="https://drive.google.com/file/d/1PmksMSQAKQaaTHctMu7zWQiGeVwq3_ds/view"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                width: '20rem',
                margin: '0rem auto',
                textAlign: 'center',
                padding: '0.2rem',
                color: 'white',
              }}>
              מחברות מנחמיות - תוספתא יבמות
            </a>
            <a
              href="https://drive.google.com/file/d/1SBz_14fXj4zd9JOFE0UpNIgtGTHWbZpo/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                width: '20rem',
                margin: '0rem auto',
                textAlign: 'center',
                padding: '0.2rem',
                color: 'white',
              }}>
              מחברות מנחמיות - בבלי יבמות פרק ראשון
            </a>
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
