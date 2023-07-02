import React from 'react';
import ReactGA from 'react-ga4';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';
import { updatedAwsConfig } from './amplify/awsconfig';
import './i18n/i18n';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

console.log('process', process.env);

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const gtmId = process.env.REACT_APP_GTM_ID;
if (typeof gtmId === 'string' && gtmId !== 'NONE') {
  ReactGA.initialize(gtmId);
}

Amplify.configure(updatedAwsConfig);
let persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <div dir="rtl">
            <App />
          </div>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
