import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

const GET_CLIENT = gql`
  query($id: ID!) {
    client(id: $id) {
      id
      name
      email
      phone
      address
    }
  }
`;

const Client = ({ id }) => (
  <Query
    query={GET_CLIENT}
    variables={{ id }}
    fetchPolicy='no-cache'
  >
    {({ data, loading, error }) => {
      if (!data) {
        return (
          <div>
            cliente no encontrado
          </div>
        );
      }

      const { client } = data;

      if (loading || !client) {
        console.log(data)
        return <Loading />;
      }

      return (

        <div class="card bg-light shadow mx-5">
          <div class="card-header">
              <h4 class="card-title">{client.name}</h4>
          </div>
          <div class="card-body">
            <p class="card-text">Email: {client.email}</p>
            <p class="card-text">Direccion: {client.address}</p>
            <p class="card-text">Telefono: {client.phone}</p>
          </div>
        </div>
      );
    }}
  </Query>
);

const ClientPage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (

    <div>

        <h2 class="ml-5 my-5">Informacion de Contacto</h2>
        <Client id={id} />

    </div>
  );
}

export default withSession(ClientPage);
