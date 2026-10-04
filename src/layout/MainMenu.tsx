import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AdminMenu from './AdminMenu';
import { connect } from 'react-redux';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { UserGroup } from '../store/reducers/authReducer';
import AccountMenu from './menu/AccountMenu';
import { Box, Hidden, IconButton, Tooltip } from '@mui/material';
import SettingsContext from '../context/settings-context';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import i18next from 'i18next';
import { getAllContentItems } from '../store/actions/contentfulActions';
import {
  FUTURISTIC_NAV_VARIANT,
  getFuturisticNavChrome,
} from '../context/futuristicNavChrome';

const mapStateToProps = (state: any) => ({
  userGroup: state.authentication.userGroup,
});
const mapDispatchToProps = {
  getAllContentItems,
};

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

interface Props {
  userGroup: any;
  getAllContentItems: Function;
}

const MainMenu = (props: any) => {
  const { userGroup, getAllContentItems } = props;
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const settingsContext = React.useContext(SettingsContext);
  const url = `https://assets.talmudyerushalmi.com/documents/guide_${i18next.resolvedLanguage}.pdf`;
  const isRTL = i18n.language === 'he';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  // Check if we're in staging environment
  const staging = process.env.USER_BRANCH === 'staging' || 
                  window.location.hostname.includes('staging');
  const chrome = getFuturisticNavChrome(FUTURISTIC_NAV_VARIANT);
  const navLink = { textDecoration: 'none', color: chrome.linkColor } as const;
  const navSep = { margin: '0 1rem', color: 'rgba(34, 211, 238, 0.35)' } as const;

  useEffect(() => {
    getAllContentItems();
  }, []);
  
  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        dir={direction}
        sx={{
          ...(staging
            ? { backgroundColor: '#6a1b9a' }
            : {
                background: chrome.barBackground,
                borderBottom: chrome.accentBorder,
                color: chrome.foreground,
              }),
          '& .MuiButton-root': { color: chrome.foreground },
          '& .MuiIconButton-root': { color: chrome.foreground },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}>
        <Toolbar>
          <div style={{ fontSize: '1rem', display: 'flex' }}>
            <Link to="/" style={navLink}>
              <span>{t('Jerusalem Talmud')} - </span>
              <strong>{t('Beta Version')}</strong>
            </Link>
            <Link
              to={url}
              target="_blank"
              style={{ 
                ...navLink,
                [isRTL ? 'marginRight' : 'marginLeft']: '2rem',
                [isRTL ? 'marginLeft' : 'marginRight']: '2rem'
              }}>
              <span>{t('Guide for the Edition')}</span>
            </Link>
          </div>
          <Hidden mdDown>
            <div
              style={{
                fontSize: '1rem',
                display: 'flex',
                minWidth: '18rem',
                justifyContent: 'space-around',
                flexGrow: 0.1,
              }}>
              <Link to="/manuscripts" style={navLink}>
                <span>{t('Manuscripts')}</span>
              </Link>
              <span style={navSep}>|</span>
              <Link to="/manuscripts_desc" style={navLink}>
                <span>{t('NewManuscriptsDescription')}</span>
              </Link>
              <span style={navSep}>|</span>
              <Link to="/resources" style={navLink}>
                <span>{t('Resources')}</span>
              </Link>
              <span style={navSep}>|</span>
              <Link to="/qiddushin" style={navLink}>
                <span>{t('Qiddushin')}</span>
              </Link>
              <span style={navSep}>|</span>
              <Link to="/about" style={navLink}>
                <span>{t('About')}</span>
              </Link>
              <span style={navSep}>|</span>
              <Link to="/support" style={navLink}>
                <span>{t('Support for the Edition')}</span>
              </Link>
              {staging && (
                <>
                  <span style={navSep}>|</span>
                  <span style={{ color: 'red' }}>סביבת סטיג׳ינג</span>
                </>
              )}
            </div>
          </Hidden>
          <Typography variant="h6" className={classes.title}></Typography>
          <LanguageSelector />
          <Tooltip title={<div>{t('Light mode')}</div>}>
            <Box onClick={settingsContext.toggleMode}>
              <IconButton color="inherit">
                {settingsContext.mode === 'light' ? (
                  <Brightness7Icon fontSize="small" />
                ) : (
                  <Brightness4Icon fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Tooltip>

          {userGroup === UserGroup.Editor ? (
            <>
              <AdminMenu />
            </>
          ) : null}

          <AccountMenu />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
