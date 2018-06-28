import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  setInStorage,
  getFromStorage,
} from '../../utils/storage';
import './App.css';
import axios from 'axios';
import qs from 'qs';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpEmail: "",
      signUppassword: "",
      signUpError: "",
      isLoading: false,
      error: null,
      token: ""
    };

    this.onSignUp = this.onSignUp.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
  };

  componentDidMount() {
    this.setState({
      isLoading: false
    });
  }

  onTextboxChangeSignUpPassword(event) {
    event.preventDefault();
    this.setState({
      signUpPassword: event.target.value,
    });

  }

  onTextboxChangeSignUpEmail(event) {
    event.preventDefault();
    this.setState({
      signUpEmail: event.target.value,
    });

  }

  onSignUp(event) {
    event.preventDefault();

    const {
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;

    const user = {
      email: signUpEmail,
      password: signUpPassword
    };

    axios.post("/api/account/signup", qs.stringify(user))
      .then((response) => {
        console.log(response);
        if (response.data.success) {
         setInStorage('app', { token: response.data.token, user_id: response.data.user_id });
          this.setState({
            signUpError: response.data.message,
            isLoading: false,
            signUpPassword: '',
            signUpEmail: '',
            token: response.data.token,
          });
        } else {
          this.setState({
            signUpError: response.data.message,
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
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;

    return (

      <div className="App">
	<header className="App-header">
        <br></br><br></br>
         <h1 className="App-title">Signup Page</h1>
        </header>
        <div className="row justify-content-center">
	<br></br><br></br><br></br>
          <form className="col-5 align-items-center">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required="required"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
              />
            </div>
            <div className="form-group">
	    <br></br>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required="required"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              />
            </div>
	    <br></br>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" onClick={this.onSignUp}>Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}


export default SignUp;
