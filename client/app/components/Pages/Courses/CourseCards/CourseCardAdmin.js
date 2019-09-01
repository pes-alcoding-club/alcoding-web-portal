import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Input, InputGroup, InputGroupAddon, Collapse, Button, CardBody, Card, Badge, Table } from 'reactstrap';
import axios from 'axios';
import {connect} from 'react-redux';

class CourseCardAdmin extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
      		courseID: '',
			collapse: false,
			course:null,						
    	};
		this.toggle = this.toggle.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);		
		this.handleSectionsChange = this.handleSectionsChange.bind(this);		
		this.removeSelectedTeacher = this.removeSelectedTeacher.bind(this);
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
	handleInputChange(event) {
		const updatedCourse = this.state.course;
		updatedCourse[event.target.name] = event.target.value;
        this.setState({
            course: updatedCourse
        })
	}  
	handleSectionsChange(event) {
		const sectionsInput = event.target.value;		
		const updatedCourse = this.state.course;
		updatedCourse.class.sections = sectionsInput.split(",");
		updatedCourse.class.sections.map(section => {
			if(section)
				return section.trim();
		});		
		this.setState({
            course: updatedCourse
        })
	}
  	toggle() { // For reactstrap Collapse component
    	this.setState(state => ({ collapse: !state.collapse }));
	}
	selectTeacher(professor){		
		const course = this.state.course;		
		const updatedSelectedTeachers = course.class.teachingMembers;				
		if(updatedSelectedTeachers.findIndex(item => item.teacher === professor) <0){
			updatedSelectedTeachers.push({teacher:professor});
			this.setState({course});
		}					
	}
	removeSelectedTeacher(event){		
		const course = this.state.course;		
		const indexToBeRemoved = course.class.teachingMembers.findIndex(teachingMember => teachingMember.teacher === event.target.id);		
		if(indexToBeRemoved >= 0){
			course.class.teachingMembers.splice(indexToBeRemoved, 1);
			this.setState({
				course
			});		  		
		}		
	}  
	
	componentWillMount() {
	    this.setState({
			  courseID: this.props.course._id,
			  course: Object.assign({}, this.props.course)
    	})
  	}
  
  	render() {						
		const self = this;
		const course = this.props.course;				
		const selectedTeachers = this.state.course.class.teachingMembers.map((teachingMember) => {			
			const teacherName = self.props.professors[teachingMember.teacher];
			return(
				<Badge id={teachingMember.teacher} onClick={this.removeSelectedTeacher} color="primary">{teacherName.firstName+" "+teacherName.lastName}</Badge>
			)		
		})		
		if(this.props.professors){
			var teachersList = Object.keys(this.props.professors).map((professorId) => {
				const profName = this.props.professors[professorId].firstName+" "+this.props.professors[professorId].lastName;
				return(
					<tr className="professorListElement" id={professorId} key={professorId} profname={profName}>
						<td>{profName}</td>					
						<td><Button outline color="success" onClick={()=>this.selectTeacher(professorId)}>+</Button>{' '}</td>
					</tr>
				)				
			})
		}		
		const teacherSelector = (
			<div>
				<InputGroup>
					<InputGroupAddon addonType="prepend">Search</InputGroupAddon>
					<Input onChange={this.handleSearch} placeholder="Search Professor" />
				</InputGroup>
				<div style={{maxHeight:"200px", overflowY:"auto"}}>
					<Table>   
						<tbody>
							{teachersList}
						</tbody>     																
					</Table>											
				</div>
			</div>
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
						<Badge href="#" color="warning">Pending Approval</Badge>
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
                    		<h6>Graduating Year<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="Graduating Year" name="graduatingYearOfStudents" value={this.state.course.graduatingYearOfStudents} onChange={this.handleInputChange} required={true}/>
                		</div>
						<div className="form-group text-left">
                    		<h6>Sections<sup>*</sup> (Comma seperated)</h6>
                    		<input type="text" className="form-control" placeholder="Sections" name="sections" value={this.state.course.class.sections.join(",")} onChange={this.handleSectionsChange} required={true}/>
                		</div>
						<div className="form-group text-left">
                    		<h6>Teachers<sup>*</sup></h6>
							{selectedTeachers}	
							{teacherSelector}							
                		</div>
					</form>
					<hr></hr>
					<Button outline color="success" onClick={() => this.props.handleApproveCourse(this.state.course)}>Approve</Button>{' '}
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
						</Collapse>
					</CardBody>
				</Card>
			</div>
    	)        
	}
}

const mapStateToProps = (state) => {	
	return{
		professors:state.profs.professors
	}
}
export default connect(mapStateToProps)(CourseCardAdmin);
