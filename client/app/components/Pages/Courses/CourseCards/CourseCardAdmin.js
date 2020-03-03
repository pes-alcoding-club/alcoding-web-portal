import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Input, InputGroup, Collapse, Button, CardBody, Card, Badge, Table } from 'reactstrap';
import classnames from 'classnames';
import {connect} from 'react-redux';
import { ToastContainer, ToastStore } from 'react-toasts';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class CourseCardAdmin extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
      		courseID: '',
			collapse: false,
			course:null,					
			classes:[],
			selectedTeachers:[],
			selectedSections:[],
			showModal:false,	
			activeTab: 'professors',
			graduatingYearOfStudents: null
    	};
		this.toggle = this.toggle.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);		
		this.handleSectionsChange = this.handleSectionsChange.bind(this);		
		this.removeSelectedTeacher = this.removeSelectedTeacher.bind(this);
		this.toggleAddClass = this.toggleAddClass.bind(this);
		this.addClass = this.addClass.bind(this);
		this.removeClass = this.removeClass.bind(this);
		this.toggleTab = this.toggleTab.bind(this);
		this.createTeacherButtons = this.createTeacherButtons.bind(this);
		this.handleGraduatingYearChange = this.handleGraduatingYearChange.bind(this);
	}
	toggleTab(tab) { // To toggle between student and teacher tabs
		if(this.state.activeTab !== tab) 
			this.setState({
				activeTab:tab
			})
	}
	toggleAddClass() {	// For create assignment modal
		this.setState(state => ({ showModal: !state.showModal}));
	}
	handleSearch(event){
		const searchElement = event.target.value;
		const professorListElements = document.getElementsByClassName("professorListElement");
		for(const professorElement of professorListElements){						
			if(professorElement.getAttribute("profname").search(searchElement) != -1 || searchElement==="")
				professorElement.style.display = "table-row";
			else
				professorElement.style.display = "none";
		}
	}
	handleGraduatingYearChange(event){
		this.setState({
			graduatingYearOfStudents: event.target.value
		})
	}
	handleInputChange(event) {
		const updatedCourse = this.state.course;
		updatedCourse[event.target.name] = event.target.value;
        this.setState({
            course: updatedCourse
        })
	}  
	handleSectionsChange(event) {
		const sectionsInput = event.target.value;			
		const updatedSelectedSections = sectionsInput.split(",");		
		updatedSelectedSections.map(section => {
			if(section)
				return section.trim();
		});		
		this.setState({
            selectedSections: updatedSelectedSections
		})
	}
	toggle() { // For reactstrap Collapse component
		let selectedTeachers = this.state.selectedTeachers;
		let selectedSections = this.state.selectedSections;
		if(this.state.collapse == true){
			selectedSections = [];
			selectedTeachers = [] 
		}	
    	this.setState({ 
			collapse: !this.state.collapse,
			selectTeachers: selectedTeachers,
			selectedSections: selectedSections 
		});
	}
	addClass(){
		if(this.state.selectedSections.length && this.state.selectedTeachers.length && this.state.graduatingYearOfStudents != null) {
			const newClass = {};
			newClass.class = {};
			newClass.class.teachingMembers = this.state.selectedTeachers;
			newClass.class.sections = this.state.selectedSections;
			newClass.graduatingYearOfStudents = this.state.graduatingYearOfStudents;
			const classes = this.state.classes;
			classes.push(newClass);
			this.setState({
				classes:classes,
				selectedSections:[],
				selectedTeachers:[],
				graduatingYearOfStudents: null
			})
		}
		else
			ToastStore.error("Please add sections and corresponding teaching members, and a graduating year");
	}
	removeClass(index){
		let classes = this.state.classes;
		classes.splice(index, 1);
		this.setState({
			classes:classes
		})
	}
	selectTeacher(professor){				
		const selectedRole = document.getElementById(professor+"Role").value;
		if(!selectedRole){
			ToastStore.error("Please select a role");
			return;
		}		
		const updatedSelectedTeachers = this.state.selectedTeachers;				
		if(updatedSelectedTeachers.findIndex(item => item.teacher === professor) <0){
			updatedSelectedTeachers.push({teacher:professor, role:selectedRole});
			this.setState({selectedTeachers:updatedSelectedTeachers});
		}
	}
	removeSelectedTeacher(event){		
		const selectedTeachers = this.state.selectedTeachers;		
		const indexToBeRemoved = selectedTeachers.findIndex(teachingMember => teachingMember.teacher === event.target.id);		
		if(indexToBeRemoved >= 0){
			selectedTeachers.splice(indexToBeRemoved, 1);
			this.setState({
				selectedTeachers
			});		  		
		}		
	}
	createTeacherButtons(teachersList, canDelete = true){ // Returns a jsx button list of teaching members
		// canDelete flag to allow or disallow teaching member removal by clicin on the x in the button
		const teacherButtonList = teachersList.map((teachingMember) => {
			// Get the teacher name from my props (reduxed)
			const teacherName = this.props.collegeMembers.professors[teachingMember.teacher] || this.props.collegeMembers.students[teachingMember.teacher];
			if(canDelete)
				return(								
					<button style={{"margin":"5px"}} id={teachingMember.teacher} onClick={this.removeSelectedTeacher} type="button" class="btn btn-info">
						{teacherName.firstName+" "+teacherName.lastName}&nbsp; <span id={teachingMember.teacher} onClick={this.removeSelectedTeacher} class="badge badge-light">x</span>
					</button>				
				)
			return(								
				<button style={{"margin":"5px"}} id={teachingMember.teacher} type="button" class="btn btn-info">
					{teacherName.firstName+" "+teacherName.lastName}&nbsp;
				</button>				
			)
		})
		return teacherButtonList;
	}
	
	componentWillMount() {
	    this.setState({
			  courseID: this.props.course._id,
			  course: Object.assign({}, this.props.course)
    	})
  	}
  
  	render() {
		const course = this.props.course;    
		const selectedTeachers = this.createTeacherButtons(this.state.selectedTeachers);		
		if(this.props.collegeMembers.professors){
			const professors = this.props.collegeMembers.professors;
			var teachersList = Object.keys(professors).map((professorId) => {
				const profName = professors[professorId].firstName+" "+professors[professorId].lastName;
				return(
					<tr className="professorListElement" id={professorId} key={professorId} profname={profName}>
						<td>{profName}</td>     
						<td>
							<select id={professorId+"Role"} style={{"margin":"auto"}} name="roleSelector" className="form-control" required>
								<option value="" selected disabled hidden>Select role</option>
								<option>Anchor</option>
								<option>Professor</option>                            
								<option>Teaching Assistant</option>							
							</select>                    		
						</td>
						<td><Button outline color="success" onClick={()=>this.selectTeacher(professorId)}>+</Button>{' '}</td>						
					</tr>
				)				
			})
		}
		if(this.props.collegeMembers.students){
			const students = this.props.collegeMembers.students;
			var studentsList = Object.keys(students).map((studentId) => {
				const studentName = students[studentId].firstName+" "+students[studentId].lastName;
				return(
					<tr className="professorListElement" id={studentId} key={studentId} profname={studentName}>
						<td>{studentName}</td>					
						<td>
							<select id={studentId+"Role"} style={{"margin":"auto"}} name="roleSelector" className="form-control" required>
								<option value="" selected disabled hidden>Select role</option>
								<option>Anchor</option>
								<option>Professor</option>                            
								<option>Teaching Assistant</option>							
							</select>                    		
						</td>
						<td><Button outline color="success" onClick={()=>this.selectTeacher(studentId)}>+</Button>{' '}</td>
					</tr>
				)				
			})
		}
		let addedClasses = <p>No classes added yet</p>
		if(this.state.classes.length){
			addedClasses = this.state.classes.map((classObject, index) => {
				return (				
					<tr key={index} className="classListElement">
						<td>{classObject.class.sections.join(",")}</td>
						<td>{this.createTeacherButtons(classObject.class.teachingMembers, false)}</td>
						<td><button className="btn btn-danger" type="button" onClick={() => this.removeClass(index)}>X</button></td>
					</tr>
				)
			})			
		}		
		const teacherSelector = (
			<div>				
				<Nav tabs>
        			<NavItem>
          				<NavLink
            				className={classnames({ active: this.state.activeTab === 'professors' })}
            				onClick={() => { this.toggleTab('professors'); }}
          				>
            				Teachers
          				</NavLink>
        			</NavItem>
        			<NavItem>
          				<NavLink
            				className={classnames({ active: this.state.activeTab === 'students' })}
            				onClick={() => { this.toggleTab('students'); }}
          				>
            				Students
          				</NavLink>
        			</NavItem>
      			</Nav>
				<InputGroup>
					{/* <InputGroupAddon addonType="append">Search</InputGroupAddon> */}
					<Input onChange={this.handleSearch} placeholder={"Search"+" "+ this.state.activeTab} />
				</InputGroup>
				<TabContent activeTab={this.state.activeTab}>
        			<TabPane tabId="professors">
						<div style={{maxHeight:"200px", overflowY:"auto"}}>
							<Table>   
								<tbody>
									{teachersList}
								</tbody>     																
							</Table>											
						</div>
        			</TabPane>
			        <TabPane tabId="students">
						<div style={{maxHeight:"200px", overflowY:"auto"}}>
							<Table>   
								<tbody>
									{studentsList}
								</tbody>     																
							</Table>											
						</div>
        			</TabPane>
      			</TabContent>				
			</div>
		)
		const addClassModal = (
			<Modal isOpen={this.state.showModal} toggle={this.toggleAddClass}>
				<ModalHeader toggle={this.toggleAddClass}>Add class</ModalHeader>
				<ModalBody>	
					<div className="form-group text-left">
						<h6>Sections<sup>*</sup> (Comma seperated)</h6>
                    	<input type="text" className="form-control" placeholder="Sections" name="sections" value={this.state.selectedSections.join(",")} onChange={this.handleSectionsChange} required={true}/>
                	</div>
					<div className="form-group text-left">
						<h6>Graduating Year<sup>*</sup></h6>
						<select name="graduatingYearOfStudents" className="form-control" value={this.state.graduatingYearOfStudents} onChange = {this.handleGraduatingYearChange} required>
							<option value="" selected disabled hidden>Select Graduating Year</option>
							<option>2020</option>
							<option>2021</option>                            
							<option>2022</option>
							<option>2023</option>
						</select>                    		
					</div>	
					{selectedTeachers}			
					{teacherSelector}
				</ModalBody>
				<ModalFooter>			  			
					<Button color="primary" onClick={this.addClass}>Add Class</Button>
					<Button color="secondary" onClick={this.toggleAddClass}>Cancel</Button>
				</ModalFooter>
			</Modal>
		)
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
						<h4><Badge href="#" color="warning">Pending Approval</Badge></h4>
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
                    		<input type="text" className="form-control" placeholder="Name" name="name" value={this.state.course.name} onChange={this.handleInputChange} required={true} />
                		</div>
                		<div className="form-group text-left">
                    		<h6>Code<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="Code" name="code" value={this.state.course.code} onChange={this.handleInputChange} required={true} />
                		</div>
                		<div className="form-group text-left">
                    		<h6>Department<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="Department" name="department" value={this.state.course.department} onChange={this.handleInputChange} required={true} disabled/>
                		</div>
						<div className="form-group text-left">
                    		<h6>Classes<sup>*</sup></h6>
							<table style={{width:"100%"}}>
								{addedClasses}
							</table>
							<Button outline color="success" onClick={this.toggleAddClass}>Add Class</Button>{' '}                    		
                		</div>																				                		
					</form>
					<hr></hr>
					<Button outline color="success" onClick={() => this.props.handleApproveCourse(this.state.course, this.state.classes)}>Approve</Button>{' '}
					<Button outline color="danger" onClick={() => this.props.handleRejectCourse(this.state.courseID)}>Delete</Button>
            	</CardBody>
          	</Card>
		);		    		
	    return (
			<div id="cardContainer" style={{margin:"20px"}}>
				<Card>				
					<CardBody>
						{courseGlance}
						<Collapse isOpen={this.state.collapse}>
							{courseDetails}
							{addClassModal}
						</Collapse>
					</CardBody>
				</Card>
				<ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
			</div>
    	)        
	}
}

const mapStateToProps = (state) => {	
	return{
		collegeMembers:state.collegeMembers
	}
}
export default connect(mapStateToProps)(CourseCardAdmin);