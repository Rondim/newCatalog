/**
 * Created by xax on 16.07.17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Nav, Navbar, NavbarBrand, NavItem, NavLink as NavLinkStrap, NavbarToggler, Collapse,
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faSignOutAlt, faToggleOff, faToggleOn } from '@fortawesome/fontawesome-free-solid';
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

  switchCache = () => {
    const current = localStorage.getItem('cache');
    console.log(current);
    switch (current) {
      case 'apollo':
        localStorage.setItem('cache', 'hermes');
        break;
      case 'hermes':
        localStorage.setItem('cache', 'apollo');
        break;
      case null:
        localStorage.setItem('cache', 'hermes');
        break;
    }
    location.reload(true);
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
                onClick={() => history.push('/sheets')}
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
                <FontAwesomeIcon icon={faSignOutAlt} size='2x' />
              </NavLinkStrap>
            </NavItem>
          </Nav>]
        : [
          <Nav className="ml-auto" navbar key="login">
            <LinkContainer to="/signin" className="d-lg-none">
              <NavItem>
                Вход
              </NavItem>
            </LinkContainer>
            <LinkContainer to="/signin" className="d-none d-lg-block">
              <NavItem>
                <FontAwesomeIcon icon={faSignInAlt} size='2x' />
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
          <FontAwesomeIcon style={{ color: '#A3B5D1' }} icon={faHome} size='2x' />
        </NavbarBrand>
        <div style={{ color: 'white' }}>
          Hermes
          <FontAwesomeIcon
            size='2x'
            onClick={this.switchCache}
            color={localStorage.getItem('cache') ==='hermes' ? 'green' : null}
            icon={localStorage.getItem('cache') ==='hermes' ? faToggleOn : faToggleOff }
          />
        </div>
        <Collapse isOpen={this.state.isOpen} navbar>
          {this.renderLinks()}
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Menu);

