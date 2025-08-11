import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import STLViewer from './STLViewer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <STLViewer />
  </React.StrictMode>
);
