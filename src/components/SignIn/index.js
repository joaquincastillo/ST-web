import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { SignUpLink } from '../SignUp';
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;

const SignInPage = ({ history, refetch }) => (
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-4">
        <h1>Sign In</h1>
      </div>
    </div>

      <SignInForm history={history} refetch={refetch} />

    <div class="row justify-content-center">
      <div class="col-4">
        <SignUpLink />
      </div>
    </div>
  </div>
);

const INITIAL_STATE = {
  login: '',
  password: '',
};

class SignInForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signIn) => {
    signIn().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signIn.token);

      await this.props.refetch();

      this.props.history.push(routes.CLIENTS);
    });

    event.preventDefault();
  };

  render() {
    const { login, password } = this.state;

    const isInvalid = password === '' || login === '';

    return (
      <Mutation mutation={SIGN_IN} variables={{ login, password }}>
        {(signIn, { data, loading, error }) => (
            <form onSubmit={event => this.onSubmit(event, signIn)}>
              <div class="form-group row  justify-content-center">
                <label class="col-sm-2 col-form-label" for="login">Username o Email</label>
                 <div class="col-sm-4">
                  <input
                    class="form-control"
                    name="login"
                    value={login}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email or Username"
                  />
                </div>
              </div>
              <div class="form-group row  justify-content-center">
                <label class="col-sm-2 col-form-label" for="password">Password</label>
                <div class="col-sm-4">
                <input
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Password"
                />
                </div>
              </div>
              <div class="form-group row  justify-content-end">
               <div class="col-sm-4">
                 <button class="btn btn-primary" disabled={isInvalid || loading} type="submit">
                   Sign In
                 </button>
               </div>
             </div>
            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

export default withRouter(SignInPage);

export { SignInForm };
