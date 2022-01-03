import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  panel: {
      '&.MuiPaper-root': {
        backgroundColor: '#3f51b5',
        color: 'white',
        padding: '1rem',
        marginBottom: '1rem'}
  }
}));

const HomePage = (props) => {
  const classes = useStyles();
  return (
    <>

      <Container>
        <Paper className={classes.panel} style={{marginTop:'10rem'}}>
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h1">תלמוד ירושלמי</Typography>
            <Typography variant="h1">Talmud Yerushalmi</Typography>
          </Box>
        </Paper>
        <Paper className={classes.panel}>
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
              <Typography variant="h2">Digitial Critical Edition</Typography>
              <Typography variant="h2">Edited by Prof. Menachem Katz</Typography>
              <br/>
              <Typography variant="h2">With the participation of Dr. Hillel Gershuni</Typography>
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
          color:'white'}}>
              מבוא
          </Link>
          <a href="https://youtu.be/A1tMRN7iRxU" target="_blank" 
          style={{color:'white',textAlign:'center',
          display:'block', width:'10rem',margin: '1rem auto',
           padding:'1rem'}}
          

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
