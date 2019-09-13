import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, ToastStore } from 'react-toasts';
import CourseCard from './CourseCards/CourseCard';
import AnchorForm from './AnchorForm';
import ReactLoading from '../../common/Loading';

class CoursesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading:true,            
            role: '',
            tags: [],
            courses: [],
            showRequestCourse: false,
        };
        this.handleRequestCourse = this.handleRequestCourse.bind(this);    
        this.handleActivateCourse = this.handleActivateCourse.bind(this);    
        this.toggleRequestCourse = this.toggleRequestCourse.bind(this);                
    }
    handleActivateCourse(course){
        const apiPath = '/api/assignments/'+ course._id + '/createValidatedCourse';
		const token = localStorage.getItem('token');        
        const config = {
            headers: {
                'x-access-token': token,                
            }
		}		
		axios.put(apiPath, course,  config)
			.then(res=>{
				console.log(res);
				ToastStore.success(res.data.message);
			})
			.catch(err=>{
				console.log(err);
				ToastStore.error(err.response.data.message);
			})
    }
    handleRequestCourse(event) {        
        event.preventDefault();        
        const self = this;        
        const token = localStorage.getItem('token');
        const apiPath = 'api/assignments/requestCourse';
        const config = {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        }
        const requestCourseFormElements = event.target.getElementsByTagName("input");
        const requestCourseRoleElement = event.target.getElementsByTagName("select");
        const data = Object.assign({}, self.state.course);             
        data.name = requestCourseFormElements["name"].value;
        data.code = requestCourseFormElements["code"].value;
        data.department = requestCourseFormElements["department"].value; 
        data.role = requestCourseRoleElement["role"].value;                   
        axios.post(apiPath, data, config)
            .then(res => {
                console.log(res.data);
                ToastStore.success(res.data.message);
                setTimeout(() => {self.reload()},3000);        
            })
            .catch(err => {
                console.log(err);
                ToastStore.error(err.response.data.message);
            })        
    }   
    reload() {
        window.location.reload()
    }    
    toggleRequestCourse() {
        this.setState({
            showRequestCourse: !this.state.showRequestCourse
        })
    }    
    componentDidMount() {
        var self = this;
        var userID = localStorage.getItem('user_id');
        var token = localStorage.getItem('token')

        var apiPath = '/api/account/' + userID + '/details'
        axios.get(apiPath, {
            headers: {
                'x-access-token': token,
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
                _id: data.user._id,
                role: data.user.role,
                tags: data.user.tags
            });
        })
        .catch(function (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status) {
                    alert("Session timed out.");
                    window.location.href = '/';
                }
            }
        });
        ///api/assignments/:userID/getValidatedCourses        
        apiPath = 'api/assignments/' + userID + '/getValidatedCourses'
        axios.get(apiPath, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (!response.data.success) {
                console.log("Error1: " + response.data);
            }            
            self.setState({
                isLoading: false,
            })
            const courses = response.data.courses;
            if(courses){
                self.setState({                
                    courses: self.state.courses.concat(response.data.courses)
                });
            }            
            console.log(response.data);
        })
        .catch(function (error) {
            console.log('Error2: ', error);
        });

        apiPath = 'api/assignments/' + userID + '/courses'
        axios.get(apiPath, {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            if (!response.data.success) {
                console.log("Error1: " + response.data);
            }                        
            self.setState({
                isLoading: false,
            })
            const courses = response.data.courses;
            if(courses){
                self.setState({                
                    courses: self.state.courses.concat(response.data.courses)
                });
            }            
        })
        .catch(function (error) {
            console.log('Error2: ', error);
        });
    }                  
    render() {              
        const requestCourseForm = (
            <div>
                <h2>Request Course</h2>
                <hr></hr>
                <form onSubmit={this.handleRequestCourse}>
                    <div className="form-group text-left">
                        <h6>Course Name<sup>*</sup></h6>
                        <input type="text" className="form-control" placeholder="Name" name="name" value={this.state.name} onChange={this.handleInputChange} required={true} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Code<sup>*</sup></h6>
                        <input type="text" className="form-control" placeholder="Code" name="code" value={this.state.code} onChange={this.handleInputChange} required={true} />
                    </div>
                    <div className="form-group text-left">
                        <h6>Department<sup>*</sup></h6>
                        <input type="text" className="form-control" placeholder="Department" name="department" value="CSE" onChange={this.handleInputChange} required={true} disabled/>
                    </div>
                    <div className="form-group text-left">
                        <h6>Role<sup>*</sup></h6>
                        <select name="role" className="form-control" required>
                            <option>Professor</option>
                            <option>Teaching Assistant</option>                            
                            <option>Student</option>
                        </select>                             
                    </div>
                    <hr></hr>
                    <button type="submit" className="btn btn-dark mx-3 w-20 ">Submit</button>
                    <button type="close" className="btn mx-3 w-20" onClick={this.toggleRequestCourse}>Close</button>
                </form>
            </div>      
        )
        let courses = (
            <div>
                <div className="lead text-center mb-2">Sorry, no courses found.</div>
                <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
            </div>                 
        )
        if(this.state.courses.length){
            const self = this;                        
            courses = this.state.courses.map(function (course) {
                return (
                    <CourseCard  
                        userid={self.state._id} 
                        key={course._id} 
                        course={course}                         
                        handleActivateCourse={self.handleActivateCourse}>
                    </CourseCard>
                )
            })
        }
        const content = (
            <div className='row'>
                <div className='col-sm-8'>
                    <div>            
                        {courses}                        
                    </div>
                </div>
                <div className='col-sm-4'>
                    <div className='card bg-light text-center'>
                        <div className='card-body'>
                            {this.state.showRequestCourse ? null : <button type="button" className="btn btn-dark w-50 mx-3" onClick={this.toggleRequestCourse}>Request Course</button>}
                            {this.state.showRequestCourse ? requestCourseForm : null}
                        </div>
                    </div>
                </div>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
            </div>
        );
        
        if (this.state.isLoading)
            return <ReactLoading/>;
        else
            return <div>{content}</div>                            
    }
}

export default CoursesView;
