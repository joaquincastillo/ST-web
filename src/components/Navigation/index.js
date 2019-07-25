import React from 'react';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOut';
import isRole from '../../utils/utils'

const Navigation = ({ session }) => (
  <div>
    {session && session.me ? (
      <NavigationAuth session={session} />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

const NavigationAuth = ({ session }) => (
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href={routes.LANDING}>Landing</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="nav-link" href={routes.ACCOUNT} >Account ({session.me.username})</a>
        </li>
        {session && session.me && (!isRole(session, 'cliente') || session.me.roles.length > 1)  && (
          <li class="nav-item">
            <a class="nav-link" href={routes.CLIENTS} > Clientes </a>
          </li>
        )}
        {session && session.me && (!isRole(session, 'cliente') || session.me.roles.length > 1) && (
          <li class="nav-item">
            <a class="nav-link" href={routes.TICKETS} > Tickets </a>
          </li>
        )}

        {session && session.me && (!isRole(session, 'cliente') || session.me.roles.length > 1) && (
          <li class="nav-item">
            <a class="nav-link" href={routes.USERS} > Usuarios </a>
          </li>
        )}
      </ul>

      <ul class="navbar-nav ml-auto">
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  </nav>
);

const NavigationNonAuth = () => (
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href={routes.LANDING}>Landing</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a class="nav-link" href={routes.SIGN_IN} > Sing In </a>
      </li>
      </ul>
    </div>
  </nav>
);

export default Navigation;
