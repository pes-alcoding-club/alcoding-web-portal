import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';

import StaticBox from './StaticBox.js';
import MutableBox from './MutableBox.js';

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            usn: "",
            name: "",
            basicInfo: {}
        };
        this.updateValue = this.updateValue.bind(this);
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

    onConfirm() {
        // Not tested as endpoint is not ready yet.
        console.log("Calling PUT /api/account/:userID/basicInfo");
        // var apiPath = '/api/account/' + userID + '/basicInfo'
        // axios.put(apiPath, {
        //     headers: {
        //         'x-access-token': token,
        //         'Content-Type': 'application/json'
        //     },
        //     basicInfo: this.state.basicInfo
        // })
        //     .then(function (response) {
        //         if (!response.data.success) {
        //             // TODO: throw appropriate error and redirect
        //             console.log("Error: " + response.data);
        //             return;
        //         }
        //         // TODO: redirect to this page(profile)
        //     })
        //     .catch(function (error) {
        //         // TODO: Try again after sometime? 
        //         console.log('error is ', error);
        //     });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        return (
            <div className="container">
                <div className="jumbotron">
                    <h2>Profile</h2>
                    <StaticBox field="USN" val={this.state.usn} />
                    
                    <StaticBox field="Name" val={this.state.name} />
                    <hr className="my-2"/>
                    {
                        Object.keys(this.state.basicInfo).map((oneKey, i) => {
                            return (
                                <MutableBox key={i} updateFieldValue={this.updateValue} field={oneKey} val={this.state.basicInfo[oneKey]} />
                            )
                        })
                    }
                    <button onClick={this.onConfirm} type="button" className="btn btn-primary">Confirm</button>
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