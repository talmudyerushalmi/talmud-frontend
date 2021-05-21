import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Talmud from './pages/Talmud';
import { Admin } from './pages/Admin';
import { Header } from './layout/Header';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <BrowserRouter>
      <Header/>

        <div>
        <Route path="/" exact component={Talmud}/>
        <Route path="/admin" component={Admin}/>
        </div>

        
       </BrowserRouter>
    
    </div>
    </Provider>
  );
}

export default App;
