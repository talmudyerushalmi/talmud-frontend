import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Talmud from './pages/Talmud';
import { Header } from './layout/Header';
import TalmudPage from './components/MishnaView/TalmudPage';
import { ThemeProvider } from '@material-ui/styles';
import theme from './ui/Theme';
import { RTL } from './ui/RTL';
import { AdminRoutes } from './routes/AdminRoutes';


function App() {
  return (
    <RTL>
    <ThemeProvider theme={theme}>
    <div className="App" style={{direction:'rtl'}}>
      <BrowserRouter>
      <Header/>

        <div>
        <Route path="/" exact component={Talmud}/>
        <Route path="/talmud/:tractate/:chapter/:mishna" exact component={TalmudPage}/>
        <AdminRoutes/>        
        </div>

        
       </BrowserRouter>
    
    </div>
    </ThemeProvider>
    </RTL>
  );
}

export default App;
