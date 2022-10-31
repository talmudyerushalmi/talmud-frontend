import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import background from './assets/leiden2.jpg';
import './App.css';
import { Header } from './layout/Header';
import { makeStyles } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import { RTL } from './ui/RTL';
import AdminRoutes from './routes/AdminRoutes';
import { getUserAuth } from './store/actions/authActions';
import { connect } from 'react-redux';
import ViewMishnaPage from './pages/ViewMishnaPage';
import HomePage from './pages/HomePage';
import { Footer } from './layout/Footer';
import { StyledEngineProvider, Theme } from '@mui/material';
import theme from './ui/Theme';
import IntroductionPage from './pages/IntroductionPage';
import PartnersPage from './pages/PartnersPage';
import SteeringPage from './pages/SteeringPage';
import ViewChapterPage from './pages/ViewChapterPage';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const useStyles = makeStyles({
  default: {},
  homepage: {
    backgroundImage: `url(${background})`,
    backgroundPosition: 'center -27rem',
    minHeight: '100vh',
  },
});
const mapDispatchToProps = (dispatch: any) => ({
  getUserAuth: () => {
    dispatch(getUserAuth());
  },
});

function App(props: any) {
  const { getUserAuth } = props;
  const classes = useStyles();
  const location = useLocation();
  useEffect(() => {
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
          <div className={coverClass} style={{ direction: 'rtl' }}>
            <Header />
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/introduction" exact component={IntroductionPage} />
              <Route path="/steering" exact component={SteeringPage} />
              <Route path="/partners" exact component={PartnersPage} />
              <Route path="/talmud/:tractate/:chapter/:mishna" exact component={ViewMishnaPage} />
              <Route path="/talmud/:tractate/:chapter" exact component={ViewChapterPage} />
              <AdminRoutes />
              <Route path={process.env.PUBLIC_URL} />
            </Switch>
            <Footer />
          </div>
        </ThemeProvider>
      </RTL>
    </StyledEngineProvider>
  );
}

export default connect(null, mapDispatchToProps)(App);
