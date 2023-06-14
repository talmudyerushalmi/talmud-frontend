import React, { useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import background from './assets/leiden2.jpg';
import './App.css';
import { Header } from './layout/Header';
import { ThemeProvider } from '@mui/material/styles';
import { RTL } from './ui/RTL';
import ViewMishnaPage from './pages/ViewMishnaPage';
import HomePage from './pages/HomePage';
import { Footer } from './layout/Footer';
import { Box, PaletteMode, StyledEngineProvider, Theme, useTheme } from '@mui/material';
import theme from './ui/Theme';
import IntroductionPage from './pages/IntroductionPage';
import SteeringPage from './pages/SteeringPage';
import ViewChapterPage from './pages/ViewChapterPage';
import RequireAuth from './components/login/RequireAuth';
import { Authenticator } from '@aws-amplify/ui-react';
import { Login } from './components/login/Login';
import EditLinePage from './pages/EditLinePage';
import EditMishnaPage from './pages/EditMishnaPage';
import { UserGroup } from './store/reducers/authReducer';
import SettingsContext from './context/settings-context';
import { useLocalStorage } from './hooks/useLocalStorage';
import ModerationCommentsPage from './pages/ModerationCommentsPage';
import CommentsAdminPage from './pages/CommentsAdminPage';
import InvitationDialog from './components/InvitationDialog';
import Workshop2023Page from './pages/Workshop2023';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

function App() {
  return (
    <AppContainer>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/introduction" element={<IntroductionPage />} />
        <Route path="/steering" element={<SteeringPage />} />
        <Route path="/workshop2023" element={<Workshop2023Page />} />
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
          <Route
            path="comments"
            element={
              <RequireAuth allowedGroups={[UserGroup.Editor]}>
                <CommentsAdminPage />
              </RequireAuth>
            }>
            <Route index element={<ModerationCommentsPage />} />
            <Route path="moderation" element={<ModerationCommentsPage />} />
          </Route>
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
      <Box>{/* <InvitationDialog /> */}</Box>
      <Footer />
    </AppContainer>
  );
}

export default App;

const AppContainer = ({ children }) => {
  const [mode, setMode] = useLocalStorage<PaletteMode>('light-mode', 'light');
  const getTheme = useMemo(() => theme(mode), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <Authenticator.Provider>
        <RTL>
          <SettingsContext.Provider
            value={{
              mode,
              toggleMode: () => {
                setMode(mode === 'dark' ? 'light' : 'dark');
              },
            }}>
            <ThemeProvider theme={getTheme}>
              <Background>{children}</Background>
            </ThemeProvider>
          </SettingsContext.Provider>
        </RTL>
      </Authenticator.Provider>
    </StyledEngineProvider>
  );
};

const Background = ({ children }) => {
  const t = useTheme();
  const location = useLocation();

  let homepage = location.pathname === '/';

  return (
    <div
      style={{
        direction: 'rtl',
        ...(homepage
          ? {
              backgroundImage: `url(${background})`,
              backgroundPosition: 'center -27rem',
              minHeight: '100vh',
            }
          : {
              background: t.palette.background.default,
              color: t.palette.text.secondary,
              minHeight: '100vh',
            }),
      }}>
      {children}
    </div>
  );
};
