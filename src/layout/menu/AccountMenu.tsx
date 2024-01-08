import * as React from 'react';
import Logout from '@mui/icons-material/Logout';
import Login from '@mui/icons-material/Login';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { Hub } from 'aws-amplify';
import { connect } from 'react-redux';
import { getUserAuth, setUserAuth, signOut } from '../../store/actions/authActions';
import { useNavigate } from 'react-router-dom';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state: any) => ({
  username: state.authentication.username,
});

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => {
    dispatch(signOut());
  },
  setUserAuth: (userAuth: any) => {
    dispatch(setUserAuth(userAuth));
  },
  getUserAuth: () => {
    dispatch(getUserAuth());
  },
});

interface Props {
  username: string;
  signOut: Function;
  setUserAuth: Function;
  getUserAuth: Function;
}
const AccountMenu = (props: Props) => {
  const { username, signOut, setUserAuth, getUserAuth } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  Hub.listen('auth', (data) => {
    const { payload } = data;
    if (payload.event === 'signIn') {
      setUserAuth(payload.data.signInUserSession);
    }
  });

    React.useEffect(() => {
    getUserAuth();
  });

  async function handleLogout() {
    try {
      signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  function handleLogin() {
    navigate('/login');
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGetGuide = () => {
    const url = `https://assets.talmudyerushalmi.com/documents/guide_${i18next.resolvedLanguage}.pdf`
    window.open(url)
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}>
            <Avatar sx={{ width: 32, height: 32 }}>{username ? username[0] : '?'}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {username ? (
          <MenuItem>{username}</MenuItem>
        ) : (
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <Login fontSize="small" />
            </ListItemIcon>
            Login
          </MenuItem>
        )}
        <MenuItem onClick={handleGetGuide}>{t("guide_" + i18next.resolvedLanguage)}</MenuItem>
        <Divider />
        {username ? (
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        ) : null}
      </Menu>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountMenu);
