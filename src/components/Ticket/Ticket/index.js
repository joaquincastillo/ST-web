import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

// import ClientPage from './client';
import TicketPage from './ticket';

class Ticket extends Component {

  render (){
    const { match } = this.props
    const { ticketId } = this.props.match.params
    // const id = match.params.userId

    return (

      <div>

        <TicketPage id={ticketId} />

      </div>
    );
  }
}

export default withSession(Ticket);
