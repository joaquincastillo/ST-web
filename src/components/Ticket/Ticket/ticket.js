import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'
import { MessageCreate, Messages } from '../../Message';
import * as routes from '../../../constants/routes';

import Assignation from './assignation';
import Supervisor from './supervisor';
import Dateform from './datetime';
import ChangeState from './changeState'

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
    fetchPolicy='no-cache'
    pollInterval={2000}
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

        <div class="container-flex">

          <div class="row">
            <div class="col-4">
              <div class="card bg-light shadow m-5">
              <div class="card-header">
                  <h4 class="card-title">Ticket {ticket.id}</h4>
              </div>
                <div class="card-body">

                  <p class="card-text"><big>Tipo: {ticket.type} </big></p>
                  <p class="card-text"><big>Prioridad: {ticket.priority} </big></p>
                  <p class="card-text"><big>Servicio: {ticket.service} </big></p>
                  <p class="card-text"><big>Descripcion: {ticket.description} </big></p>
                  <p class="card-text"><big>Estado: {ticket.state.state} </big></p>
                  <p class="card-text"><big>Cliente: {ticket.client.name} </big></p>
                  <p class="card-text"><big>Usuario: {ticket.owner.username} </big></p>

                  <p class="card-text"><big>Creacion: {ticket.createdAt} </big></p>
                  {ticket.datetime ? (
                    <p class="card-text"><big>Visita Coordinada: {ticket.datetime} </big></p>
                  ) : (
                    <p class="card-text"><big>Visita Coordinada: No Coordinada </big></p>
                  )}

                  {ticket.supervisor ? (
                    <p class="card-text"><big>Supervisor: {ticket.supervisor.username} </big></p>
                  ) : (
                    <p class="card-text"><big>Supervisor: No asignado </big></p>
                  )}

                  {ticket.assignation ? (
                    <p class="card-text"><big>Tecnico: {ticket.assignation.username} </big></p>
                  ) : (
                    <p class="card-text"><big>Tecnico: No asignado </big></p>
                  )}
                </div>
              </div>

              <div class="card bg-light shadow m-5">
                <div class="card-header">
                    <h4 class="card-title">Acciones</h4>
                </div>

                <div class="card-body">

                <button type="button" class="btn btn-primary  btn-block" data-toggle="modal" data-target="#supervisor">
                  Assignar Supervidor
                </button>

                <button type="button" class="btn btn-primary  btn-block" data-toggle="modal" data-target="#tecnico">
                  Assignar Tecnico
                </button>

                <button type="button" class="btn btn-primary  btn-block" data-toggle="modal" data-target="#datetime">
                  Coordinar visita
                </button>

                <button type="button" class="btn btn-primary  btn-block" data-toggle="modal" data-target="#state">
                  Cambiar Estado
                </button>

                <div class="modal fade" id="tecnico">
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h4 class="modal-title">Crear Asignacion</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div class="modal-body">
                        <Assignation ticketId={ticket.id} />
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="supervisor">
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h4 class="modal-title">Asignar Supervisor</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div class="modal-body">
                        <Supervisor ticketId={ticket.id} />
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="datetime">
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h4 class="modal-title">Coordinar Visita</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div class="modal-body">
                        <Dateform  ticketId={ticket.id} />
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="state">
                  <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h4 class="modal-title">Cambiar Estado</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                      </div>
                      <div class="modal-body">
                        <ChangeState  ticketId={ticket.id} />
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div class="card bg-light shadow m-5">
              <div class="card-header">
                  <h4 class="card-title">Firma Cliente</h4>
              </div>

              <div class="card-body">

                {ticket.signature ? (  <img src= {ticket.signature.signature} />) : (<p class="card-text"><big> No hay firma </big></p> )}

              </div>

            </div>

          </div>
          <div class="col-8">
            <div class="container bg-light shadow m-5">
              <h4 class="card-title">Mensajes</h4>
            <Messages limit={100} chatId={ticket.chat.id} />
            {session && session.me && ticket.supervisor && session.me.id == ticket.supervisor.id  && <MessageCreate chatId={ticket.chat.id} />}
            </div>
            </div>
          </div>
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
