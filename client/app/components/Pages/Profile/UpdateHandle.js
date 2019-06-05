import React, { Component } from 'react';
import MutableBox from './MutableBox'
import ReactLoading from '../../common/Loading';
import axios from 'axios';
import { connect } from 'react-redux';
import { ToastContainer, ToastStore } from 'react-toasts';

class updateHandle extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            codechef: "",
            codejam: "",
            kickstart: "",
            hackerEarth: "",
            hackerRank: "",
            codeforces: "",
            spoj: ""
        };
        this.updateValue = this.updateValue.bind(this);
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
                    console.log("Error: " + response.data);
                    return;
                }
                var data = response.data.user.contender;
                var handles = data.handles;
                if (!handles) {
                    handles = new Object();
                }
                handles.codechef = (!handles.codechef) ? "" : handles.codechef;
                handles.codejam = (!handles.codejam) ? "" : handles.codejam;
                handles.kickstart = (!handles.kickstart) ? "" : handles.kickstart;
                handles.hackerEarth = (!handles.hackerEarth) ? "" : handles.hackerEarth;
                handles.hackerRank = (!handles.hackerRank) ? "" : handles.hackerRank;
                handles.codeforces = (!handles.codeforces) ? "" : handles.codeforces;
                handles.spoj = (!handles.spoj) ? "" : handles.spoj;

                self.setState({
                    isLoading: false,
                    codechef: handles.codechef,
                    codejam: handles.codejam,
                    kickstart: handles.kickstart,
                    hackerEarth: handles.hackerEarth,
                    hackerRank: handles.hackerRank,
                    codeforces: handles.codeforces,
                    spoj: handles.spoj
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
        var token = localStorage.getItem('token');
        var userID = localStorage.getItem('user_id');
        var stateObj = Object.assign({}, this.state);
        stateObj[field] = newVal;
        this.setState(stateObj);

        var apiPath = '/api/contests/' + userID + '/codingHandle';
        var body = new Object();
        body["codechef"] = stateObj.codechef;
        body["codejam"] = stateObj.codejam;
        body["kickstart"] = stateObj.kickstart;
        body["spoj"] = stateObj.spoj;
        body["hackerRank"] = stateObj.hackerRank;
        body["codeforces"] = stateObj.codeforces;
        body["hackerEarth"] = stateObj.hackerEarth;

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
                console.log(response.data);
                ToastStore.success('Successfully updated!');

            })
            .catch(function (err) {
                console.log(err);
                ToastStore.error("Error ocurred. Please try after a while.");
            })
    }

    changeEditingStatus(value) {
        //Empty function
    }

    render() {
        const content = (
            <div className="jumbotron center pt-3 pb-2 bg-light">
                <div className='display-4 mb-3'>Coding handles</div>
                <div className="lead">Keep it updated to be recognised in the contest ranking.</div>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codechef" inputType="text" fieldName="CodeChef" val={this.state.codechef} />
                <a href="https://www.codechef.com" rel="noopener noreferrer" target="_blank">www.codechef.com</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codeforces" inputType="text" fieldName="Codeforces" val={this.state.codeforces} />
                <a href="https://codeforces.com" rel="noopener noreferrer" target="_blank">codeforces.com</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="codejam" inputType="text" fieldName="Google CodeJam" val={this.state.codejam} />
                <a href="https://codejam.withgoogle.com/codejam" rel="noopener noreferrer" target="_blank">codejam.withgoogle.com/codejam</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="kickstart" inputType="text" fieldName="Google Kickstart" val={this.state.kickstart} />
                <a href="https://code.google.com/codejam/kickstart" rel="noopener noreferrer" target="_blank">code.google.com/codejam/kickstart</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="hackerEarth" inputType="text" fieldName="HackerEarth" val={this.state.hackerEarth} />
                <a href="https://www.hackerearth.com" rel="noopener noreferrer" target="_blank">www.hackerearth.com</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="hackerRank" inputType="text" fieldName="HackerRank" val={this.state.hackerRank} />
                <a href="https://www.hackerrank.com" rel="noopener noreferrer" target="_blank">www.hackerrank.com</a>
                <hr />
                <MutableBox updateFieldValue={this.updateValue} changeEditingStatus={this.changeEditingStatus} field="spoj" inputType="text" fieldName="SPOJ" val={this.state.spoj} />
                <a href="https://www.spoj.com" rel="noopener noreferrer" target="_blank">www.spoj.com</a>
                <hr />
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />
            </div>
        );

        if (this.state.isLoading)
            return <ReactLoading/>;
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


export default connect(mapStateToProps)(updateHandle);