import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

import StaticBox from './StaticBox.js';
import MutableBox from './MutableBox.js';
import PasswordBox from './PasswordBox.js';
import { ToastContainer, ToastStore } from 'react-toasts';


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
        this.changeEditingStatus = this.changeEditingStatus.bind(this);
    }


    componentDidMount() {
        var self = this;
        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')

        var apiPath = '/api/account/' + userID + '/details'
        axios.get(apiPath, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.data.success) {
                    // TODO: throw appropriate error and redirect
                    console.log("Error:" + response.data);
                    return;
                }
                var data = response.data;
                // TODO: Update dob with calendar
                self.setState({ isLoading: false });
                self.setState({
                    usn: data.user.usn,
                    name: data.user.name.firstName + " " + data.user.name.lastName,
                    basicInfo: data.user.basicInfo
                });
            })
            .catch(function (error) {
                // TODO: Try again after sometime? 
                console.log('error is ', error);
                if (error.response) {
                    if (error.response.status) {
                        alert("Session timed out.");
                        window.location.href = '/';
                    }
                }
            });
    }

    updateValue(field, newVal) {
        // TODO: Some Form validation based on field
        var basicInfoCopy = Object.assign({}, this.state.basicInfo);
        basicInfoCopy[field] = newVal;
        this.setState({ basicInfo: basicInfoCopy });

        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')
        var apiPath = '/api/account/' + userID + '/basicInfo'
        var body = new Object();
        body["phone"] = basicInfoCopy.phone; 
        body["email"]= basicInfoCopy.email;
        body["dob"]= basicInfoCopy.dob;

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
        if (this.state.isLoading)
            return <ReactLoading type="bubbles" color="#000080" />;
        else
            return (
                <div className="container col-md-8">
                    <div className="jumbotron center pt-3 pb-2 bg-light">
                        <div className='display-4 mb-3'>Profile</div>

                        <div>
                            <StaticBox fieldName="Name" val={this.state.name} />
                            <StaticBox fieldName="USN" val={this.state.usn} />
                            <p />
                            <Link to="/profile/updateHandle">Update contest handles</Link>
                            <PasswordBox />

                        </div>
                        <hr />
                        <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="phone" inputType="text" fieldName="Phone" val={this.state.basicInfo["phone"]} />
                        <hr />
                        <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="email" inputType="email" fieldName="Email ID" val={this.state.basicInfo["email"]} />
                        <hr />
                        <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="dob" inputType="date" fieldName="Date of Birth" val={this.state.basicInfo["dob"]} />
                        <hr />
                        <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />

                        {/* <button onClick={this.onConfirm} type="button" className="btn btn-dark mb-4 ">Confirm Changes</button> */}
                    </div>
                </div>
            );
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(mapStateToProps)(Profile);
