import React, { useContext } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UserContext from '../Auth/UserContext';

function Homepage() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">Elimibug</h1>
        <span className="lead">Track your project bugs</span>
        {currentUser ? (
          <h2>
            Welcome Back, {currentUser.firstName || currentUser.username}!
          </h2>
        ) : (
          <span>
            <Stack gap={2} className="col-md-3 mx-auto">
              <LinkContainer
                className="btn btn-primary font-weight-bold mr-3"
                to="/login"
              >
                <Button>Log in</Button>
              </LinkContainer>
              <LinkContainer
                className="btn btn-primary font-weight-bold mr-3"
                to="/signup"
              >
                <Button>Sign Up</Button>
              </LinkContainer>
            </Stack>
          </span>
        )}
      </div>
    </div>
  );
}

export default Homepage;
