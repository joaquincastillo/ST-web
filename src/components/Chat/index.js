import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../Loading';
import withSession from '../Session/withSession';
// import isRole from '../utils/utils'

import { MessageCreate, Messages } from '../Message';
// import UserTicketsPage  from './userTickets';
// import AssignedTicketsPage  from './assignationTickets';
// import SupervisedTicketsPage  from './supervisorTickets';

class Chat extends Component {

  render (){
    const { match } = this.props
    const { session } = this.props
    const { chatId } = this.props.match.params
    // const id = match.params.userId

    return (

      <div class="container">

      <h2>Chat</h2>

      {session && session.me && <MessageCreate chatId={chatId} />}
      <Messages limit={20} chatId={chatId} />

      </div>
    );
  }
}

export default withSession(Chat);
