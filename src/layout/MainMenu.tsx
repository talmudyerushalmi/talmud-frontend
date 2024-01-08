import React from 'react';
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
import { Box, IconButton, Tooltip } from '@mui/material';
import SettingsContext from '../context/settings-context';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import i18next from 'i18next';

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
  const { userGroup } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const settingsContext = React.useContext(SettingsContext);
  const url = `https://assets.talmudyerushalmi.com/documents/guide_${i18next.resolvedLanguage}.pdf`

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        dir="rtl"
        sx={{
          //backgroundColor:'#3f51b5',
          '& .MuiButton-root': { color: 'white' },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}>
        <Toolbar>
          <div style={{ fontSize: '1rem', display:'flex' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <span>{t('Jerusalem Talmud')} - </span>
              <strong>{t('Beta Version')},</strong>
              <strong> {t('Demo')}</strong>
            </Link>
            <Link to={url} target="_blank" style={{ textDecoration: 'none', color: 'white', marginRight: '2rem', marginLeft: '2rem' }}>
              <span>{t("Guide for the Edition")}</span>
            </Link>
          </div>
          <Typography variant="h6" className={classes.title}></Typography>
          <LanguageSelector />
          <Tooltip title={<div>{t("Light mode")}</div>}>
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

export default connect(mapStateToProps, null)(MainMenu);
