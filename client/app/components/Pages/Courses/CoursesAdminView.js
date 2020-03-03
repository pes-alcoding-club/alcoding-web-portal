import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, ToastStore } from 'react-toasts';
import CourseCardAdmin from './CourseCards/CourseCardAdmin';
import AnchorForm from './AnchorForm';
import ReactLoading from '../../common/Loading';
import { connect } from 'react-redux';

class CoursesAdminView extends Component {
  	constructor(props) {
	    super(props);
    	this.state = {
      		isLoading: true,
      		role: '',
      		tags: [],
      		courses: []      
		};
		this.handleApproveCourse = this.handleApproveCourse.bind(this);
		this.handleRejectCourse = this.handleRejectCourse.bind(this);
	}	
	reload() {
    	window.location.reload()
  	}    	
	getCollegeMemberName(user_id){
		const token = localStorage.getItem('token');        
		return new Promise((resolve, reject) => {
			axios.get('/api/account/'+user_id+'/info', {
				headers: {
					'x-access-token': token,
					'Content-Type': 'application/json'
				}
			})		
			.then(function(response) {
				resolve({
					name:response.data.user.name,
					id:user_id
				});
			})	
			.catch(err => {
				reject(err);
			})
		})		
	}
	handleApproveCourse(course, classes){
		const self = this;
		const apiPath = '/api/courseAdmin/'+ course._id + '/validate';
		const token = localStorage.getItem('token');        
        const config = {
            headers: {
                'x-access-token': token,                
            }
		}		
		course.classes = classes;
		axios.put(apiPath, course,  config)
			.then(res=>{
				console.log(res);
				ToastStore.success(res.data.message);
				setTimeout(() => {self.reload()},2000);
			})
			.catch(err=>{
				console.log(err);
				ToastStore.error(err.response.data.message);
			})		
	}  	
	handleRejectCourse(courseID){
		const apiPath = '/api/courseAdmin/'+ courseID + '/delete';
		const token = localStorage.getItem('token');        
        const config = {
            headers: {
                'x-access-token': token                
            }
		}
		axios.delete(apiPath, config)
			.then((res) => {
				console.log(res);
				ToastStore.success(res.data.message);
			})
			.catch((err)=>{
				console.log(err);
				ToastStore.error(err.response.data.message);
			})
	}  

  	componentDidMount() {		
    	var self = this;
	    var userID = localStorage.getItem('user_id');
	    var token = localStorage.getItem('token');
    
		// /api/courseAdmin/newCourses
		var apiPath = '/api/courseAdmin/newCourses'; 
		axios.get(apiPath, { // Fetch all course requests 
			headers: {
				'x-access-token': token,
				'Content-Type': 'application/json'
			}
		})
		.then(function (response) {									
			self.setState({				
				courses: response.data.courses,
				isLoading: false
			});			
		})
		.catch(function (error) {
			console.log(error);
		});
		var apiPath = '/api/courseAdmin/getCollegeMembers';
		axios.get(apiPath, { // Fetch all department members (For prof suggestions during course assigning)
			headers: {
				'x-access-token': token,
				'Content-Type': 'application/json'
			}
		})
		.then(function (response) {			
			const fetchedGroups = response.data.groups;
			let fetchedProfMembers = fetchedGroups.find(group => group.name === "prof");
			let fetchedStudentMembers = fetchedGroups.find(group => group.name === "students");
			if(!fetchedProfMembers)
				fetchedProfMembers = [];
			else
				fetchedProfMembers = fetchedProfMembers.members;												
			if(!fetchedStudentMembers)
				fetchedStudentMembers = [];
			else
				fetchedStudentMembers = fetchedStudentMembers.members;			
			Promise.all(fetchedProfMembers.map(teacherMember => self.getCollegeMemberName(teacherMember)))
				.then( values => {	
					const professorsObj = {}; // Key - id, value - name
					for(const prof of values)
						professorsObj[prof.id] = prof.name;										
					self.props.dispatch({ 
						type:"FETCHED_PROFS",
						payload:professorsObj						
					})
				})
				.catch(err =>{
					console.log(err);
				})
			Promise.all(fetchedStudentMembers.map(student => self.getCollegeMemberName(student)))
				.then( values => {	
					const studentsObj = {}; // Key - id, value - name
					for(const student of values)
						studentsObj[student.id] = student.name;										
					self.props.dispatch({ 
						type:"FETCHED_STUDENTS",
						payload:studentsObj						
					})
				})
				.catch(err =>{
					console.log(err);
				})
		})
		.catch(function (error) {
			console.log(error);
		});


		var apiPath = '/api/account/:userID/details';
  	}  	    	    	
  	render() {						
		let body = (
			<div>
                <div className="lead text-center mb-2">No course requests available.</div>
                <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
            </div>
		)
		if(this.state.courses.length){
			body = this.state.courses.map((course) => {
				return(				
					<CourseCardAdmin 
						course={course} 
						handleRejectCourse={this.handleRejectCourse}
						handleApproveCourse={this.handleApproveCourse} 					
					/>				
				);			
			})		
		}		
		return(			
			<div>
				{body}
				<ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
			</div>			
		);
	}    
}
const mapStateToProps = (state) => {
	return{
		collegeMembers:state.collegeMembers
	}			
}
export default connect(mapStateToProps)(CoursesAdminView);