import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../Home/Home';
import BugList from '../Bug/BugList/BugList';
import BugDetail from '../Bug/BugDetail/BugDetail';
import ProfileForm from '../ProfileForm/ProfileForm';
import LoginForm from '../Auth/LoginForm/LoginForm';
import SignupForm from '../Auth/SignupForm/SignupForm';
import PrivateRoute from './PrivateRoute';
import ProjectList from '../Project/ProjectList/ProjectList';

/** Routes for site
 *
 *
 *
 *
 *
 */

function Routing({ login, signup }) {
  return (
    <div className="pt-5">
      <Routes>
        <Route exact path="/" element={<Homepage />}></Route>

        <Route
          exact
          path="/bugs"
          element={
            <PrivateRoute>
              <BugList />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path="/bug/:handle"
          element={
            <PrivateRoute>
              <BugDetail />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectList />
            </PrivateRoute>
          }
        ></Route>
        <Route
          exact
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileForm />
            </PrivateRoute>
          }
        ></Route>

        <Route
          exact
          path="/login"
          element={<LoginForm login={login} />}
        ></Route>

        <Route
          exact
          path="/signup"
          element={<SignupForm signup={signup} />}
        ></Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default Routing;
