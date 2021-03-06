import React from 'react';
import Button from 'react-bootstrap/Button';

/* This is a template for alerts from the library 'react-alert'. It allows using alerts that have 'Confirm' and 'Cancel'
 * buttons. Each alert takes a single object with the following properties:
 *     text      (string)            - The message the alert will display.
 *     autoClose (boolean, optional) - Whether the alert should close by itself after 4 seconds, ignored when onConfirm
 *                                     is present (default: true)
 * 
 * To create an alert that has the 'Confirm' and 'Cancel' buttons, also include the following properties:
 *     onConfirm (function)           - The function to run when 'Confirm' is clicked
 *     onCancel  (function, optional) - The function to run when 'Cancel' or the close button are clicked
 */

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