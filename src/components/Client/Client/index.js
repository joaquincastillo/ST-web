import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

import ClientPage from './client';
import Users from './users';
import Tickets from './tickets';
// import UserTicketsPage  from './userTickets';
// import AssignedTicketsPage  from './assignationTickets';
// import SupervisedTicketsPage  from './supervisorTickets';

class Client extends Component {

  render (){
    const { match } = this.props
    const { clientId } = this.props.match.params
    // const id = match.params.userId

    return (

      <div>

      <ClientPage id={clientId} />
      <Users id={clientId} />
      <Tickets id={clientId} />

      </div>
    );
  }
}

export default withSession(Client);
