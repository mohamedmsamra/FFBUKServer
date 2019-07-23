import React from 'react';
import ReactQuill from 'react-quill';

/* This is the text editor element that is used to write the text of the sections. The text editor uses the library 
 * called ReactQuill. The modules for the text editor are specified here (eg formatting that can be used).
 */
class TextEditor extends React.Component {
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
                [{ 'color': [] }, { 'list': 'bullet' }]
            ]
        };
        return (
            <ReactQuill
                className="sectionText"
                modules={quillModules}
                value={this.props.value  || ''}
                onChange={this.props.handleSectionTextChange} />
        )
    }
}

export default TextEditor;