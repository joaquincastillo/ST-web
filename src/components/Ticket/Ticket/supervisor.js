import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_ASSIGNATION = gql`
  mutation($id:ID!, $supervisor: ID!) {
    updateSupervisor(id: $id, supervisor: $supervisor) {
    id
      supervisor {
        id
        username
      }
    }
  }
`;

const GET_USERS = gql`
query($role: String!) {
  roleUsers(role: $role) {
    id
    username
  }
}
`;

const Users = ({role}) => (
  <Query
    query={GET_USERS}
    variables={{role}}
  >
    {({ data, loading, error}) => {
      if (!data) {
        return (
          <div>
          </div>
        );
      }

      const { roleUsers } = data


      if (loading || !roleUsers) {
        return (
          <div>
          </div>
        );
      }
      return roleUsers.map(user =>(<option value={user.id} > {user.username} </option>))

    }}
  </Query>
);

class Assignation extends Component {

  constructor(props) {
    super(props)
    const {ticketId} = this.props

    this.state = {
      ticketId: ticketId,
      users: [],
      userId: null
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({userId: event.target.value});
  }

  onSubmit = async (event, updateSupervisor) => {
    event.preventDefault();

    try {
      await updateSupervisor();
    } catch (error) {}
  };

  render() {
    const { ticketId } = this.props;
    const { userId } = this.state;

    return (
      <Mutation
        mutation={CREATE_ASSIGNATION}
        variables={{ supervisor: parseInt(userId), id:ticketId }}
      >
        {(updateSupervisor, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, updateSupervisor)}>
          <div class="form-group">
            <label for="sel1">Select list (select one):</label>
            <select class="form-control" id="sel1" name="sellist1" onChange={this.handleChange}>
              <Users role ={"tecnico"} />
            </select>

          </div>
          {error && <ErrorMessage error={error} />}

          <button disabled= {userId == null } type="submit" class="btn btn-primary">Submit</button>
        </form>

      )}
      </Mutation>
    );
  }
}

export default Assignation;
