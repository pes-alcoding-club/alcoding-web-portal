import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import AssignmentCard from './AssignmentCard';

class Assignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "student",
      assignments: [],
    };
    // functions
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

    var apiPath = '/api/assignments/:courseID/assignments'
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
    const profContent = (<div>Professor</div>);

    const studContent = (
    <div>
      {
        this.state.courses.map(function(each) {
          return <CourseCard key={each.code} name={each.name} code={each.code} description={each.description} resourceUrl={each.resourceUrl}/>
        })
      }
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

export default Assignments;
