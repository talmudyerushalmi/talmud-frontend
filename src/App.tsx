import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import background from './assets/leiden2.jpg';
import './App.css';
import { Header } from './layout/Header';
import { makeStyles } from '@mui/styles';
import { ThemeProvider } from '@mui/material/styles';
import { RTL } from './ui/RTL';
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
import RequireAuth from './components/login/RequireAuth';
import { Authenticator } from '@aws-amplify/ui-react';
import { Login } from './components/login/Login';
import EditLinePage from './pages/EditLinePage';
import EditMishnaPage from './pages/EditMishnaPage';
import { UserGroup } from './store/reducers/authReducer';

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
      <Authenticator.Provider>
        <RTL>
          <ThemeProvider theme={theme}>
            <div className={coverClass} style={{ direction: 'rtl' }}>
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/introduction" element={<IntroductionPage />} />
                <Route path="/steering" element={<SteeringPage />} />
                <Route path="/partners" element={<PartnersPage />} />
                <Route path="/talmud/:tractate/:chapter/:mishna" element={<ViewMishnaPage />} />
                <Route path="/talmud/:tractate/:chapter" element={<ViewChapterPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="admin">
                  <Route
                    path="edit/:tractate/:chapter/:mishna/:line"
                    element={
                      <RequireAuth allowedGroups={[UserGroup.Editor]}>
                        <EditLinePage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="edit/:tractate/:chapter/:mishna"
                    element={
                      <RequireAuth allowedGroups={[UserGroup.Editor]}>
                        <EditMishnaPage />
                      </RequireAuth>
                    }
                  />
                </Route>
                <Route
                  path="/protected"
                  element={
                    <RequireAuth allowedGroups={[UserGroup.Editor]}>
                      <h2>Protected!</h2>
                    </RequireAuth>
                  }
                />
              </Routes>
              <Footer />
            </div>
          </ThemeProvider>
        </RTL>
      </Authenticator.Provider>
    </StyledEngineProvider>
  );
}

export default connect(null, mapDispatchToProps)(App);
