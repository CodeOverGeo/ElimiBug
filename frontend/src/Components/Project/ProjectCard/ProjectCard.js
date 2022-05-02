import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Card } from 'react-bootstrap';
import './ProjectCard.css';

function ProjectCard({ name, count }) {
  return (
    <LinkContainer to={`/project/${name}`}>
      <Card style={{ width: '70vw' }} className="ProjectCard">
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text className="text-center">Bug count: {count}</Card.Text>
        </Card.Body>
      </Card>
    </LinkContainer>
  );
}

export default ProjectCard;
