import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import theme, { themeConstants } from "../ui/Theme";
import SignOut from "../components/Menu/SignOut";
import AdminMenu from "./AdminMenu";
import { connect } from "react-redux";

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
      <AppBar position="fixed" dir="rtl">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <div style={{ fontSize: "1rem" }}>
            <span>תלמוד ירושלמי - </span>
            <strong>מדגים יכולות</strong>
          </div>
          <Typography variant="h6" className={classes.title}></Typography>
          {username ? (
            <>
              <AdminMenu />
              <SignOut />
            </>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default connect(mapStateToProps, null)(MainMenu);
