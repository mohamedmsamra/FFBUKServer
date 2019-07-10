import React from 'react';
import Button from 'react-bootstrap/Button';

const ConfirmableAlertTemplate = ({ style, options, message, close }) => (
    <div className="alert-box shadow" style={style}>
        <div className="float-left alert-icon align-middle">
            {options.type === 'info' && <i className="fas fa-info-circle text-info"></i>}
            {options.type === 'success' && <i className="fas fa-check-circle text-success"></i>}
            {options.type === 'error' && <i className="fas fa-exclamation-circle text-danger"></i>}
        </div>
        <div className="float-left alert-text">
            {message.text}
        </div>
        {(() => {if (!message.onConfirm || (message.autoClose === false)) setTimeout(close, 4000)})()}
        <button className="float-right alert-btn" onClick={() => {close(); if (message.onCancel) message.onCancel();}}>x</button>
        {message.onConfirm &&
            <div className="float-right alert-confirm-btns">
                <Button onClick={() => {close(); message.onConfirm()}} variant="outline-success" size="sm">Confirm</Button>
                <Button onClick={() => {close(); if (message.onCancel) message.onCancel();}} variant="outline-danger" size="sm">Cancel</Button>
            </div>
        }
        <div className="clear"></div>
    </div>
);

export default ConfirmableAlertTemplate;