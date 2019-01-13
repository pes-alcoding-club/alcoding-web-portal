import React, { Component } from 'react'
import axios from 'axios';

class PasswordBox extends Component {
    constructor() {
        super();
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        };

        this.changeOldPassword = this.changeOldPassword.bind(this);
        this.changeNewPassword = this.changeNewPassword.bind(this);
        this.changeConfirmNewPassword = this.changeConfirmNewPassword.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
    }
    changeOldPassword(event) {
        event.preventDefault();
        this.setState({
            oldPassword: event.target.value,
        });

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
        //api call to change password comes here
        var userID = localStorage.getItem("user_id");
        var token = localStorage.getItem('token');
        var body = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        }
        //api/account/:userID/password
        if (this.state.newPassword != this.state.confirmNewPassword) {
            alert("Passwords do not match.");
        }
        else if (this.state.oldPassword == this.state.newPassword) {
            alert("New Password cannot be same as old password.");
        }
        else {
            axios.post(`api/account/${userID}/changePassword`, body, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }).then(res => {

                if (res.data.success) {
                    console.log(res.data);
                    alert("Password change successfull!")
                    window.location.reload();
                }
            })
                .catch(err => {
                    console.log(err);
                    alert("Error changing the password. Please try again.");
                })
        }
    }

    render() {
        return(
            <div>
                <button type="button" className="btn btn-link pl-0 ml-auto text-dark" data-toggle="modal" data-target="#myModal">Change Password</button>

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
                                            placeholder="Old Password"
                                            required="required"
                                            value={this.state.oldPassword}
                                            onChange={this.changeOldPassword}
                                        />
                                    </div>
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
                                    <button onClick={this.confirmPasswordChange} type="button" className="btn btn-dark mb-2">Confirm Password Change</button>
                                    <button type="button" className="btn btn-default mb-2" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                </div>
        )
    }
}

export default PasswordBox;
