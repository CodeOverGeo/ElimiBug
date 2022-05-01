import React from 'react';
import { Spinner } from 'react-bootstrap';

/** Loading Spinner to display when requesting API data */

function LoadingSpinner() {
  return (
    <div>
      <Spinner animation="border" variant="secondary" />
    </div>
  );
}

export default LoadingSpinner;
