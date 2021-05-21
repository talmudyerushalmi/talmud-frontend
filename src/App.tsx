import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Talmud from './pages/Talmud';
import { Admin } from './pages/Admin';
import { Header } from './layout/Header';
import TalmudPage from './components/MishnaView/TalmudPage';


function App() {
  return (

    <div className="App">
      <BrowserRouter>
      <Header/>

        <div>
        <Route path="/" exact component={Talmud}/>
        <Route path="/talmud/:tractate/:page/:mishna" exact component={TalmudPage}/>
        <Route path="/admin" component={Admin}/>
        </div>

        
       </BrowserRouter>
    
    </div>
  );
}

export default App;
