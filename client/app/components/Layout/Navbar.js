import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { loginUser } from '../../actions/authActions';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      signInEmail: "",
      signInpassword: "",
      errors: {},
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      <Redirect to="/" />
      //this.props.history.push('/landing');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      <Redirect to="/" />
      //this.props.history.push('/landing');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onTextboxChangeSignInPassword(event) {
    event.preventDefault();
    this.setState({
      signInPassword: event.target.value,
    });

  }

  onTextboxChangeSignInEmail(event) {
    event.preventDefault();
    this.setState({
      signInEmail: event.target.value,
    });

  }

  onSignIn(event) {
    event.preventDefault();   
    const user = {
      email: this.state.signInEmail,
      password: this.state.signInPassword
    };

   this.props.loginUser(user);
  }

  onLogoutClick(event) {
    event.preventDefault();
    this.props.logoutUser();

  }
  render() {
    const {
      signInEmail,
      signInPassword,
      errors
    } = this.state;
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
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
        <form className="form-inline">
        <li className="nav-item">
        <div className="form-group">
        <input
                className="form-control"
                placeholder="Email"
                required="required"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
                error={errors.email}
              />
				</div>
        </li>
        <li className="nav-item">
        <div className="form-group">
        <input
                type="password"
                className="form-control"
                placeholder="Password"
                required="required"
                value={signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
                error={errors.password}
              />
				</div>
        </li>
        <li className="nav-item">
        <button type="submit" className="btn btn-pill btn-dark" onClick={this.onSignIn}>Log in</button>
        </li>
        </form>
        </ul>
      </div>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">

        <Link className="navbar-brand" to="/">
          The Alcoding Club
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
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser, logoutUser })(Navbar);
