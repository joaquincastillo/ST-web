import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'
import hasRole from '../../../utils/userRoles'

import ProfilePage from './profile';
import UserTicketsPage  from './userTickets';
import AssignedTicketsPage  from './assignationTickets';
import SupervisedTicketsPage  from './supervisorTickets';

class Profile extends Component {

  render (){
    const { match } = this.props
    const { userId } = this.props.match.params
    // const id = match.params.userId

    return (

      <div>

      <ProfilePage id={userId} />
      <UserTicketsPage id={userId} />
      <AssignedTicketsPage id={userId}/>
      <SupervisedTicketsPage id={userId}/>

      </div>
    );
  }
}


export default withSession(Profile);
