import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ElimibugApi from '../../../api/api';
import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';

const statuses = [
  'submitted',
  'approved',
  'in_progress',
  'tested',
  'ready_for_release',
  'released',
];

function BugDetail() {
  const { id } = useParams();

  const [bug, setBug] = useState(null);

  useEffect(
    function getBugs() {
      async function getBug() {
        const res = await ElimibugApi.getBug(id);
        setBug(res);
      }

      getBug();
    },
    [id]
  );

  async function handleClick(e) {
    e.preventDefault();
    const newStatus = statuses[statuses.indexOf(bug.lastStatus) + 1];

    const data = { lastStatus: newStatus };

    let result = await ElimibugApi.updateBug(id, data);
    setBug(result);
  }

  if (!bug) return <LoadingSpinner />;

  let color =
    bug.priority === 'low'
      ? 'blue'
      : bug.priority === 'medium'
      ? 'green'
      : 'red';

  let nextStatus = statuses[statuses.indexOf(bug.lastStatus) + 1];

  return (
    <div className="col-md-8 offset-md-2">
      <Card className="BugDetail ">
        <Card.Body>
          <Card.Header
            as="h5"
            style={{ backgroundColor: color, color: 'white' }}
          >
            {`Priority:  ${bug.priority}`}
          </Card.Header>
          <Card.Title>{bug.bugName}</Card.Title>
          <Card.Subtitle>{bug.description}</Card.Subtitle>
          <Card.Text>Current status: {bug.lastStatus}</Card.Text>
          <Card.Text>Set next status to:</Card.Text>
          {nextStatus ? (
            <Button size="sm" onClick={handleClick}>
              {nextStatus}
            </Button>
          ) : null}
        </Card.Body>
      </Card>
    </div>
  );
}

export default BugDetail;
