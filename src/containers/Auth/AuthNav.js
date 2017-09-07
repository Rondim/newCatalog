/**
 * Created by xax on 24.02.2017.
 */
import React, { Component } from 'react';
import { NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { graphql } from 'react-apollo';
import query from './queries/CurentUser';
import PropTypes from 'prop-types';
import { hashHistory, withRouter } from 'react-router';

class AuthNav extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  logout = () => {
    localStorage.clear();
    hashHistory.push('/signin');
    location.reload();
  };

  render() {
    const { loading, user } = this.props.data;
    if (loading) return <div />;
    return (user ?
        <NavItem onClick={() => this.logout()}>
          Выход
        </NavItem> :
        <LinkContainer to="/signin" activeHref="active">
          <NavItem>Вход</NavItem>
        </LinkContainer>
    );
  }
}

export default graphql(query)(withRouter(AuthNav));
