import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'
import { MessageCreate, Messages } from '../../Message';
import * as routes from '../../../constants/routes';

const GET_TICKET = gql`
  query($id: ID!) {
    ticket(id: $id) {
      id
      type
      priority
      description
      datetime
      service
      signature{
        id
        signature
      }
      client{
        id
        name
      }
      chat{
        id
      }
      supervisor{
        username
        id
      }
      assignation{
        username
        id
      }
      owner{
        id
        username
      }
      createdAt
      state {
        id
        state
      }
    }
  }
`;

const Ticket = ({ id, session }) => (
  <Query
    query={GET_TICKET}
    variables={{ id }}
  >
    {({ loading, error, data }) => {

      if (loading ) {
        return <Loading />;
      }

      if (error) return `Error! ${error.message}`;

      if (!data) {
        return (
          <div>
            Ticket no encontrado
          </div>
        );
      }

      const { ticket } = data;

      return (

        <div class="container">
          <h2 class="text-left" >Ticket {ticket.id}</h2>
          <h3 class="text-left" > Informacion: </h3>
          <p class="text-left"><big>Tipo: {ticket.type} </big></p>
          <p class="text-left"><big>Prioridad: {ticket.priority} </big></p>
          <p class="text-left"><big>Servicio: {ticket.service} </big></p>
          <p class="text-left"><big>Descripcion: {ticket.description} </big></p>
          <p class="text-left"><big>Estado: {ticket.state.state} </big></p>
          <p class="text-left"><big>Cliente: {ticket.client.name} </big></p>
          <p class="text-left"><big>Usuario: {ticket.owner.username} </big></p>

          <p class="text-left"><big>Creacion: {ticket.createdAt} </big></p>
          {ticket.datetime ? (
            <p class="text-left"><big>Visita Coordinada: {ticket.datetime} </big></p>
          ) : (
            <p class="text-left"><big>Visita Coordinada: No Coordinada </big></p>
          )}

          {ticket.supervisor ? (
            <p class="text-left"><big>Supervisor: {ticket.supervisor.username} </big></p>
          ) : (
            <p class="text-left"><big>Supervisor: No asignado </big></p>
          )}

          {ticket.assignation ? (
            <p class="text-left"><big>Tecnico: {ticket.assignation.username} </big></p>
          ) : (
            <p class="text-left"><big>Tecnico: No asignado </big></p>
          )}

          <h2 class="text-left" ><Link to={{pathname :`${routes.CHAT}/${ticket.chat.id}`, chatId: ticket.chat.id}}>Mensajes del ticket</Link></h2>

        </div>
      );
    }}
  </Query>
);

const TicketPage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (

      <Ticket id={id} session={session} />
  );
}

export default withSession(TicketPage);
