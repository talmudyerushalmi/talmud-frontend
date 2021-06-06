import React, { useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import { Header } from './layout/Header';
import TalmudPage from './components/MishnaView/TalmudPage';
import { ThemeProvider } from '@material-ui/styles';
import theme from './ui/Theme';
import { RTL } from './ui/RTL';
import AdminRoutes  from './routes/AdminRoutes';
import { getUserAuth } from './store/actions/authActions';
import { connect } from 'react-redux';

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
    <ThemeProvider theme={theme}>
    <div className="App" style={{direction:'rtl'}}>
      <BrowserRouter>
      <Header/>
        <Switch>
        <Route path="/" exact  render={() => <Redirect to="/talmud/yevamot/001/001" />}/>
        <Route path="/talmud/:tractate/:chapter/:mishna" exact component={TalmudPage}/>
        <AdminRoutes/>        
        </Switch>
       </BrowserRouter>
    </div>
    </ThemeProvider>
    </RTL>
  );
}

export default connect(null, mapDispatchToProps)(App);
