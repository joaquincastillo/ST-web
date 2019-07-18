import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import * as routes from '../../../constants/routes';


const GET_PAGINATED_USERS = gql`
  query($cursor: String, $limit: Int!) {
    users(cursor: $cursor, limit: $limit)
      @connection(key: "UserConnection") {
      edges {
        id
        username
        phone
        email
        roles {
          role
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const Users = ({ limit = 100 }) => (
  <Query
    query={GET_PAGINATED_USERS}
    variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen useres
          </div>
        );
      }

      const { users } = data;

      if (loading || !users) {
        return <Loading />;
      }

      const { edges, pageInfo } = users;

      return (
        <Fragment>
          <UserList
            users={edges}
            subscribeToMore={subscribeToMore}
          />

          {pageInfo.hasNextPage && (
            <MoreUsersButton
              limit={limit}
              pageInfo={pageInfo}
              fetchMore={fetchMore}
            >
              More
            </MoreUsersButton>
          )}
        </Fragment>
      );
    }}
  </Query>
);

const MoreUsersButton = ({
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
            users: {
              ...fetchMoreResult.users,
              edges: [
                ...previousResult.users.edges,
                ...fetchMoreResult.users.edges,
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

class UserList extends Component {


  render() {
    const { users } = this.props;

    return users.map(user => (
      <UserItem key={user.id} user={user} />
    ));
  }
}

const UserItemBase = ({ user, session }) => (

  <tr>
    <td><Link to={`${routes.USER}/?id=${user.id}`}>{user.id}</Link></td>
    <td>{user.username}</td>
    <td>{user.email}</td>
    <td>{user.phone}</td>
  </tr>
);

const UserItem = withSession(UserItemBase);

// export default Users;

const UsersPage = ({ session }) => (
  <div class="container justify-content-center">
    <h2>Pagina Usuarios</h2>

      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
          </tr>
        </thead>
        <tbody>

        <Users limit={100} />

      </tbody>
    </table>
  </div>
);

export default withSession(UsersPage);
