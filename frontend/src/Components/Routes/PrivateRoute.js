import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../Auth/UserContext';

function PrivateRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
