import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

import UserTicketsPage  from './userTickets';
import AssignedTicketsPage  from './assignationTickets';
import SupervisedTicketsPage  from './supervisorTickets';

const GET_USER = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      username
      email
      phone
      roles {
        role
      }
    }
  }
`;

const User = ({ id }) => (
  <Query
    query={GET_USER}
    variables={{ id }}
    fetchPolicy='no-cache'
  >
    {({ data, loading, error }) => {
      if (!data) {
        return (
          <div>
            Usuario no encontrado
          </div>
        );
      }

      const { user } = data;

      if (loading || !user) {
        console.log(data)
        return <Loading />;
      }

      return (

        <div class="container-fluid">
          <div class="row">
            <div class="col-4">
            <div class="card bg-light shadow m-5">
              <div class="card-header">
                  <h4 class="card-title">{user.username}</h4>
              </div>
              <div class="card-body">
                <p class="card-text">Email: {user.email}</p>
                <p class="card-text">Phone: {user.phone}</p>

                <p class="card-text"><big>Roles</big></p>
                <ul>
                  < RolesList roles={user.roles} />
                </ul>
              </div>
            </div>

          </div>

          <div class="col-8">

            <ul class="nav nav-pills nav-justified my-5 mr-5">

              {isRole(user, "cliente") &&

                <li class="nav-item">
                  <a class="nav-link active" href="#userTickets" role="tab" data-toggle="tab">Tickets Usuario</a>
                </li>
              }

              {isRole(user, "supervisor") &&

                <li class="nav-item">
                  <a class="nav-link active" href="#supervised" role="tab" data-toggle="tab">Tickes Supervisados</a>
                </li>
              }

              {isRole(user, "tecnico") &&

                <li class="nav-item">
                  <a class="nav-link" href="#assigned" role="tab" data-toggle="tab">Tickes Asignados</a>
                </li>
              }
            </ul>

            <div class="tab-content">

            { isRole(user, "cliente") &&

                <div role="tabpanel"  class="tab-pane active" id="userTickets">
                  < UserTicketsPage id={id} />
                </div>
            }

            { isRole(user, "supervisor") &&
              <div role="tabpanel"  class="tab-pane active" id="supervised">
                < SupervisedTicketsPage id={id} />
              </div>
            }

            { isRole(user, "tecnico") &&
              <div role="tabpanel" class="tab-pane fade" id="assigned">
                < AssignedTicketsPage id={id} />
              </div>
            }
            </div>

          </div>
        </div>
      </div>
      );
    }}
  </Query>
);

const RolesList = ({roles}) =>  {

    return roles.map(role => (
      <li>{role.role}</li>
    ));
}


const ProfilePage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (

      <User id={id} />
  );
}

export default withSession(ProfilePage);
