import React, { Component } from 'react';
import MutableBox from './MutableBox'
import ReactLoading from 'react-loading';
import axios from 'axios';
import { connect } from 'react-redux';

class updateHandle extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
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
                    isLoading: false,
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


    updateValue(field, value) {
        console.log("Change in db.");
    }

    changeEditingStatus(value) {
        //Empty function
    }

    render() {
        if (this.state.isLoading)
            return <ReactLoading type="bubbles" color="#000080" />;
        else
            return (
                <div>
                    <div className="container col-md-8">
                        <div className="jumbotron center pt-3 pb-2 bg-light">
                            <div className='display-4 mb-3'>Contest handles</div>
                            <div className="lead">Keep it updated to be recognised in the contest ranking.</div>
                            <hr />
                            <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codechef" inputType="text" fieldName="CodeChef" val={this.state.usn} />
                            <hr />
                            <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codechef" inputType="text" fieldName="Google CodeJam/Kickstart" val={this.state.usn} />
                            <hr />
                            <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codechef" inputType="text" fieldName="HackerRank" val={this.state.usn} />
                            {/* <hr /> */}
                        </div>
                    </div>
                </div>
            );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(mapStateToProps)(updateHandle);