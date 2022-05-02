import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ElimibugApi from '../../../api/api';
import BugCard from '../BugCard/BugCard';
import NewBug from '../NewBug/NewBug';

import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';
import { LinkContainer } from 'react-router-bootstrap';

function BugList() {
  const [bugs, setBugs] = useState(null);

  // When page loads, requests a list of all bugs from API

  useEffect(function getbugsOnMount() {
    find();
  }, []);

  // On find form submit, reload bug list

  async function find() {
    let bugs = await ElimibugApi.getBugs();

    setBugs(bugs);
  }

  // Show spinner while waiting for API response

  if (!bugs) return <LoadingSpinner />;

  return (
    <div>
      <div>
        <NewBug />
      </div>
      <div className="BugList col-md-4 offset-md-4">
        {bugs.length ? (
          <div>
            {bugs.map((b) => (
              <BugCard
                key={b.id}
                id={b.id}
                bugName={b.bugName}
                project={b.project}
                description={b.description}
                priority={b.priority}
                lastStatus={b.lastStatus}
              />
            ))}
          </div>
        ) : (
          <p>No bugs found!</p>
        )}
      </div>
    </div>
  );
}

export default BugList;
