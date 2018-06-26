import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import axios from 'axios';
import qs from 'qs';

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

    const {
      signInEmail,
      signInPassword,
      signInError
    } = this.state;

    const user = {
      email: signInEmail,
      password: signInPassword
    };

    axios.post("/api/account/signin", qs.stringify(user))
      .then((response) => {
        console.log(response);
        
        if (response.success) {
          setInStorage('app', { token: json.token, user_id: json.user_id });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: response.message,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {
      signInEmail,
      signInPassword,
      signInError
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
