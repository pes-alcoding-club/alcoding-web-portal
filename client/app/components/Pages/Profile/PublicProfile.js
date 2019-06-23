import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import StaticBox from './StaticBox.js';


class PublicProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            name: "",
            usn: "",
            rating: 0,
            best: 0,
            role: ""
        };
    }

    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props;

        var apiPath = `/api/users/${params.username}`
        axios.get(apiPath, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (!response.data.success) {
                    // TODO: throw appropriate error and redirect
                    console.log("Error:" + response.data);
                    return;
                }
                console.log(response.data);
                var data = response.data.user;
                self.setState({ isLoading: false });
                self.setState({
                    usn: data.usn,
                    name: data.name.firstName + " " + data.name.lastName,
                    rating: data.rating,
                    best: data.best,
                    role: data.role
                });
            })
            .catch(function (error) {
                // TODO: Show Not Found Page for this URL
                console.log('error is ', error);
                if (error.response) {
                    if (error.response.status) {
                        alert("The username doesn't exist");
                        window.location.href = '/';
                    }
                }
            });
    }

    render() {
        const studentContent = (
            <div>
                <StaticBox fieldName="Role" val="Student" />
                <StaticBox fieldName="Rating" val={this.state.rating} />
                <StaticBox fieldName="Best" val={this.state.best} />
            </div>
        );
        const professorContent = (
            <div>
                <StaticBox fieldName="Role" val="Professor" />
            </div>
            // TODO: Add more details of allotted courses etc
        );
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
                            {this.state.role=="student"?  studentContent: professorContent}
                            <p />
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

export default connect(mapStateToProps)(PublicProfile); 