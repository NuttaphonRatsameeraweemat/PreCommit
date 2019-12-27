import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/stable';
// import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'react-block-ui/style.css';
console.log('baseeeeeeeeeeeee ===>>>',process.env.REACT_APP_DOC_TITLE)
console.log('NODE_ENV ===>>>',process.env.NODE_ENV)
console.log('baseeeeeeeeeeeee ===>>>',process.env.REACT_APP_API_ENDPOINT)


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
