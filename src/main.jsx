

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     {/* <ErrorBoundary> */}
    
   <LanguageProvider>
   <Provider store={store}>

    <App />

   </Provider>
    </LanguageProvider>

     {/* </ErrorBoundary> */}
  </React.StrictMode>,
)