import React, { Component } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

class SubmissionsCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            usn: "", 
            email: ""
        }
    }

    componentDidMount() {
        var self = this;
        var token = localStorage.getItem('token');
        var userID = localStorage.getItem('user_id');

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
                    console.log("Error1: " + response.data);
                    return;
                }
                var data = response.data;
                self.setState({
                    name: data.user.name.firstName + data.user.name.lastName ,
                    usn: data.user.usn,
                    email: data.user.basicInfo.email
                });
            })
            .catch(function (error) {
                console.log('Error2: ', error);
            });
    }
    openWindow() {
        // <Link className="btn btn-dark" to={{
        //     pathname: '/download/' + this.props.fileID
        // }}> Download Submission </Link>
    }

    render() {
        let content;
        const downloadSubmission = "/api/assignments/download/" + this.props.fileID;

        const Content = (
            <div id="SubmissionsCard">
                <div className="card bg-light mx-auto">

                    <div className="card-body text-left">
                        Name : {this.state.name}<br />
                        USN : {this.state.usn} <br />
                        Email: {this.state.email} <br /><br />
                        {/* <button className="btn btn-dark" onClick={() => window.open("/download/" + this.props.fileID)}> Download Submission </button> */}
                        <a href={downloadSubmission} className="btn btn-dark">Download</a>
                    </div>

                </div>
                <br />
            </div>
        );
        content = Content;
        return (
            <div>{content}</div>

        )
    }
}
export default SubmissionsCard;