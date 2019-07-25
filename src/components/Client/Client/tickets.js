import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";
import * as routes from '../../../constants/routes';

import Loading from '../../Loading';
import withSession from '../../Session/withSession';


const GET_PAGINATED_TICKETS = gql`
query($id:ID!, $cursor: String, $limit: Int!) {
  clientTickets(id:$id, cursor: $cursor, limit: $limit)
      @connection(key: "TicketConnection") {
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
        owner {
          username
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

const Tickets = ({ id, limit = 100 }) => (
  <Query
    query={GET_PAGINATED_TICKETS}
    variables={{ limit, id }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen ticketes
          </div>
        );
      }

      const { clientTickets } = data;

      if (loading || !clientTickets) {
        return <Loading />;
      }

      const { edges, pageInfo } = clientTickets;

      return (
        <Fragment>
          <TicketList
            tickets={edges}
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
      <TicketItem key={ticket.id} ticket={ticket} />
    ));
  }
}

const TicketItemBase = ({ ticket, session }) => (

  <tr>
    <td><Link to={{pathname :`${routes.TICKETS}/${ticket.id}`, ticketId: ticket.id}}>{ticket.id}</Link></td>
    <td>{ticket.owner.username}</td>
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

const TicketItem = withSession(TicketItemBase);

// export default Tickets;

const ClientTicketsPage = ({ session, id }) => (
  <div class="container justify-content-center">
    <h2>Tickets del cliente</h2>

      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Dueño</th>
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

        <Tickets limit={100} id={id} />

      </tbody>
    </table>
  </div>
);

export default withSession(ClientTicketsPage);
