import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SignOut from '../components/Menu/SignOut';
import AdminMenu from './AdminMenu';
import { connect } from 'react-redux';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UserGroup } from '../store/reducers/authReducer';

const mapStateToProps = (state: any) => ({
  userGroup: state.authentication.userGroup,
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
  const { username, userGroup } = props;
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        dir="rtl"
        sx={{
          //backgroundColor:'#3f51b5',
          '& .MuiButton-root': { color: 'white' },
        }}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" size="large">
            <MenuIcon />
          </IconButton>
          <div style={{ fontSize: '1rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <span>{t('Jerusalem Talmud')} - </span>
              <strong>{t('Beta Version')}</strong>
            </Link>
          </div>
          <Typography variant="h6" className={classes.title}></Typography>
          <LanguageSelector />
          {userGroup === UserGroup.Editor ? (
            <>
              <AdminMenu />
              <SignOut />
            </>
          ) : null}
          {userGroup === UserGroup.Authenticated ? (
            <>
              <SignOut />
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default connect(mapStateToProps, null)(MainMenu);
