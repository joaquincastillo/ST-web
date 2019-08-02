import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import * as routes from '../../../constants/routes';


const GET_PAGINATED_USERS = gql`
  query($id: ID!,$cursor: String, $limit: Int!) {
    clientUsers(id: $id, cursor: $cursor, limit: $limit)
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

const Users = ({ id, limit = 100 }) => (
  <Query
    query={GET_PAGINATED_USERS}
    variables={{ limit, id }}
    fetchPolicy='no-cache'
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen Usuarios
          </div>
        );
      }

      const { clientUsers } = data;

      if (loading || !clientUsers) {
        return <Loading />;
      }

      const { edges, pageInfo } = clientUsers;

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
    const { match } = this.props

    return users.map(user => (
      <UserItem key={user.id} user={user} />
    ));
  }
}

const UserItemBase = ({ user, session }) => (
  <div class="card bg-light shadow">
    <div class="card-header">
      <Link to={{pathname :`${routes.USERS}/${user.id}`, userId: user.id}}>
        <h4 class="card-title">{user.username}</h4>
      </Link>
    </div>
    <div class="card-body">
      <p class="card-text">Email: {user.email}</p>
      <p class="card-text">Phone: {user.phone}</p>
    </div>
  </div>
);

const UserItem = withSession(UserItemBase);

// export default Users;

const UsersPage = ({ session, id }) => (
  <div>

    <div class="card-deck my-5 mr-5">
      <Users limit={100} id={id} />
    </div>

  </div>
);

export default withSession(UsersPage);
