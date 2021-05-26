import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Talmud from './pages/Talmud';
import { Header } from './layout/Header';
import TalmudPage from './components/MishnaView/TalmudPage';
import { ThemeProvider } from '@material-ui/styles';
import theme from './ui/Theme';
import EditLine from './components/edit/EditLine';
import EditMishna from './components/edit/EditMishna/EditMishna';
import { RTL } from './ui/RTL';


function App() {
  return (
    <RTL>
    <ThemeProvider theme={theme}>
    <div className="App">
      <BrowserRouter>
      <Header/>

        <div>
        <Route path="/" exact component={Talmud}/>
        <Route path="/talmud/:tractate/:chapter/:mishna" exact component={TalmudPage}/>
        <Route path="/admin/edit/:tractate/:chapter/:mishna/:line" exact component={EditLine}/>
        <Route path="/admin/edit/:tractate/:chapter/:mishna" exact component={EditMishna}/>
        
        </div>

        
       </BrowserRouter>
    
    </div>
    </ThemeProvider>
    </RTL>
  );
}

export default App;
