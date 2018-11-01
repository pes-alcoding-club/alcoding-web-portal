import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import AssignmentCard from '../Assignments/AssignmentCard';
class AssignmentAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            uniqueID: '',
            type: '',
            details: '',
            maxMarks: undefined,
            resourcesUrl: '',
            startDate: '',
            endDate: '',
            assignment: {},
            assignments: [],
            show: false.anchorDescription,
            showDescription: true
        };
        this.onAdd = this.onAdd.bind(this);
        this.showForm = this.showForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleUniqueidChange = this.handleUniqueidChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDetailsChange = this.handleDetailsChange.bind(this);
        this.handleMarksChange = this.handleMarksChange.bind(this);
        this.handleURLChange = this.handleURLChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }
    componentDidMount() {
        var self = this;
        const { match: { params } } = this.props;
        console.log(this.props.anchorDescription);
        if(this.props.anchorDescription == ""){
            this.setState({
                showDescription:false
            });
        }
        var token = localStorage.getItem('token')
        ///api/assignments/:courseID/assignments
        axios.get(`/api/assignments/${params.courseID}/assignments`, {
            headers: {
                'x-access-token': token,
            }
        }).then(function (response) {
            if (!response.data.success) {
                console.log("Error1: " + response.data);
            }
            var data = response.data;
            self.setState({
                assignments: self.state.assignments.concat(data.assignments.assignments)
            });
            console.log(response.data);
        })
            .catch(function (error) {
                console.log('Error2: ', error);
            });
    }
    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
    }
    handleUniqueidChange(e) {
        this.setState({
            uniqueID: e.target.value
        })
    }
    handleTypeChange(e) {
        this.setState({
            type: e.target.value
        })
    }
    handleDetailsChange(e) {
        this.setState({
            details: e.target.value
        })
    }
    handleMarksChange(e) {
        this.setState({
            maxMarks: e.target.value
        })
    }
    handleURLChange(e) {
        this.setState({
            resourcesUrl: e.target.value
        })
    }
    handleStartDateChange(e) {
        this.setState({
            startDate: e.target.value
        })
    }
    handleEndDateChange(e) {
        this.setState({
            endDate: e.target.value
        })
    }
    reload() {
        window.location.reload()
    }
    onAdd() {
        ///api/assignment/:userID/createAssignment
        var self = this;
        var userID = localStorage.getItem('user_id');
        var token = localStorage.getItem('token');
        const { match: { params } } = this.props;

        var config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        }
        var data = Object.assign({}, self.state.assignment);
        data.name = self.state.name;
        data.uniqueId = self.state.uniqueID;
        data.type = self.state.type;
        data.courseID = params.courseID;
        data.maxMarks = self.state.maxMarks;
        data.details = self.state.details;
        data.resourcesUrl = self.state.resourcesUrl;
        var duration = { startDate: self.state.startDate, endDate: self.state.endDate }
        data.duration = duration;
        data = JSON.stringify(data)
        console.log(data)
        axios.post(`/api/assignments/${userID}/createAssignment`, data, config)
            .then(res => {
                console.log(res.data);
                this.reload();
            })
            .catch(err => {
                console.log(err);
                alert('Assignment Failed to Upload!')
            })
    }
    showForm() {
        this.setState({
            show: true
        })
    }
    closeForm() {
        this.setState({
            show: false
        })
    }
    render() {
        let content;
        const click = (
            <div>
                <form>
                    <div className="form-group text-left">
                        <h6>Assignment Name<sup>*</sup></h6>
                        <input type="text" className="form-control " placeholder="Name" value={this.state.name} onChange={this.handleNameChange} required="true"/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Unique ID<sup>*</sup></h6>
                        <input type="text" className="form-control" placeholder="Unique ID" value={this.state.uniqueID} onChange={this.handleUniqueidChange} required="true"/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Type<sup>*</sup></h6>
                        <input type="text" className="form-control" placeholder="Type" value={this.state.type} onChange={this.handleTypeChange} required="true"/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Assignment Details<sup>*</sup></h6>
                        <textarea className="form-control" placeholder="Details" value={this.state.details} onChange={this.handleDetailsChange} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Maximum Marks<sup>*</sup></h6>
                        <input type="number" className="form-control" placeholder="Maximum Marks" value={this.state.maxMarks} onChange={this.handleMarksChange} required="true"/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Duration</h6>
                        <label>Start Date<sup>*</sup></label>
                        <input type="date" className="form-control" placeholder="Start Date" value={this.state.startDate} onChange={this.handleStartDateChange} required="true"/>
                        <label>End Date<sup>*</sup></label>
                        <input type="date" className="form-control" placeholder="End Date" value={this.state.endDate} onChange={this.handleEndDateChange} required="true"/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Resources<sup>*</sup></h6>
                        <input type='text' className="form-control" placeholder="URLs" value={this.state.resourcesUrl} onChange={this.handleURLChange} />
                    </div>
                </form>
            </div>
        )
        const AssignmentContent = (
            <div>
                {
                    this.state.assignments.map(function (each) {
                        return <AssignmentCard key={each.uniqueID} uniqueID={each.uniqueID} name={each.name} details={each.details} type={each.type.toUpperCase()} maxMarks={each.maxMarks} resourceUrl={each.resourceUrl} assignmentID={each._id} submissions={each.submissions} role='prof' />
                    })
                }
            </div>
        );
        content = AssignmentContent;
        return (
            <div>
                <div className='row'>
                    <div className='col'>

                        <div className="display-4 text-center">{this.props.location.state.code}: {this.props.location.state.name}</div><br/>
                        {this.props.location.state.anchorDescription ? <div className="font-italic">Anchor Description: {this.props.location.state.anchorDescription}</div> : null}

                    </div>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-sm-7'>
                        <h1 className='text-center'>
                            Assignments for this course
                        </h1>
                        <hr />
                        {content}
                    </div>
                    <div className='col-sm-5'>
                        <div className='card text-center bg-light'>
                            <div className='card-body '>
                                {this.state.show ? click : <button type="button" className="btn btn-dark w-20 mx-3" onClick={this.showForm}>Add Assignment</button>}
                                {this.state.show ? null : <button className="btn w-20 mx-3"><Link className='text-dark' to="/courses"> Back To Courses </Link></button>}
                                {this.state.show ? <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.onAdd}>Submit</button> : null}
                                {this.state.show ? <button type="close" className="btn w-20 mx-3" onClick={this.closeForm}>Close</button> : null}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default AssignmentAdd;