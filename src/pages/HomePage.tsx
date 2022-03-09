import React, { useEffect } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import TagManager from 'react-gtm-module';

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
        marginBottom: '1rem'}
  }
}));


const HomePage = (props) => {
  const classes = useStyles();
  useEffect(()=>{
    TagManager.dataLayer({
      dataLayer: {
        event: 'page_view',
        pagePath: window.location.href,
        pageTitle: 'homepage',
      },
    });
  },[])
  return (
    <>

      <Container>
        <Paper className={classes.panel} style={{marginTop:'12rem'}}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h1">תלמוד ירושלמי</Typography>
            <Typography variant="h1">Talmud Yerushalmi</Typography>
          </Box>
        </Paper>
        <Paper className={classes.panel}>
          <Typography style={{textAlign:'left',paddingBottom:'1rem'}}>ISF Grant 1717/19</Typography>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{textAlign:'right'}}>
              <Typography variant="h2">מהדורה דיגיטלית</Typography>
              <Typography variant="h2">בעריכת פרופ׳ מנחם כ״ץ</Typography>
              <br/>
              <Typography variant="h2">בהשתתפות ד״ר הלל גרשוני</Typography>
              <br/>
              <Typography variant="h3">פיתוח אתר ע״י ירון בר</Typography>


              </div>
              <div style={{textAlign:'left'}}>
              <Typography variant="h2">Digital Critical Edition</Typography>
              <Typography variant="h2">Edited by Prof. Menachem Katz</Typography>
              <br/>
              <Typography variant="h2">In collaboration with Dr. Hillel Gershuni</Typography>
              <br/>
              <Typography variant="h3">Site developed by Yaron Bar</Typography>
              </div>
          </Box>
          
          <Link to="/talmud/yevamot/001/001" style={{background:'white',
          display:'block', width:'10rem',margin: '4rem auto', textAlign:'center',
           padding:'1rem',borderRadius:'0.5rem', color:'blue',textDecoration:'none'}}>
              מסכת יבמות
          </Link>
          <Link to="/introduction" 
          style={{
          display:'block', width:'10rem',margin: '0rem auto', textAlign:'center',
          fontSize: '1.5rem',
          color:'white'}}>
              מבוא
          </Link>
          <Link to="/steering" 
          style={{
          display:'block', width:'10rem',margin: '0rem auto', textAlign:'center',padding:'0.2rem',
          color:'white'}}>
              ועדת היגוי
          </Link>
          <Link to="/partners" 
          style={{
          display:'block', width:'10rem',margin: '0rem auto', textAlign:'center',padding:'0.2rem',
          color:'white'}}>
              שותפים
          </Link>

          <a href={process.env.PUBLIC_URL + '/mahbarot_menachamyiot.pdf'} 
          target="_blank" rel="noreferrer"
          style={{
            display:'block', width:'20rem',margin: '0rem auto', textAlign:'center',padding:'0.2rem',
            color:'white'}}>
              מחברות מנחמיות - בבלי יבמות פרק ראשון
          </a>
          <a href={process.env.PUBLIC_URL + '/tosefta_yevamot_mahbarot_menachamyiot.pdf'} 
          target="_blank" rel="noreferrer"
          style={{
            display:'block', width:'20rem',margin: '0rem auto', textAlign:'center',padding:'0.2rem',
            color:'white'}}>
              מחברות מנחמיות - תוספתא יבמות
          </a>
          <a href={process.env.PUBLIC_URL + '/mapping.pdf'} 
          target="_blank" rel="noreferrer"
          style={{
            display:'block', width:'20rem',margin: '0rem auto', textAlign:'center',padding:'0.2rem',
            color:'white'}}>
              ירושלמי יבמות פרק ראשון - מפת הסוגיות
          </a>

          <a href="https://youtu.be/A1tMRN7iRxU" target="_blank" rel="noreferrer"
          style={{color:'white',textAlign:'center',
          display:'block', width:'10rem',margin: '0rem auto',
           padding:'0.2rem'}}
          

          >
              סרטון הדגמה

          </a>
          <a href="https://forms.gle/rYsJ9ZV3vic5Xrcb9" target="_blank" 
          style={{color:'white',textAlign:'center',
          display:'block',margin: '1rem auto',
           padding:'1rem'}}
          >
              The edition is being prepared... for updates, ideas and cooperation suggestions click here
          </a>

        </Paper>
      </Container>
    </>
  );
};

export default HomePage;
