import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {
  constructor() {
    super();
    this.onLogoutClick=this.onLogoutClick.bind(this)

  }
  onLogoutClick(event) {
    event.preventDefault();
    this.props.logoutUser();

  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">

        <li className="nav-item">
          <Link className="nav-link" to="/landing">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/landing">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <a
            href=""
            onClick={this.onLogoutClick}
            className="nav-link"
          >Logout </a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Alcoding
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {isAuthenticated ? authLinks : guestLinks}
        </div>

      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);