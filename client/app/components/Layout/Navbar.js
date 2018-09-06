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
      loginShow: true,
      bool: true
    };

    this.forgotpw = this.forgotpw.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onTextboxChangeSignInUsn = this.onTextboxChangeSignInUsn.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
  };


  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.setState({
        bool: true
      })
      if (this.state.bool) {
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
      if (this.state.bool) {
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
  forgotpw() {
    this.setState({
      loginShow: false
    });
    window.location.reload();
  }

  reload() {
    // this.forceUpdate();   
    // window.location.reload();
  }
  render() {
    const {
      signInUsn,
      signInPassword,

    } = this.state;
    const { isAuthenticated } = this.props.auth;
    const authLinks = (
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/courses" onClick={this.reload}>
              Courses
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/assignments" onClick={this.reload}>
              Assignments
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contests" onClick={this.reload}>
              Contests
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">

          <li className="nav-item text-light pt-2 pr-2">
            {this.props.auth.userName.firstName}
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile" onClick={this.reload}>
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
          <li className="nav-item">
            <div className="dropdown">
              <button className="btn btn-dark dropdown-toggle" type="button" data-toggle="dropdown"> Login </button>
              <ul className="dropdown-menu dropdown-menu-right w-auto">
                <li>
                  <form className="form-inline mx-1">
                    <div className="form-group">
                      <input
                        className="form-control mx-2 mt-3 mb-3"
                        placeholder="USN"
                        required="required"
                        value={signInUsn}
                        onChange={this.onTextboxChangeSignInUsn}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control mx-2 mb-0"
                        placeholder="Password"
                        required="required"
                        value={signInPassword}
                        onChange={this.onTextboxChangeSignInPassword}
                      />
                    </div>
                    <div className="form-group">
                      <Link to="/forgotpassword" className="mt-0 ml-2 mb-3 mr-3" onClick={this.forgotpw}>Forgot Password?</Link>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-dark mx-2 mb-4" onClick={this.onSignIn}>Log in</button>
                    </div>
                  </form>


                </li>
              </ul>
            </div></li>
        </ul>
      </div>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">

        <Link className="navbar-brand" to="/" onClick={this.reload}>
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

