import React, { Component } from 'react'
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signInUsn: "",
            isLoading: false
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
        this.setState({
            isLoading: true
        });
        // /api/account/forgotPassword
        var config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        var data = { USN: this.state.signInUsn }
        axios.post("/api/account/forgotPassword", data, config)
            .then(res => {
                console.log(res);
                alert(res.data.message);
                <Redirect to="/" />
            })
            .catch(err => {
                alert("Unable to send email.")
                console.log(err);
                window.location.reload();
            })

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
                    {!this.state.isLoading ? <button className="btn btn-danger" onClick={this.sendEmail}>Send Email</button> : <p className="text-info">Loading, Please Wait.</p>}
                </div>
            </div>
        )
    }
}
