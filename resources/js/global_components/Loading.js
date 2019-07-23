import React from 'react';

/* Used throughout the project to add a spinning loading icon with customisable text. */
function Loading(props) {
    return (
        <div className="loading">
            <img src="/svg/loading.svg"></img>
            <p>{props.text}</p>
        </div>
    );
}

export default Loading;