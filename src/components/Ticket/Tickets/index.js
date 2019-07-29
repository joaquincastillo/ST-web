import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route, Link } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import * as routes from '../../../constants/routes';


const GET_PAGINATED_TICKETS = gql`
  query($cursor: String, $limit: Int!) {
    tickets(cursor: $cursor, limit: $limit)
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
          id
        }
        owner {
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

const GET_STATES = gql`
  query{
    states{
      id
      state
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
    const {states} = this.props
    const {tickets} = this.props

    this.state = {
      states: [],
      tickets: []
    }

  states.map(state => {
    this.state.states.push({id:states.id, value: state.state, isChecked: true})
  })

  tickets.map(ticket => {
    this.state.tickets.push({id:ticket.id, value: ticket, visible: true})
  })
  }

  handleAllChecked = (event) => {
    let states = this.state.states
    let tickets = this.state.tickets
    states.forEach(state => states.isChecked = event.target.checked)
    tickets.forEach(ticket => ticket.visible = event.target.checked)
    this.setState({states:states, tickets:tickets})
  }

  handleCheckChieldElement = (event) => {
    let states = this.state.states
    let tickets = this.state.tickets
    states.forEach(state => {
       if (state.value === event.target.value) {
         state.isChecked =  event.target.checked
       }
    })

    let check = states.filter(state => state.isChecked)

    tickets.forEach(ticket => {
      ticket.visible = false
      check.forEach(state => {
        if (ticket.value.state.state == state.value){
          ticket.visible = true
        }
      })
    })

    this.setState({states:states, tickets:tickets})
  }


  render() {
    return (
      <div class="row">
        <div class="col-3 my-5">
          <div class="card bg-light shadow mx-5">
            <div class="card-header">
                <h4 class="card-title">Estados de Tickets</h4>
            </div>
            <div class="card-body">
              <ul>
              {
                this.state.states.map((state, index) => {
                  return (<CheckBox key={index} handleCheckChieldElement={this.handleCheckChieldElement}  {... state} />)
                })
              }
              </ul>
            </div>
          </div>
        </div>

        <div class="col-8">
            <h4 class="mt-4"> Tickets Encontrados</h4>

            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Dueño</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Prioridad</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha Creacion</th>
                </tr>
              </thead>
              <tbody>
              <TicketList
                tickets={this.state.tickets.filter(ticket => ticket.visible)}
              />
              </tbody>
            </table>

        </div>
      </div>
    );
  }
}

const States = () => (
  <Query
    query={GET_STATES}
  >
    {({ data, loading, error, fetchMore}) => {
      if (!data) {
        return (
          <div>
            Todavia no existen estados
          </div>
        );
      }

      const { states } = data


      if (loading || !states) {
        return <Loading />;
      }


      return (
        <div container-fluid>
          <TicketsPage states={states} />
        </div>
      );

    }}
  </Query>
);


const Tickets = ({ states, limit = 100 }) => (
  <Query
    query={GET_PAGINATED_TICKETS}
    variables={{ limit }}
  >
    {({ data, loading, error, fetchMore, subscribeToMore }) => {
      if (!data) {
        return (
          <div>
            Todavia no existen ticketes
          </div>
        );
      }

      const { tickets } = data;

      if (loading || !tickets) {
        return <Loading />;
      }

      const { edges, pageInfo } = tickets;

      return (
        <Fragment>

          <Check states={states} tickets={edges}/>

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
    <td>{ticket.value.client.name}</td>
    <td>{ticket.value.owner.username}</td>
    <td>{ticket.value.type}</td>
    <td>{ticket.value.service}</td>
    <td>{ticket.value.priority}</td>
    <td>{ticket.value.state.state}</td>
    <td>{ticket.value.createdAt}</td>
  </tr>
);

const TicketItem = withSession(TicketItemBase);

// export default Tickets;

const TicketsPage = ({ states, session }) => (
  <div >

    <Tickets states={states} limit={100}  />
  </div>
);

export default withSession(States);
