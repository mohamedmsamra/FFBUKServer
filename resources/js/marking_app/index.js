import React from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import ConfirmableAlertTemplate from './ConfirmableAlertTemplate';
import App from './App';

const alertOptions = {
    position: positions.TOP_RIGHT,
    timeout: 0,
    offset: '10px',
    transition: transitions.SCALE
}

const Root = () => (
    <AlertProvider template={ConfirmableAlertTemplate} {...alertOptions}>
        <App />
    </AlertProvider>
)

ReactDOM.render(<Root />, document.getElementById('react-root'));