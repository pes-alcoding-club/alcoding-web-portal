import React, { Component } from 'react'
import axios from "axios";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInUsn: ""
        };
        this.onTextboxChangeSignInUsn = this.onTextboxChangeSignInUsn.bind(this);
        this.sendEmail = this.sendEmail.bind(this);

    }

    onTextboxChangeSignInUsn(event) {
        event.preventDefault();
        this.setState({
            signInUsn: event.target.value,
        });

    }

    sendEmail() {
        // /api/account/forgotPassword
        var config = {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        var data = {USN: this.state.signInUsn}
        axios.post("/api/account/forgotPassword",data, config)
        .then(res=> {
            console.log(res);
            alert(res.data.message);
        })
        .catch(err=> console.log(err))

    }

    render() {
        return (
            <div className="card bg-light">
                <h4 className="card-header">Change Password</h4>
                <div className="card-body">
                    <label> Enter USN: </label>
                    <input
                        className="mx-2 mb-2"
                        placeholder="USN"
                        required="required"
                        value={this.state.signInUsn}
                        onChange={this.onTextboxChangeSignInUsn}
                    />
                </div>
                <div className="card-footer">
                    <button className="btn btn-danger" onClick={this.sendEmail}>Send Email</button>
                </div>
            </div>
        )
    }
}
