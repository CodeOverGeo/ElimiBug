import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ElimibugApi from '../../api/api';
import Navigation from '../Navigation/Navigation';
import Routing from '../Routes/Routes';
import useLocalStorage from '../../Hooks/useLocalStorage';
import { decodeToken } from 'react-jwt';
import LoadingSpinner from '../Common/LoadingSpinner/LoadingSpinner';
import UserContext from '../Auth/UserContext';
import './App.css';

export const TOKEN_STORAGE_ID = 'elimibug-token';

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = decodeToken(token);
            ElimibugApi.token = token;
            let currentUser = await ElimibugApi.getCurrentUser(username);
            setCurrentUser(currentUser);
          } catch (e) {
            console.error('App loadUserInfo: problem loading', e);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await ElimibugApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (e) {
      console.error('signup failed', e);
      return { success: false, e };
    }
  }

  async function login(loginData) {
    try {
      let token = await ElimibugApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (e) {
      console.error('login failed', e);
      return { success: false, e };
    }
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser }}>
        <div className="App">
          <Navigation logout={logout} />
          <Routing login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
