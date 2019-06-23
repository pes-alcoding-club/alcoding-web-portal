import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactLoading from '../../common/Loading';
import StaticBox from './StaticBox.js';
import MutableBox from './MutableBox.js';
import PasswordBox from './PasswordBox.js';
import { ToastContainer, ToastStore } from 'react-toasts';
import { _API_CALL } from './../../../Utils/api';




class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            isEditing: 0,
            usn: "",
            name: "",
            basicInfo: {}
        };
        this.updateValue = this.updateValue.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.changeEditingStatus = this.changeEditingStatus.bind(this);
    }


    componentDidMount() {
        var self = this;
        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')

        var apiPath = '/api/account/' + userID + '/details';
        _API_CALL(apiPath, "GET", {}, token)
            .then(response => {
                var data = response.data;
                self.setState({ isLoading: false });
                self.setState({
                    usn: data.user.usn,
                    name: data.user.name.firstName + " " + data.user.name.lastName,
                    basicInfo: data.user.basicInfo
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    updateUsername(field, newVal) {
        var self = this;
        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')
        var apiPath = '/api/account/' + userID + '/username'
        var body = { username: newVal };
        var previous_username = this.state.username;
        this.setState({ "username": newVal })
        if (newVal == previous_username) {
            ToastStore.warning("Current username. Please try another one");
            return;
        }

        _API_CALL(apiPath, "POST", body, token)
            .then(response => {
                if (response.status == 200) {
                    this.setState({ username: newVal });
                    ToastStore.success('Successfully updated!');
                } else {
                    throw new Error("Unsucessful")
                }
            })
            .catch(error => {
                self.setState({ "username": previous_username });
                if (error.response.status == 404) {
                    ToastStore.warning("Username already exists. Please try another one");
                }
                else if (error.message) {
                    ToastStore.error(error.message);
                }
            });
    }

    updateValue(field, newVal) {
        // TODO: Verify email and phone existance.
        console.log(this.state)
        var basicInfoCopy = Object.assign({}, this.state.basicInfo);
        if (basicInfoCopy[field] == newVal) {
            ToastStore.warning("Current " + field + ". Please try another one");
            return; //^ If old value equals updated value, displays appropriate error
        }
        if (field == "phone") {
            if (newVal[0] != '+') {
                newVal = '+91' + newVal;
            }
            var phoneFormat = new RegExp(/^((\+){1}91){1}[6-9]{1}[0-9]{9}$/);
            if (!phoneFormat.test(newVal)) {
                ToastStore.warning("Invalid Phone Number. Please try another one");
                return; //^ If phone number isn't of format - [6-9]{1}[1-9]{9}
            }
        }
        else if (field == "email") {
            var emailFormat = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!emailFormat.test(newVal)) {
                ToastStore.warning("Invalid Email ID. Please try another one");
                return; //^ If email ID isn't of format - {x@y.z}
            }
        }
        else if (field == "dob") {
            var givenDob = new Date(newVal);
            var presentDate = new Date();
            if (presentDate - givenDob < 16 * 365 * 24 * 3600 * 1000 || presentDate - givenDob > 65 * 365 * 24 * 3600 * 1000) {
                ToastStore.warning("Invalid Date of Birth. Please try another one");
                return; //^ If user is less than 16 years or greater than 65 years
            }
        }
        basicInfoCopy[field] = newVal;
        this.setState({ basicInfo: basicInfoCopy });
        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')
        var apiPath = '/api/account/' + userID + '/basicInfo';
        var body = new Object();
        body["phone"] = basicInfoCopy.phone;
        body["email"] = basicInfoCopy.email;
        body["dob"] = basicInfoCopy.dob;
        axios.put(
            apiPath,
            body,
            {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                if (!response.data.success) {
                    // TODO: throw appropriate error and redirect
                    console.log("Error: " + response.data);
                    return;
                }
                else {
                    // TODO: redirect to this page(profile)
                    console.log(response.data);
                    ToastStore.success('Successfully updated!');
                }
            })
            .catch(function (error) {
                // TODO: Try again after sometime? 
                console.log('error is ', error);
            });
    }

    changeEditingStatus(value) {
        this.state.isEditing += value;
    }

    changeEditingStatus(value) {
        this.state.isEditing += value;
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const content = (
            <div className="jumbotron center pt-3 pb-4 bg-light">
                <div className='display-4 mb-3'>Profile</div>

                <div>
                    <StaticBox fieldName="Name" val={this.state.name} />
                    <StaticBox fieldName="USN" val={this.state.usn} />
                    <p />
                    <Link to="/updateHandle" className="text-dark">Update Contest Handles</Link>
                    <PasswordBox />
                </div>
                <hr />
                <MutableBox updateFieldValue={this.updateUsername} changeEditingStatus={this.changeEditingStatus} field="username" inputType="text" fieldName="Username" val={this.state.username} />
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="phone" inputType="text" fieldName="Phone" val={this.state.basicInfo["phone"]} />
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="email" inputType="email" fieldName="Email ID" val={this.state.basicInfo["email"]} />
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="dob" inputType="date" fieldName="Date of Birth" val={this.state.basicInfo["dob"]} />
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />

                {/* <button onClick={this.onConfirm} type="button" className="btn btn-dark mb-4 ">Confirm Changes</button> */}
            </div>
        );

        if (this.state.isLoading)
            return <ReactLoading />;
        else
            return (
                <div>
                    <div className="d-none d-lg-block container-fluid col-lg-8">
                        {content}
                    </div>
                    <div className='d-lg-none'>
                        {content}
                    </div >
                </div>
            );
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(mapStateToProps)(Profile);
