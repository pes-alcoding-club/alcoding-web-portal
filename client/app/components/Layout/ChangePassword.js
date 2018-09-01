import React, { Component } from 'react';

import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

//import StaticBox from './StaticBox.js';

import PasswordBox from '../Pages/Profile/PasswordBox';

class ChangePassword extends Component {
    constructor() {
        super();
        this.state = {
            newPassword: "",
            confirmNewPassword: "",
        };

        this.changeNewPassword = this.changeNewPassword.bind(this);
        this.changeConfirmNewPassword = this.changeConfirmNewPassword.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
    }
    componentDidMount() {
        const { match: { params } } = this.props;
        var userID = params.userID;
        var token = params.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user_id', userID);

    }


    changeNewPassword(event) {
        event.preventDefault();
        this.setState({
            newPassword: event.target.value,
        });

    }

    changeConfirmNewPassword(event) {
        event.preventDefault();
        this.setState({
            confirmNewPassword: event.target.value,
        });

    }


    confirmPasswordChange() {
        var user_ID = localStorage.getItem("user_id");
        var token = localStorage.getItem('token');

        var body = {
            userID: user_ID,
            newPassword: this.state.newPassword
        }
        //api/account/:userID/newPassword
        if (this.state.newPassword != this.state.confirmNewPassword) {
            alert("Passwords do not match.");
        }

        else {
            // api call needs to be updated
            axios.post(`/api/account/${user_ID}/newPassword`, body, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {

                if (res.data.success) {
                    console.log(res.data);
                    localStorage.removeItem('token', token);
                    alert(res.data.message);
                    this.props.history.push('/');
                    // localStorage.removeItem('user_id', userID);
                    

                }
            })
                .catch(err => {
                    console.log(err);
                    alert("Error changing the password. Please try again.");
                })
        }
    }


    render() {

        return (
            <div>
                <button type="button" className="btn btn-info ml-0 mb-2" data-toggle="modal" data-target="#myModal">Change Password</button>

                <div id="myModal" className="modal fade" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Change Password</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>

                            </div>
                            <div className="modal-body">
                                <form className="form mx-1">

                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control mx-2 mb-3"
                                            placeholder="New Password"
                                            required="required"
                                            value={this.state.newPassword}
                                            onChange={this.changeNewPassword}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control mx-2 mb-3"
                                            placeholder="Confirm Password"
                                            required="required"
                                            value={this.state.confirmNewPassword}
                                            onChange={this.changeConfirmNewPassword}
                                        />
                                    </div>
                                </form>
                                <div className="modal-footer">
                                    <button onClick={this.confirmPasswordChange} type="button" className="btn btn-dark mb-2" data-dismiss="modal">Confirm Password Change</button>
                                    <button type="button" className="btn btn-default mb-2" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePassword;
