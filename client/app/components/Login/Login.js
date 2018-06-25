import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInpassword: "",
      signInError: "",
      isLoading: false,
      error: null,
      token: ""
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
  };

  componentDidMount() {
    this.setState({
      isLoading: false
    });
 }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => 
      console.log(res.status))
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('App', {
            token: json.token,
            user_ID: json.user_ID
          });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }
  render() {
    const {
      signInEmail,
      signInPassword,
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
                value={this.state.signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required="required"
                value={this.state.signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
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


export default Login;
