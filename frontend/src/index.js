import ReactDOM from 'react-dom/client';
import React from 'react';
import { io } from 'socket.io-client';
import './assets/application.scss';
import init from './init.jsx';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const socket = io();
  const vdom = await init(socket);
  root.render(<React.StrictMode>{vdom}</React.StrictMode>);
};

app();
