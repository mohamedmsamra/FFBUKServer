import React from 'react';

class DangerAlert extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="alert alert-danger" role="alert">
                {this.props.message}
            </div>
        );
    }
}

DangerAlert.defaultProps = {
    message: 'Error'
}


export default DangerAlert;