import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // functions
  }

  componentDidMount(){
    var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');
    if(!token || !userID){
      console.log("Not logged in.");
      <Redirect to="/" />
    }

    var apiPath = '/api/'
  }

}

export default Courses;