import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Input, InputGroup, InputGroupAddon, Collapse, Button, CardBody, Card, Badge, Table } from 'reactstrap';
import { ToastContainer, ToastStore } from 'react-toasts';
import axios from 'axios';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {connect} from 'react-redux';

class CourseCard extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
      		courseID: '',
			collapse: false,
			course:null,						
			showModal:false
    	};
		this.toggle = this.toggle.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);				
		this.handleDetailsChange = this.handleDetailsChange.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.toggleCreateAssignment = this.toggleCreateAssignment.bind(this);
		this.handleCreateAssignment = this.handleCreateAssignment.bind(this);
	}
	// Create Assignment Handler
	handleCreateAssignment(event){
		event.preventDefault();		
		const self = this;
		const createAssignmentFormElements = event.target.getElementsByTagName("input");
		var apiPath = `/api/assignments/${this.props.auth.user_id}/createAssignment`
		const token = this.props.auth.token;		
		const config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
		}
		const data = {};
		data.courseID = this.state.courseID;
		data.name = createAssignmentFormElements["assignmentName"].value;
		data.uniqueId = createAssignmentFormElements["assignmentID"].value;
        data.type = createAssignmentFormElements["assignmentType"].value;
        data.details = createAssignmentFormElements["assignmentDetails"].value;
        data.maxMarks = createAssignmentFormElements["assignmentMaxMarks"].value;
		data.resourcesUrl = createAssignmentFormElements["assignmentResources"].value;
		data.duration = {};
        data.duration.startDate = createAssignmentFormElements["assignmentStartDate"].value;
		data.duration.endDate = createAssignmentFormElements["assignmentEndDate"].value;		
		console.log(data);
		axios.post(apiPath, data, config)
            .then(res => {
                console.log(res.data);
                ToastStore.success(res.data.message);
                setTimeout(() => {self.reload()},2000);        
            })
            .catch(err => {
                console.log(err.response.data.message);
                ToastStore.error(err.response.data.message);
            })
				        
	}
	// Generalised input handler for form inputs
	handleInputChange(event) {
		const updatedCourse = this.state.course;
		updatedCourse[event.target.name] = event.target.value;
        this.setState({
            course: updatedCourse
        })
	} 
	// Handler for start and end date inputs
	handleDurationChange(event) {
		const updatedCourse = this.state.course;		
		updatedCourse["duration"][event.target.name] = event.target.value;
        this.setState({
            course: updatedCourse
        })
	} 
	// Handler for course details input
	handleDetailsChange(event) {
		const updatedCourse = this.state.course;
		console.log(updatedCourse);		
		updatedCourse["details"][event.target.name] = Number(event.target.value);
        this.setState({
            course: updatedCourse
        })
	} 
	reload() {
    	window.location.reload()
  	}
  	toggle() { // For reactstrap Collapse component
    	this.setState(state => ({ collapse: !state.collapse }));
	}
	toggleCreateAssignment() {	// For create assignment modal
		this.setState(state => ({ showModal: !state.showModal}));
	}		
	componentWillMount() { // Add pre-defined course attributes, and other values to course object in state before mounting
		const course = this.props.course;		
		if(!course.hasOwnProperty("duration")){
			course["duration"]={};
		}						
	    this.setState({
			  courseID: this.props.course._id,
			  course: Object.assign({}, course)
    	})
	}
	    
  	render() {			
		const course = this.props.course;		
		const self = this;
		var createCourseModal = null;
		// For courses pending activation by a courseMember
		if(this.props.course.validated === true && this.props.course.active === false){
			var courseGlance = (
				<div>
					<div className="row">        		
						<div className="col md 3">								
							<div className="form-group text-left">
								<h5>Course Code</h5>
								<p>{course.code}</p>
							</div>							
						</div>
						<div className="col md 3">								
							<div className="form-group text-left">
								<h5>Course Name</h5>
								<p>{course.name}</p>
							</div>
						</div>
						<div className="col md 3">
							<div className="form-group text-left">
								<h5>Department</h5>
								<p>{course.department}</p>
							</div>
						</div>
						<div className="col sm 3">							
							<h4><Badge href="#" color="warning">Pending Activation</Badge></h4>
						</div>																	
					</div>
					<Button color="link" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Expand</Button>
				</div>
			)
			var courseDetails = (
				<Card>
            		<CardBody>
						<form>
							<div className="form-group text-left">
								<h6>Course Name<sup>*</sup></h6>
								<input type="text" className="form-control" placeholder="Name" name="name" value={this.state.course.name} onChange={this.handleInputChange} required={true} disabled/>
							</div>
							<div className="form-group text-left">
								<h6>Code<sup>*</sup></h6>
								<input type="text" className="form-control" placeholder="Code" name="code" value={this.state.course.code} onChange={this.handleInputChange} required={true} disabled/>
							</div>
							<div className="form-group text-left">
								<h6>Department<sup>*</sup></h6>
								<input type="text" className="form-control" placeholder="Department" name="department" value={this.state.course.department} onChange={this.handleInputChange} required={true} disabled/>
							</div>
							<div className="form-group text-left">
								<h6>Graduating Year<sup>*</sup></h6>
								<input type="text" className="form-control" placeholder="Graduating Year" name="graduatingYearOfStudents" value={this.state.course.graduatingYearOfStudents} onChange={this.handleInputChange} required={true} disabled/>
							</div>
							<div className="form-group text-left">
								<h6>Description<sup>*</sup></h6>
								<input type="text" className="form-control" placeholder="Description" name="description" value={this.state.course.description} onChange={this.handleInputChange} required={true}/>
							</div>
							<div className="form-group text-left">
								<h6>Hours<sup>*</sup></h6>
								<input type="number" className="form-control" placeholder="Hours" name="hours" value={this.state.course.details.hours} onChange={this.handleDetailsChange} required={true}/>
							</div>
							<div className="form-group text-left">
								<h6>Credits<sup>*</sup></h6>
								<input type="number" className="form-control" placeholder="Credits" name="credits" value={this.state.course.details.credits} onChange={this.handleDetailsChange} required={true}/>
							</div>
							<div className="form-row">								
    							<div className="form-group col-md-6">
      								<label htmlFor="startDate">Start Date</label>
      								<input type="date" name="startDate" className="form-control" value={this.state.course.duration.startDate} onChange={this.handleDurationChange}/>
    							</div>
    							<div className="form-group col-md-6">
      								<label htmlFor="inputState">End Date</label>
									<input type="date" name="endDate" className="form-control" value={this.state.course.duration.endDate} onChange={this.handleDurationChange}/>      								
    							</div>    
  							</div>
						</form>
						<hr></hr>
						<Button outline color="success" onClick={() => this.props.handleActivateCourse(this.state.course)}>Activate</Button>{' '}						
            		</CardBody>
          		</Card>
			);
		}
		// For activated courses
		else {	
			var courseGlance;	
			// If user is a course member (Add assignment available)		
			if(this.props.course.class.teachingMembers.find( teachingMember => teachingMember.teacher === self.props.userid)){
				courseGlance = (
					<div>
						<div className="row">        		
							<div className="col md 3">								
								<div className="form-group text-left">
									<h5>Course Code</h5>
									<p>{course.code}</p>
								</div>							
							</div>
							<div className="col md 3">								
								<div className="form-group text-left">
									<h5>Course Name</h5>
									<p>{course.name}</p>
								</div>
							</div>
							<div className="col md 3">
								<div className="form-group text-left">
									<h5>Department</h5>
									<p>{course.department}</p>
								</div>
							</div>						
							<div className="col md 3">
								<button type="button" className="btn btn-dark mx-3" onClick={this.toggleCreateAssignment}>Add Assignment</button>
							</div>
						</div>
						<Button color="link" onClick={this.toggle} style={{ marginBottom: '1rem' }}>View more details</Button>
					</div>
				)
				// Modal view to create an assignment under a course			
				createCourseModal = (
					<Modal isOpen={this.state.showModal} toggle={this.toggleCreateAssignment}>
						<ModalHeader toggle={this.toggleCreateAssignment}>Create Assignment</ModalHeader>
						<ModalBody>
							<form onSubmit={self.handleCreateAssignment}>
								<div className="form-group text-left">
									<h6>Course Name<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Name" name="courseName" value={this.state.course.name} onChange={this.handleInputChange} required={true} disabled/>
								</div>							
								<div className="form-group text-left">
									<h6>Code<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Code" name="courseCode" value={this.state.course.code} onChange={this.handleInputChange} required={true} disabled/>
								</div>
								<div className="form-group text-left">
									<h6>Assignment Name<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Assignment Name" name="assignmentName" required={true}/>
								</div>														
								<div className="form-group text-left">
									<h6>Assignment ID<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Assignment ID" name="assignmentID" required={true}/>
								</div>
								<div className="form-group text-left">
									<h6>Type<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Assignment Type" name="assignmentType" required={true}/>
								</div>
								<div className="form-group text-left">
									<h6>Details<sup>*</sup></h6>
									<input type="text" className="form-control" placeholder="Assignment Details" name="assignmentDetails" required={true}/>
								</div>
								<div className="form-group text-left">
									<h6>Maximum Marks<sup>*</sup></h6>
									<input type="number" className="form-control" placeholder="Maximum Marks" name="assignmentMaxMarks" required={true}/>
								</div>
								<div className="form-group text-left">
									<h6>Resources</h6>
									<input type="text" className="form-control" placeholder="Resource URLs" name="assignmentResources"/>
								</div>
								<div className="form-row">								
									<div className="form-group col-md-6">
										  <label htmlFor="startDate">Start Date<sup>*</sup></label>
										  <input type="date" name="assignmentStartDate" className="form-control" required={true}/>
									</div>
									<div className="form-group col-md-6">
										  <label htmlFor="inputState">End Date<sup>*</sup></label>
										<input type="date" name="assignmentEndDate" className="form-control" required={true}/>      								
									</div>    
								  </div>
								<Button color="success" type="submit">Submit</Button>	
							</form>
						</ModalBody>
						<ModalFooter>			  			
							  <Button color="secondary" onClick={this.toggleCreateAssignment}>Cancel</Button>
						</ModalFooter>
					</Modal>
				)				
			}	
			// If user is not a course member (Add assignment not available)
			else {
				courseGlance = (
					<div>
						<div className="row">        		
							<div className="col md 4">								
								<div className="form-group text-left">
									<h5>Course Code</h5>
									<p>{course.code}</p>
								</div>							
							</div>
							<div className="col md 4">								
								<div className="form-group text-left">
									<h5>Course Name</h5>
									<p>{course.name}</p>
								</div>
							</div>
							<div className="col md 4">
								<div className="form-group text-left">
									<h5>Department</h5>
									<p>{course.department}</p>
								</div>
							</div>												
						</div>
						<Button color="link" onClick={this.toggle} style={{ marginBottom: '1rem' }}>View more details</Button>
					</div>
				)
			}		
			
			var courseDetails = (
				<Card>
            		<CardBody>
						<form>
							<div className="form-group text-left">
								<h5>Course Name</h5>
								<p>{this.state.course.name}</p>
							</div>
							<div className="form-group text-left">
								<h5>Code</h5>
								<p>{this.state.course.code}</p>
							</div>
							<div className="form-group text-left">
								<h5>Department</h5>
								<p>{this.state.course.department}</p>
							</div>
							<div className="form-group text-left">
								<h5>Graduating Year</h5>
								<p>{this.state.course.graduatingYearOfStudents}</p>
							</div>
							<div className="form-group text-left">
								<h5>Description</h5>
								<p>{this.state.course.description}</p>
							</div>
							<div className="form-group text-left">
								<h5>Hours</h5>
								<p>{this.state.course.details.hours}</p>
							</div>
							<div className="form-group text-left">
								<h5>Credits</h5>
								<p>{this.state.course.details.credits}</p>
							</div>
							<div className="form-row">								
								<div className="form-group col-md-6">
									<h5>Start Date</h5>
									<p>{this.state.course.duration.startDate}</p>
								</div>
								<div className="form-group col-md-6">
									<h5>End Date</h5>
									<p>{this.state.course.duration.endDate}</p>
								</div>    
							</div>
						</form>
            		</CardBody>
          		</Card>
			);			
		}
    			
    	return (
      		<div id="cardContainer" style={{marginBottom:"20px"}}>
				{createCourseModal}
				<Card>				
					<CardBody>
						{courseGlance}
						<Collapse isOpen={this.state.collapse}>
							{courseDetails}
						</Collapse>
					</CardBody>
				</Card>
				<ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
      		</div>
    	)        
  	}
}

const mapStateToProps = (state) => {
	return {
		auth:state.auth
	}
}
export default connect(mapStateToProps)(CourseCard);
