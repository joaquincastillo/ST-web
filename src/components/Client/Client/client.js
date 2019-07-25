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

        <div class="container">
          <h2 class="text-left" >Informacion {client.name}</h2>
          <h3 class="text-left" > Contacto </h3>
          <p class="text-left"><big>Email: {client.email} </big></p>
          <p class="text-left"><big>Phone: {client.phone} </big></p>
          <p class="text-left"><big>address: {client.phone} </big></p>
        </div>
      );
    }}
  </Query>
);

const ClientPage = ({session, id}) => {

  // var urlParams = new URLSearchParams(document.location.search)

  return (

      <Client id={id} />
  );
}

export default withSession(ClientPage);
