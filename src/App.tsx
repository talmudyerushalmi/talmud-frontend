import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import background from './assets/leiden.jpg';
import './App.css';
import { Header } from './layout/Header';
import { makeStyles } from '@mui/styles';
import { ThemeProvider } from "@mui/material/styles";
import { RTL } from './ui/RTL';
import AdminRoutes  from './routes/AdminRoutes';
import { getUserAuth } from './store/actions/authActions';
import { connect } from 'react-redux';
import ViewMishnaPage from './pages/ViewMishnaPage';
import HomePage from './pages/HomePage';
import { Footer } from './layout/Footer';
import { StyledEngineProvider, Theme } from '@mui/material';
import theme from './ui/Theme';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const useStyles = makeStyles({
  default: {},
  homepage: {
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center -31rem',
    minHeight: '100vh'
  }
});
const mapDispatchToProps = (dispatch:any) => ({
  getUserAuth: () => {
    dispatch(getUserAuth())
  },
})

function App(props:any) {
  const { getUserAuth } = props;
  const classes = useStyles();
  const location = useLocation();
  useEffect(()=>{
    getUserAuth();
  });
  let coverClass = classes.default;
  if (location.pathname === '/') {
     coverClass = classes.homepage;
  }
  return (
    <StyledEngineProvider injectFirst>
    <RTL>
      <ThemeProvider theme={theme}>
      <div className={coverClass} style={{direction:'rtl'}}>
        <Header/>
          <Switch>
          <Route path="/" exact  component={HomePage}/>
          <Route path="/talmud/:tractate/:chapter/:mishna" exact component={ViewMishnaPage}/>
          <AdminRoutes/>        
          </Switch>
          <Footer/>
      </div>
      </ThemeProvider>
    </RTL>
    </StyledEngineProvider>
  );
}

export default connect(null, mapDispatchToProps)(App);
