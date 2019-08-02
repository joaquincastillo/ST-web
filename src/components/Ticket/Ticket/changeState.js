import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_ASSIGNATION = gql`
  mutation($stateId:ID!, $id: ID!) {
    updateState(id: $id, stateId: $stateId) {
      id
      state {
        id
        state
      }
    }
  }
`;

const GET_STATES = gql`
  query{
    states{
      id
      state
    }
  }
`;

const States = () => (
  <Query
    query={GET_STATES}
  >
    {({ data, loading, error}) => {
      if (!data) {
        return (
          <div>
          </div>
        );
      }

      const { states } = data


      if (loading || !states) {
        return (
          <div>
          </div>
        );
      }
      return states.map(state =>(<option value={state.id} > {state.state} </option>))

    }}
  </Query>
);

class Assignation extends Component {

  constructor(props) {
    super(props)
    const {ticketId} = this.props

    this.state = {
      ticketId: ticketId,
      stateId: null
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({stateId: event.target.value});
  }

  onSubmit = async (event, updateState) => {
    event.preventDefault();

    try {
      await updateState();
    } catch (error) {}
  };

  render() {
    const { ticketId } = this.props;
    const { stateId } = this.state;

    return (
      <Mutation
        mutation={CREATE_ASSIGNATION}
        variables={{ stateId: parseInt(stateId), id:ticketId }}
      >
        {(updateState, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, updateState)}>
          <div class="form-group">
            <label for="sel1">Select list (select one):</label>
            <select class="form-control" id="sel1" name="sellist1" onChange={this.handleChange}>
              < States />
            </select>

          </div>
          {error && <ErrorMessage error={error} />}

          <button disabled={stateId == null } type="submit" class="btn btn-primary">Submit</button>
        </form>

      )}
      </Mutation>
    );
  }
}

export default Assignation;
