import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';

import StaticBox from './StaticBox.js';
import MutableBox from './MutableBox.js';
import PasswordBox from './PasswordBox.js';

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            isEditing: 0,
            usn: "",
            name: "",
            basicInfo: {}
        };
        this.updateValue = this.updateValue.bind(this);
        this.changeEditingStatus = this.changeEditingStatus.bind(this);
        this.onConfirm = this.onConfirm.bind(this);

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
                    console.log("Error: " + response.data);
                    return;
                }
                var data = response.data;
                // TODO: Update dob with calendar
                self.setState({
                    usn: data.user.usn,
                    name: data.user.name.firstName + " " + data.user.name.lastName,
                    basicInfo: data.user.basicInfo
                });
            })
            .catch(function (error) {
                // TODO: Try again after sometime? 
                console.log('error is ', error);
            });
    }

    updateValue(field, newVal) {
        // TODO: Some Form validation based on field
        var basicInfoCopy = Object.assign({}, this.state.basicInfo);
        basicInfoCopy[field] = newVal;
        this.setState({ basicInfo: basicInfoCopy });
        console.log(this.state.basicInfo)
    }

    changeEditingStatus(value) {
        this.state.isEditing += value;
    }

    onConfirm() {
        if (this.state.isEditing) {
            alert("Please save changes before confirming.");
            return;
        }

        var token = localStorage.getItem('token')
        var userID = localStorage.getItem('user_id')
        var apiPath = '/api/account/' + userID + '/basicInfo'

        var basicInfoUpdated = Object.assign({}, this.state.basicInfo)

        axios.put(
            apiPath,
            basicInfoUpdated,
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
                    alert('Details Updated!');
                }
            })
            .catch(function (error) {
                // TODO: Try again after sometime? 
                console.log('error is ', error);
            });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        return (
            <div className="container">
                <div className="jumbotron">
                    <p className='display-2'>Profile</p>
                    <StaticBox field="USN" val={this.state.usn} />

                    <StaticBox field="Name" val={this.state.name} />
                    <hr className="my-2" />
                    <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="phone" fieldName="Phone" val={this.state.basicInfo["phone"]} />
                    <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="email" fieldName="Email ID" val={this.state.basicInfo["email"]} />
                    <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="dob" fieldName="Date of Birth" val={this.state.basicInfo["dob"]} />


                    <button onClick={this.onConfirm} type="button" className="btn btn-dark">Confirm Changes</button>

                    {/* <div><pre>{JSON.stringify(this.state, null, 2)}</pre></div> */}

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