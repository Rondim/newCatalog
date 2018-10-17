/**
 * Created by xax on 23.02.2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import query from './queries/CurentUser.graphql';
import mutation from './mutations/SigninUser.graphql';
import Loading from '../../components/Loading';
import {
  withRouter
} from 'react-router-dom';
import { Button, Alert, Input, Form, FormGroup, Label } from 'reactstrap';

class Signin extends Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  state = {
    email: '',
    password: '',
    errors: []
  };

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      this.props.history.push('/');
    }
  }

  signinUser = async (ev) => {
    ev.preventDefault();
    const { email, password } = this.state;
    try {
      const response = await this.props.mutate({
        variables: { email, password }
      });
      this.setState({ errors: [] });
      localStorage.setItem('token', response.data.login.token);
      this.props.history.push('/');
    } catch (res) {
      const errors = res.graphQLErrors.map(err => err.message);
      this.setState({ errors });
    }
  };

  render() {
    const { data: { loading } } = this.props;
    if (loading) {
      return (<Loading />);
    }
    return (
      <Form
        onSubmit={this.signinUser}
      >
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={this.state.email}
            onChange={ev => this.setState({ email: ev.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={this.state.password}
            onChange={ev => this.setState({ password: ev.target.value })}
          />
        </FormGroup>
        <div>
          {this.state.errors.map(err =>
            <Alert color='danger' key={err}>
              {err}
            </Alert>
          )}
        </div>
        <Button type="submit" raised color="success">
          Submit
        </Button>
      </Form>
    );
  }
}

export default withRouter(graphql(query)(
  graphql(mutation)(Signin))
);
