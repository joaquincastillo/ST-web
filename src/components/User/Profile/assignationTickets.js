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
  userAssignations(userId:$userId cursor: $cursor, limit: $limit)
    @connection(key: "AssignationConnection") {
    edges {
      id
      active
      ticket {
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
        owner {
          username
        }
        supervisor {
          username
        }
        createdAt
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

const AssignedTickets = ({userId, limit = 100 }) => (
  <Query
    query={GET_USER_TICKETS}
    variables={{ limit, userId }}
    fetchPolicy='no-cache'
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen ticketes assignados
          </div>
        );
      }

      const { userAssignations } = data;

      if (loading || !userAssignations) {
        return <Loading />;
      }

      const { edges, pageInfo } = userAssignations;

      return (
        <Fragment>
          <TicketList
            tickets={userAssignations.edges}
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
    const { tickets } = this.props;

    return tickets.map(ticket => (
      <AssignedTicketItem key={ticket.id} ticket={ticket.ticket} />
    ));
  }
}

const AssignedTicketItemBase = ({ ticket, session }) => (

  <tr>
    <td><Link to={{pathname :`${routes.TICKETS}/${ticket.id}`, ticketId: ticket.id}}>{ticket.id}</Link></td>
    <td>{ticket.client.name}</td>
    <td>{ticket.type}</td>
    <td>{ticket.service}</td>
    <td>{ticket.priority}</td>
    <td>{ticket.state.state}</td>
    {ticket.supervisor.username ? (
      <td>{ticket.supervisor.username}</td>
    ) : (
      <td>por asignar</td>
    )}
    <td>{ticket.owner.username}</td>
    <td>{ticket.createdAt}</td>
  </tr>
);

const AssignedTicketItem = withSession(AssignedTicketItemBase);

// export default Tickets;

const AssignedTicketsPage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (
    <div class="container justify-content-center">
      <h2>Tickets Asignados</h2>

        <table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Cliente</th>
              <th scope="col">Tipo</th>
              <th scope="col">Servicio</th>
              <th scope="col">Prioridad</th>
              <th scope="col">Estado</th>
              <th scope="col">Supervisor</th>
              <th scope="col">Dueño</th>
              <th scope="col">Fecha Creacion</th>
            </tr>
          </thead>
          <tbody>

          <AssignedTickets limit={30} userId={id}/>

        </tbody>
      </table>
    </div>
  );
}

export default withSession(AssignedTicketsPage);
