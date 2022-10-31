import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import './i18n/i18n';
import { BrowserRouter } from 'react-router-dom';
import TagManager from 'react-gtm-module';
console.log('process', process.env);

const gtmId = process.env.REACT_APP_GTM_ID;
if (typeof gtmId === 'string' && gtmId !== 'NONE') {
  const tagManagerArgs = {
    gtmId,
  };
  TagManager.initialize(tagManagerArgs);
}

Amplify.configure(awsconfig);
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <div dir="rtl">
          <App />
        </div>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
