import React, { useState, useEffect } from 'react';
import ElimibugApi from '../../../api/api';
import BugCard from '../BugCard/BugCard';

import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';

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
    <div className="BugList col-md-8 offset-md-2">
      {bugs.length ? (
        <div>
          {bugs.map((b) => (
            <BugCard
              key={b.id}
              name={b.name}
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
  );
}

export default BugList;
