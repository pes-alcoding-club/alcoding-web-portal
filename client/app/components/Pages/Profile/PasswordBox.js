import React, { Component } from 'react'
import axios from 'axios';

class PasswordBox extends Component {
    constructor() {
        super();
        this.state = {

            changePw: false,
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        };
        this.updatePassword = this.updatePassword.bind(this);
        this.cancel = this.cancel.bind(this);
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

    updatePassword() {
        this.setState({
            changePw: true
        })
    }
    cancel() {
        this.setState({
            changePw: false
        })
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
            axios.post(`api/account/${userID}/password`, body, {
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
    renderPasswordBox() {

        return (
            <div className="card card-body bg-light mb-2">
                <h4>Change Password</h4>
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

                    <button onClick={this.confirmPasswordChange} type="button" className="btn btn-dark mb-2">Confirm Password Change</button>
                    <button onClick={this.cancel} type="button" className="btn btn-danger ml-2 mb-2">Cancel</button>

                </form>
            </div>
        )
    }

    renderNoBox() {
        return (
            <div>
                <button onClick={this.updatePassword} type="button" className="btn btn-Light mb-2">Change Password</button> <br />
            </div>
        );
    }

    render() {
        if (this.state.changePw) {
            return this.renderPasswordBox();
        }
        else
            return this.renderNoBox();
    }
}

export default PasswordBox;
