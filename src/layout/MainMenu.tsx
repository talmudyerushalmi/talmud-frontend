import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import theme, { themeConstants } from '../ui/Theme';
import SignOut from '../components/Menu/SignOut';
import AdminMenu from './AdminMenu';
import { connect } from 'react-redux';

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MainMenu = (props: any) => {
  const { username } = props;


  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar sx={{ bgcolor: 'primary.main' }} position="fixed" dir="rtl">
        <Toolbar sx={{minHeight:'64px', paddingRight:'24px', paddingLeft:'24px'}} >
          <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu" size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {
            username ?
            <>
            <AdminMenu/>
            <SignOut/>
            </>
          : null
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default connect(mapStateToProps, null)(MainMenu);
