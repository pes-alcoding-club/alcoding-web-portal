import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, logoutUser, getName } from '../../actions/authActions';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      signInUsn: "",
      signInpassword: "",
      bool: true
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onTextboxChangeSignInUsn = this.onTextboxChangeSignInUsn.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.setState({
        bool: true
      })
      if(this.state.bool){
      this.props.getName()
      this.setState({
        bool: false
      });
    }
      <Redirect to="/" />
      //this.props.history.push('/landing');
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.setState({
        bool: true
      })
      if(this.state.bool){
        nextProps.getName()
        this.setState({
          bool: false
        });
      }
      <Redirect to="/" />
      //this.props.history.push('/landing');
    }

   
  }

  onTextboxChangeSignInPassword(event) {
    event.preventDefault();
    this.setState({
      signInPassword: event.target.value,
    });

  }

  onTextboxChangeSignInUsn(event) {
    event.preventDefault();
    this.setState({
      signInUsn: event.target.value,
    });

  }

  onSignIn(event) {
    event.preventDefault();
    const user = {
      usn: this.state.signInUsn,
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
      signInUsn,
      signInPassword,
      
    } = this.state;
    const { isAuthenticated, user, userName } = this.props.auth;
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
        <li className="nav-item text-light pt-2 pr-2">
          {this.props.auth.userName.firstName}
          </li>
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
              <div className="form-group  mr-sm-2">
                <input
                  className="form-control"
                  placeholder="USN"
                  required="required"
                  value={signInUsn}
                  onChange={this.onTextboxChangeSignInUsn}
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
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginUser, logoutUser, getName })(Navbar);
