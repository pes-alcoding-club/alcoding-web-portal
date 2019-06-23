import React, { Component } from 'react'
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';
import ReactLoading from '../common/Loading';
import { ToastContainer, ToastStore } from 'react-toasts';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
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
        if (!this.state.signInUsn) {
            ToastStore.error("USN cannot be empty.")
            return;
        }

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
                // console.log(res);
                this.setState({ isLoading: false });
                // alert(res.data.message);
                ToastStore.success(res.data.message);
                setTimeout(()=>{
                    this.setState({ redirect: true })
                }, 2000);
            })
            .catch(err => {
                this.setState({ isLoading: false });
                if (err.response) {
                    if (err.response.status == 404) {
                        // alert("User not found.");
                        ToastStore.error('User not found.');
                    }
                }
                else {
                    // alert("Unable to send email. Please try again later.");
                    ToastStore.error("Unable to send email. Please try again later.")
                }
            })
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect push to='/' />
        }
    }

    render() {
        return (
            <div className="card bg-light">
                {this.renderRedirect()}
                <h4 className="card-header">Change Password</h4>
                <div className="card-body">
                    <label> Enter USN: </label>
                    <input
                        className="mx-2 mb-2 p-1"
                        placeholder="USN"
                        required="required"
                        value={this.state.signInUsn}
                        onChange={this.onTextboxChangeSignInUsn}
                        required="required"
                    />
                </div>
                <div className="card-footer">
                    {!this.state.isLoading ? <button className="btn btn-dark" onClick={this.sendEmail}>Send Email</button> : <ReactLoading type="bubbles" color="#000080" />}
                </div>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
            </div>
        )
    }
}
