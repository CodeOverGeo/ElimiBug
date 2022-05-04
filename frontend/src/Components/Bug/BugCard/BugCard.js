import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card } from 'react-bootstrap';
import './BugCard.css';

function BugCard({ bugName, project, description, priority, id, lastStatus }) {
  let color =
    priority === 'low' ? 'blue' : priority === 'medium' ? 'green' : 'red';

  // {low: 'blue', medium: 'green'}

  return (
    <LinkContainer to={`/bug/${id}`}>
      <Card style={{ width: '70vw' }} className="BugCard">
        <Card.Header as="h5" style={{ backgroundColor: color, color: 'white' }}>
          Priority:
          {priority}
        </Card.Header>
        <Card.Body>
          <Card.Title>{bugName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{project}</Card.Subtitle>
          <Card.Text className="text-center">{description}</Card.Text>
          <Card.Text className="text-center">
            Current status: {lastStatus}
          </Card.Text>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default BugCard;
