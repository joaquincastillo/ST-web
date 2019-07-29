import React from 'react';

import withSession from '../Session/withSession';
import withAuthorization from '../Session/withAuthorization';
import ProfilePage from '../User/Profile/profile';
import UserTicketsPage  from '../User/Profile/userTickets';
import AssignedTicketsPage  from '../User/Profile/assignationTickets';


const AccountPage = ({session}) => (
  <div>
    <ProfilePage id={session.me.id} />
  </div>
);

export default withAuthorization(session => session && session.me)(
  withSession(AccountPage),
);
