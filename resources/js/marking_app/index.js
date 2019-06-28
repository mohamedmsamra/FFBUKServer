import React from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import App from './App';

const alertOptions = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '30px',
    transition: transitions.SCALE
}

const Root = () => (
    <AlertProvider template={AlertTemplate} {...alertOptions}>
        <App />
    </AlertProvider>
)

ReactDOM.render(<Root />, document.getElementById('react-root'));