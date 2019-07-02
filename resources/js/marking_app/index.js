import React from 'react';
import ReactDOM from 'react-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import App from './App';

const alertOptions = {
    position: positions.TOP_RIGHT,
    timeout: 5000,
    offset: '10px',
    transition: transitions.SCALE
}

const AlertTemplate = ({ style, options, message, close }) => (
    <div className="alert-box shadow" style={style}>
        <div className="float-left alert-icon align-middle">
            {options.type === 'info' && <i className="fas fa-info-circle text-info"></i>}
            {options.type === 'success' && <i className="fas fa-check-circle text-success"></i>}
            {options.type === 'error' && <i className="fas fa-exclamation-circle text-danger"></i>}
        </div>
        <div className="float-left alert-text">
            {message}
        </div>
        <button className="float-right alert-btn" onClick={close}>x</button>
        <div className="clear"></div>
    </div>
    
  )

const Root = () => (
    <AlertProvider template={AlertTemplate} {...alertOptions}>
        <App />
    </AlertProvider>
)

ReactDOM.render(<Root />, document.getElementById('react-root'));