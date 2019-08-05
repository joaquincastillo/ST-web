import React, { Component, Fragment } from 'react';
import { Route, Link } from "react-router-dom";
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import * as routes from '../../../constants/routes';


const GET_PAGINATED_CLIENTS = gql`
  query($cursor: String, $limit: Int!) {
    clients(cursor: $cursor, limit: $limit)
      @connection(key: "ClientConnection") {
      edges {
        id
        name
        address
        email
        phone
        createdAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const Clients = ({ limit = 100 }) => (
  <Query
    query={GET_PAGINATED_CLIENTS}
    variables={{ limit }}
    pollInterval={10000}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen clientes
          </div>
        );
      }

      const { clients } = data;

      if (loading || !clients) {
        return <Loading />;
      }

      const { edges, pageInfo } = clients;

      return (
        <Fragment>
          <ClientList
            clients={edges}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
            <MoreClientsButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              More
            </MoreClientsButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const MoreClientsButton = ({
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
            clients: {
              ...fetchMoreResult.clients,
              edges: [
                ...previousResult.clients.edges,
                ...fetchMoreResult.clients.edges,
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

class ClientList extends Component {

  render() {
    const { clients } = this.props;

    return clients.map(client => (
      <ClientItem key={client.id} client={client} />

    ));
  }
}

const ClientItemBase = ({ client, session }) => (
  <div class="card bg-light shadow">
    <div class="card-header">
      <Link to={{pathname :`${routes.CLIENTS}/${client.id}`, clientId: client.id}}>
        <h4 class="card-title">{client.name}</h4>
      </Link>
    </div>
    <div class="card-body">
      <p class="card-text">Email: {client.email}</p>
      <p class="card-text">Direccion: {client.address}</p>
      <p class="card-text">Telefono: {client.phone}</p>
    </div>
  </div>
);

const ClientItem = withSession(ClientItemBase);

// export default Clients;

const ClientsPage = ({ session }) => (

  <div class="container-fluid">
    <h2  class="text-center mt-5">Clientes</h2>

    <div class="card-deck px-5 m-5 my-2">
      <Clients limit={30} />
    </div>
  </div>
);

export default withSession(ClientsPage);
