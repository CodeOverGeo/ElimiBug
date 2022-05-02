import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';

function NewBug() {
  return (
    <div>
      <LinkContainer to={`/bugs/new`}>
        <Button className="mb-4" variant="primary">
          Create New Bug
        </Button>
      </LinkContainer>
    </div>
  );
}

export default NewBug;
