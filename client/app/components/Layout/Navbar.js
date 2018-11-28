import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, logoutUser, getName } from '../../actions/authActions';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
    // this.forceUpdate();   
    this.props.logoutUser();

  }
  forgotpw() {
    this.setState({
      loginShow: false
    });
    this.reload();
    // this.forceUpdate();   
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
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/contests" onClick={this.reload}>
              Contests
            </Link>
          </li>
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
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="nav-item active">
            <div className="text-light pt-2 pr-2">
              {this.props.auth.userName.firstName}
            </div>
          </li>
          {/* <li className="nav-item">
            <Link className="nav-link" to="/contribute" onClick={this.reload}>
              Contribute
            </Link>
          </li> */}
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
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <Form inline onSubmit={this.onSignIn}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="usn" hidden>USN</Label>
              <Input type="text" name="usn" id="usn" placeholder="USN" required onChange={this.onTextboxChangeSignInUsn} />
            </FormGroup>
            {' '}
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="Password" hidden>Password</Label>
              <Input type="password" name="password" id="Password" placeholder="Password" required onChange={this.onTextboxChangeSignInPassword} />
            </FormGroup>
            {' '}
            <Button>Login</Button>
          </Form>
        </ul>
      </div>
    );

    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">

        <Link className="navbar-brand" to="/" onClick={this.reload}>
          The Alcoding Club
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {isAuthenticated ? authLinks : guestLinks}

      </nav >
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

