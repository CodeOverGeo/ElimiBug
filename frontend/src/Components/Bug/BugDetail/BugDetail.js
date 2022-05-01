import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ElimibugApi from '../../../api/api';
import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';

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

  if (!bug) return <LoadingSpinner />;

  return (
    <div className="col-md-8 offset-md-2">
      <Card className="BugDetail ">
        <Card.Body>
          <Card.Title>{bug.bugName}</Card.Title>
          <Card.Subtitle>{bug.description}</Card.Subtitle>
        </Card.Body>
      </Card>

      {/* <JobCardList jobs={company.jobs} /> */}
    </div>
  );
}

export default BugDetail;
