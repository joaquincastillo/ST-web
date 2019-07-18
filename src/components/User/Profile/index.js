import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

import ProfilePage from './profile';
import UserTicketsPage  from './userTickets';
import AssignedTicketsPage  from './assignationTickets';

const Profile = ({ session }) => (
  <div>

    <ProfilePage />
    <UserTicketsPage />
    <AssignedTicketsPage />

  </div>
);

export default withSession(Profile);
