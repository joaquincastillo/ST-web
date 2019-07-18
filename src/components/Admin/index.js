import React from 'react';

import withAuthorization from '../Session/withAuthorization';

import isRole from '../../utils/utils'

const AdminPage = () => (
  <div>
    <h1>Admin Page</h1>
  </div>
);

export default withAuthorization(
  session => session && session.me && isRole(session, "admin"),
)(AdminPage);
