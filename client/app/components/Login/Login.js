import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
class Login extends Component {
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
      this.props.history.push('/landing');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/landing');
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

  render() {
    const {
      signInEmail,
      signInPassword,
      errors
    } = this.state;

    return (

      <div className="container-fluid">
        <div className="row justify-content-center">
          <form className="col-5 align-items-center">
            <h2 className="text-center">Log In</h2>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required="required"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
                error={errors.email}
              />
            </div>
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
          
            
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" onClick={this.onSignIn}>Log in</button>
            </div>
          </form>
          
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired

};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors

});

export default connect(mapStateToProps, { loginUser })(Login);
