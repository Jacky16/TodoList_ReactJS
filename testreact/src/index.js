import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Header from "./Header";
import Footer from "./Footer";

ReactDOM.render(
  <Header />,
  document.getElementById('main-header')
);
ReactDOM.render(
  <Footer />,
  document.getElementById('main-Footer')
);
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
