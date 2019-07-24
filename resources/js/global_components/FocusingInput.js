import React from 'react';
import Form from 'react-bootstrap/Form';

/* An input box that becomes focused the first time it's rendered. It is can also be passed a function to be executed
 * when enter or escape is pressed.
 */
class FocusingInput extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.focus();
    }

    render() {
        var { className, value, onChange, name, onEnterKey, onEscapeKey, ...otherProps} = this.props;
        
        return (
            <Form.Control
                className={className}
                value={value}
                onChange={onChange}
                name={name}
                ref={this.ref}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        if (onEnterKey) this.props.onEnterKey();
                    } else if (e.key === 'Escape') {
                        if (onEscapeKey) this.props.onEscapeKey();
                    }
                }}
                {...otherProps} />
        );
    }
}

export default FocusingInput;