import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from '../../Error';

const CREATE_ASSIGNATION = gql`
  mutation($date:String!, $id: ID!) {
    updateDate(date: $date, id: $id) {
      id
      datetime
    }
  }
`;


class Assignation extends Component {

  constructor(props) {
    super(props)
    const {ticketId} = this.props

    this.state = {
      ticketId: ticketId,
      users: [],
      date: ""
    }

    // this.handleChange = this.handleChange.bind(this);
  }

  onChange = event => {
    this.setState({date: event.target.value});
  }

  onSubmit = async (event, updateDate) => {
    event.preventDefault();

    try {
      await updateDate();
    } catch (error) {}
  };

  render() {
    const { ticketId } = this.props;
    const { date } = this.state;

    return (
      <Mutation
        mutation={CREATE_ASSIGNATION}
        variables={{ date: date, id:ticketId }}
      >
        {(updateDate, { data, loading, error }) => (
          <form onSubmit={event => this.onSubmit(event, updateDate)}>
          <div class="form-group">
          <label for="sel1">Fecha en formato 2019-06-12T19:30</label>
          <input type="text" class="form-control" placeholder="2019-06-12T19:30" onChange={this.onChange}/>

          </div>
          {error && <ErrorMessage error={error} />}

          <button disabled={date == "" } type="submit" class="btn btn-primary">Submit</button>
        </form>

      )}
      </Mutation>
    );
  }
}

export default Assignation;
