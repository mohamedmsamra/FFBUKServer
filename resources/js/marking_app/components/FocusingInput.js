import React from 'react';

/* An input that becomes focused the first time it's rendered.
 * It is can also be passed a function to be executed when
 * enter or escape is pressed.
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
        return (
            <input type="text" 
                className={this.props.className}
                value={this.props.value}
                onChange={this.props.onChange}
                name={this.props.name}
                ref={this.ref}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        if (this.props.onEnterKey) this.props.onEnterKey();
                    } else if (e.key === 'Escape') {
                        if (this.props.onEscapeKey) this.props.onEscapeKey();
                    }
                }}/>
        );
    }
}

export default FocusingInput;