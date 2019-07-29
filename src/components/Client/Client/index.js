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


      <div class="container-fluid">
        <div class="row">
        <div class="col-4">
          <ClientPage id={clientId} />
        </div>

        <div class="col-8">

          <ul class="nav nav-pills nav-justified my-5 mr-5">

            <li class="nav-item">
              <a class="nav-link active" href="#users" role="tab" data-toggle="tab">Usuarios</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#tickets" role="tab" data-toggle="tab">Tickets</a>
            </li>
          </ul>

          <div class="tab-content">

            <div role="tabpanel"  class="tab-pane active" id="users">
              <Users id={clientId} />
            </div>

            <div role="tabpanel" class="tab-pane fade" id="tickets">
              <Tickets id={clientId} />
            </div>
          </div>

        </div>
      </div>
    </div>
    );
  }
}

export default withSession(Client);
