import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";
import * as routes from '../../../constants/routes';

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'


const GET_USER_TICKETS = gql`
query($userId:ID!, $cursor: String, $limit: Int!) {
  userTickets(userId:$userId, cursor: $cursor, limit: $limit)
    @connection(key: "TicketConnectionU") {
    edges {
      id
      client {
        name
      }
      type
      service
      priority
      state {
        state
      }
      supervisor {
        username
      }
      assignation {
        username
      }
      createdAt
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

const UserTickets = ({userId, limit = 100 }) => (
  <Query
    query={GET_USER_TICKETS}
    variables={{ limit, userId }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen ticketes
          </div>
        );
      }

      const { userTickets } = data;

      if (loading || !userTickets) {
        return <Loading />;
      }

      const { edges, pageInfo } = userTickets;

      return (
        <Fragment>
          <TicketList
            user_tickets={userTickets.edges}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
            <MoreTicketsButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              More
            </MoreTicketsButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const MoreTicketsButton = ({
  limit,
  pageInfo,
  fetchMore,
  children,
}) => (
  <button
    type="button"
    onClick={() =>
      fetchMore({
        variables: {
          cursor: pageInfo.endCursor,
          limit,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          return {
            tickets: {
              ...fetchMoreResult.tickets,
              edges: [
                ...previousResult.tickets.edges,
                ...fetchMoreResult.tickets.edges,
              ],
            },
          };
        },
      })
    }
  >
    {children}
  </button>
);

class TicketList extends Component {

  render() {
    const { user_tickets } = this.props;

    return user_tickets.map(ticket => (
      <UserTicketItem key={ticket.id} ticket={ticket} />
    ));
  }
}

const UserTicketItemBase = ({ ticket, session }) => (

  <tr>
    <td><Link to={{pathname :`${routes.TICKETS}/${ticket.id}`, ticketId: ticket.id}}>{ticket.id}</Link></td>
    <td>{ticket.client.name}</td>
    <td>{ticket.type}</td>
    <td>{ticket.service}</td>
    <td>{ticket.priority}</td>
    <td>{ticket.state.state}</td>
    {ticket.supervisor ? (
      <td>{ticket.supervisor.username}</td>
    ) : (
      <td>por asignar</td>
    )}

    {ticket.assignation ? (
      <td>{ticket.assignation.username}</td>
    ) : (
      <td>por asignar</td>
    )}
    <td>{ticket.createdAt}</td>
  </tr>
);

const UserTicketItem = withSession(UserTicketItemBase);

// export default Tickets;

const UserTicketsPage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (
    <div class="container justify-content-center">
      <h2>Tickets Del Usuario</h2>

        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Cliente</th>
              <th scope="col">Tipo</th>
              <th scope="col">Servicio</th>
              <th scope="col">Prioridad</th>
              <th scope="col">Estado</th>
              <th scope="col">Supervisor</th>
              <th scope="col">Tecnico</th>
              <th scope="col">Fecha Creacion</th>
            </tr>
          </thead>
          <tbody>

          <UserTickets limit={30} userId={id}/>

        </tbody>
      </table>
    </div>
  );
}

// const UserTicketsPage = ({session}) => (
//   <h2>Ticketes Del Usuario</h2>
// );

export default  withSession(UserTicketsPage);
