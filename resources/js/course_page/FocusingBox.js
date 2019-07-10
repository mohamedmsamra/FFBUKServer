import React from 'react';
import Form from 'react-bootstrap/Form';

class FocusingBox extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.hidden && !this.props.hidden) {
            this.ref.current.focus();
        }
    }

    componentDidMount() {
        this.ref.current.focus();
    }

    render() {
        var { hidden, ref, value, handleEditText, onEnter, ...otherProps} = this.props;

        return (
            <Form.Control
                type="text"
                hidden={this.props.hidden}
                ref={this.ref}
                value={this.props.value} 
                onChange={(e) => this.props.handleEditText(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter')
                        this.props.onEnter();
                }}
                {...otherProps}/>
        );
    }
}

export default FocusingBox;