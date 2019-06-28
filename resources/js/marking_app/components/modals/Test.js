import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';

class Test extends React.Component {
    constructor(...args) {
      super(...args);
  
      this.state = { validated: false };
    }
  
    handleSubmit(event) {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.setState({ validated: true });
    }
  
    render() {
        const { validated } = this.state;
        return (
          <Form
            noValidate
            validated={validated}
            onSubmit={e => this.handleSubmit(e)}
          >

            <Button type="submit">Submit form</Button>
          </Form>
        );
      }
    }
  

  export default Test;