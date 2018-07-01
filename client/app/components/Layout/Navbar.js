import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {

  onLogoutClick(event) {
    event.preventDefault();
    this.props.logoutUser();

  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/courses">
              Courses
          </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/assignments">
              Assignments
          </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contests">
              Contests
          </Link>
          </li>
        </ul>
        <ul className="navbar-nav">

          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              Profile
        </Link>
          </li>
          <li className="nav-item">
            <a
              href=""
              onClick={this.onLogoutClick.bind(this)}
              className="nav-link"
            >Logout </a>
          </li>
        </ul>
      </div>
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