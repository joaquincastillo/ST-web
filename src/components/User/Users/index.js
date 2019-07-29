import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import * as routes from '../../../constants/routes';
import isRole from '../../../utils/utils'
import hasRole from '../../../utils/userRoles'


const GET_PAGINATED_USERS = gql`
  query($roles:[ID]!, $cursor: String, $limit: Int!) {
    usersRole(roles: $roles, cursor: $cursor, limit: $limit)
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

const GET_ROLES = gql`
  query{
    roles{
      id
      role
    }
  }
`;

export const CheckBox = props => {
    return (
      <li>
       <input key={props.id} onChange={props.handleCheckChieldElement} type="checkbox" checked={props.isChecked} value={props.value} /> {props.value}
      </li>
    )
}


class Check extends Component {
  constructor(props) {
    super(props)
    const {roles} = this.props
    const {users} = this.props
    this.state = {
      roles: [],
      users: []
    }

  roles.map(role => {
    this.state.roles.push({id:role.id, value: role.role, isChecked: true})
  })

  users.map(user => {
    this.state.users.push({id:user.id, value: user, visible: true})
  })
  }

  handleAllChecked = (event) => {
    let roles = this.state.roles
    let users = this.state.users
    roles.forEach(role => role.isChecked = event.target.checked)
    users.forEach(user => user.visible = event.target.checked)
    this.setState({roles: roles, users:users})
  }

  handleCheckChieldElement = (event) => {
    let roles = this.state.roles
    let users = this.state.users
    roles.forEach(role => {
       if (role.value === event.target.value) {
         role.isChecked =  event.target.checked
       }
    })

    let check = roles.filter(role => role.isChecked)

    users.forEach(user => {
      user.visible = false
      check.forEach(role => {
        if (isRole(user.value, role.value)){
          user.visible = true
        }
      })
    })

    this.setState({roles: roles, users:users})
  }


  render() {
    return (
      <div class="row">
        <div class="col-3 my-5">
          <div class="card bg-light shadow mx-5">
            <div class="card-header">
                <h4 class="card-title">Roles de Usuario</h4>
            </div>
            <div class="card-body">
              <ul>
              {
                this.state.roles.map((role, index) => {
                  return (<CheckBox key={index} handleCheckChieldElement={this.handleCheckChieldElement}  {... role} />)
                })
              }
              </ul>
            </div>
          </div>
        </div>

        <div class="col-8">
            <h4 class="mt-4"> Usuarios Encontrados</h4>

            <div class="card-columns">
              <UserList
                users={this.state.users.filter(user => user.visible)}
              />
            </div>
        </div>

      </div>
    );
  }
}


const Roles = () => (
  <Query
    query={GET_ROLES}
  >
    {({ data, loading, error, fetchMore}) => {
      if (!data) {
        return (
          <div>
            Todavia no existen roles
          </div>
        );
      }

      const { roles } = data


      if (loading || !roles) {
        return <Loading />;
      }



      const filter_roles = roles.filter(role =>  role.role != "cliente" && role.role != "bot");
      const ids = filter_roles.map(role => role.id)


      return (
        <div container-fluid>
          <UsersPage roles={ids} rolesFull={filter_roles} />
        </div>
      );

    }}
  </Query>
);

const Users = ({ rolesFull, roles, limit = 100 }) => (
  <Query
    query={GET_PAGINATED_USERS}
    variables={{ roles, limit }}
  >
    {({ data, loading, error, fetchMore}) => {
      if (!data) {
        return (
          <div>
            Todavia no existen useres
          </div>
        );
      }

      const { usersRole } = data;

      if (loading || !usersRole) {
        return <Loading />;
      }

      const { edges, pageInfo } = usersRole;

      return (
        <Fragment>
        <Check roles={rolesFull} users={edges}/>


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
        <h4 class="card-title">{user.value.username}</h4>
      </Link>
    </div>
    <div class="card-body">
      <p class="card-text">Email: {user.value.email}</p>
      <p class="card-text">Phone: {user.value.phone}</p>
    </div>
  </div>

);

const UserItem = withSession(UserItemBase);

// export default Users;

const UsersPage = ({ roles, rolesFull, session }) => (
  <div >

        <Users limit={100} roles={roles} rolesFull={rolesFull}/>

  </div>
);

export default withSession(Roles);
