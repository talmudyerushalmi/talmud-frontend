import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import { Header } from './layout/Header';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import theme from './ui/Theme';
import { RTL } from './ui/RTL';
import AdminRoutes  from './routes/AdminRoutes';
import { getUserAuth } from './store/actions/authActions';
import { connect } from 'react-redux';
import ViewMishnaPage from './pages/ViewMishnaPage';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const mapDispatchToProps = (dispatch:any) => ({
  getUserAuth: () => {
    dispatch(getUserAuth())
  },
})

function App(props:any) {
  const { getUserAuth } = props;

  useEffect(()=>{
    getUserAuth();
  });

  return (
    <RTL>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
      <div className="App" style={{direction:'rtl'}}>
        <BrowserRouter>
        <Header/>
          <Switch>
          <Route path="/" exact  render={() => <Redirect to="/talmud/yevamot/001/001" />}/>
          <Route path="/talmud/:tractate/:chapter/:mishna" exact component={ViewMishnaPage}/>
          <AdminRoutes/>
          </Switch>
         </BrowserRouter>
      </div>
      </ThemeProvider>
    </StyledEngineProvider>
    </RTL>
  );
}

export default connect(null, mapDispatchToProps)(App);
