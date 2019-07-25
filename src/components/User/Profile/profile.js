import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Route } from "react-router-dom";

import Loading from '../../Loading';
import withSession from '../../Session/withSession';
import isRole from '../../../utils/utils'

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

        <div class="container">
          <h2 class="text-left" >Perfil {user.username}</h2>
          <h3 class="text-left" > Contacto </h3>
          <p class="text-left"><big>Email: {user.email} </big></p>
          <p class="text-left"><big>Phone: {user.phone} </big></p>

          <p class="text-left"><big>Roles</big></p>
          <ul>
            < RolesList roles={user.roles} />
          </ul>
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