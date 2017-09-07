/**
 * Created by xax on 23.02.2017.
 */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import query from './queries/CurentUser';
import mutation from './mutations/SigninUser';
import Loading from '../../components/Loading';


class Signin extends Component {
  static propTypes = {
    mutate: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
  };

  state = {
    email: '',
    password: '',
    errors: []
  };

  componentWillUpdate(nextProps) {
    if (!this.props.data.user && nextProps.data.user) {
      hashHistory.push('/');
    }
  }

  signinUser = async () => {
    const { email, password } = this.state;
    try {
      const response = await this.props.mutate({
        variables: { email, password }
      });
      this.setState({ errors: [] });
      localStorage.setItem('token', response.data.signinUser.token);
      hashHistory.push('/');
    } catch (res) {
      const errors = res.graphQLErrors.map(err => err.message);
      this.setState({ errors });
    }
  };

  render() {
    if (this.props.data.loading) {
      return (<Loading />);
    }
    return (
      <form
        className="form-horizontal col-sm-6 col-sm-offset-3"
        role="form"
        onSubmit={this.signinUser}
      >
        <div className="form-group">
          <label htmlFor="email" className="col-sm-2 control-label">Email</label>
          <div className="col-sm-10">
            <input
              id="email"
              className="form-control"
              placeholder="Email"
              value={this.state.email}
              onChange={ev => this.setState({ email: ev.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="col-sm-2 control-label">Password</label>
          <div className="col-sm-10">
            <input
              id="password"
              placeholder="Password"
              className="form-control"
              type="password"
              value={this.state.password}
              onChange={ev => this.setState({ password: ev.target.value })}
            />
          </div>
        </div>
        <div className="errors">
          {this.state.errors.map(err =>
            <div className="col-sm-offset-2 col-sm-10 alert alert-danger" role="alert" key={err}>
              {err}
            </div>
          )}
        </div>
        <button className="btn btn-primary col-sm-12">Submit</button>
      </form>
    );
  }
}

export default graphql(query)(
  graphql(mutation)(Signin)
);
