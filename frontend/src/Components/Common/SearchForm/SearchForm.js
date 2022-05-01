import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

function SearchForm({ find }) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    find(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }

  function handleChange(e) {
    setSearchTerm(e.target.value);
  }

  return (
    <div className="SearchForm mb-4">
      <form className="form-inline" onSubmit={handleSubmit}>
        <Form.Group controlId="searchTerm">
          <Row>
            <Col>
              <Form.Control
                name="searchTerm"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Project"
              />
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form.Group>
      </form>
    </div>
  );
}

export default SearchForm;
