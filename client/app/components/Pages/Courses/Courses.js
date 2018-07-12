import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import CourseCard from './CourseCard';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      code: '',
      department: '',
      description: '',
      resourceUrl: '',
      role: "student",
      courses: [],
    };
  };
    // functions
  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeCode(event) {
    this.setState({code: event.target.value});
  }

  handleChangeDept(event) {
    this.setState({department: event.target.value});
  }

  handleChangeDescription(event) {
    this.setState({description: event.target.value});
  }

  handleChangeURL(event) {
    this.setState({resourceUrl: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    const Courses = {
      name: this.state.name,
      code: this.state.code,
      department: this.state.department,
      description: this.state.description,
      resourceUrl: this.state.resourceUrl
    }

    axios.post("/api/course/${userID}/createCourse", {Courses});
}

  componentDidMount(){
    var self = this;
    var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');

    if(!token || !userID){
      console.log("Not logged in.");
      <Redirect to="/" />
    }
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
              role: data.user.role
            });
          })
          .catch(function (error) {
            console.log('Error2: ', error);
          });

    var apiPath = '/api/assignments/'+ userID +'/courses'
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
          <Redirect to="/" />
      }
      var data = response.data;
      console.log(data);
      self.setState({ 
          courses: data.courses.courses
      });
    })
    .catch(function (error) { 
      console.log('Error2: ', error);
    });

  }

  render(){
    let content;
    const profContent = (
        <form onSubmit={this.handleSubmit}>
         <label>
            Name of the Course:
            <input type="text" name="name" onChange={this.handleChangeName}/><br></br>
          
            Code:
            <input type="text" name="code" onChange={this.handleChangeCode}/><br></br>
        
            Department:
            <input type="text" name="department" onChange={this.handleChangeDept}/><br></br>
         
            Description of Course:
           <input type="text" name="description" onChange={this.handleChangeDescription}/><br></br>
        
            Resource URL:
            <input type="text" name="resourseUrl" onChange={this.handleChangeURL}/><br></br>
         </label><br></br>
         <button type="submit">
            Add Course
         </button>
        </form>
    );
    const studContent = (
    <div>
      {
        this.state.courses.map(function(each) {
          return <CourseCard key={each.code} name={each.name} code={each.code} description={each.description} resourceUrl={each.resourceUrl}/>
        })
      }
      <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
    </div>

    );
    if(this.state.role=="professor"){
      content = profContent;
    }
    else{
      content = studContent;
    }


    return(
      <div>{content}</div>
      
    )
  }
}

export default Courses;
