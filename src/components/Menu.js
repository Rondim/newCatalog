/**
 * Created by xax on 16.07.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Nav, Navbar, NavbarBrand, NavItem, NavLink as NavLinkStrap, NavbarToggler, Collapse,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import {
  withRouter
} from 'react-router-dom';

class Menu extends Component {
  static propTypes = {
    authenticated: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string
    ]),
    location: PropTypes.object,
    history: PropTypes.object,
    signoutUser: PropTypes.func
  };
  static defaultProps = {
    authenticated: false,
  };

  state = {
    isOpen: false,
    dropdownOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  logout = () => {
    const { history, signoutUser } = this.props;
    history.push('/signin');
    signoutUser();
  };

  renderLinks() {
    const { authenticated, history } = this.props;
    return (
      authenticated
        ? [
          <Nav className="mr-auto" navbar key="edit">
            <NavItem>
              <NavLinkStrap
                onClick={() => history.push('/')}
              >Каталог</NavLinkStrap>
            </NavItem>
          </Nav>,
          <Nav className="mr-auto" navbar key="exc1C">
            <NavItem>
              <NavLinkStrap
                onClick={() => history.push('/cells')}
              >Сетки</NavLinkStrap>
            </NavItem>
          </Nav>,
          <Nav className="ml-auto" navbar key="logout">
            <NavItem>
              <NavLinkStrap
                onClick={this.logout}
                className="d-lg-none"
              >
                Выход
              </NavLinkStrap>
              <NavLinkStrap
                onClick={this.logout}
                className="d-none d-lg-block"
              >
                <FontAwesome name="sign-out" size='2x' />
              </NavLinkStrap>
            </NavItem>
          </Nav>]
        : [
          <Nav className="ml-auto" navbar key="login">
            <LinkContainer to="/signin" className="hidden-sm-up">
              <NavItem>
                Вход
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/signin" className="hidden-xs-down">
              <NavItem>
                <FontAwesome name="sign-in" size='2x' />
              </NavItem>
            </LinkContainer>
          </Nav>
        ]);
  }

  render() {
    const { history } = this.props;
    return (
      <Navbar color="dark" dark expand='lg'>
        <NavbarToggler onClick={this.toggle} />
        <NavbarBrand onClick={() => history.push('/')}>
          <FontAwesome style={{ color: '#A3B5D1' }} name="home" size='2x' />
        </NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          {this.renderLinks()}
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Menu);

