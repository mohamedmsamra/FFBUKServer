import React from 'react';
import ReactQuill from 'react-quill';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    handleValueChange(val) {
        this.setState({value: val})
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.value !== this.props.value;
    }

    render() {
        const quillModules = {
            toolbar: [
                [{ 'header': [2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'color': [] }]
            ]
        };
        return (
            <ReactQuill
                className="sectionText"
                modules={quillModules}
                value={this.props.value  || ''}
                onChange={this.props.handleSectionTextChange} 
            />
        )
    }
}

export default TextEditor;