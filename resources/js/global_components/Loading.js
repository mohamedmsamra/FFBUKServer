import React from 'react';

function Loading(props) {
    return (
        <div className="loading">
            <img src="/svg/loading.svg"></img>
            <p>{props.text}</p>
        </div>
    );
}

export default Loading;