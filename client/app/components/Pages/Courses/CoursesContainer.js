import React, {Component} from 'react';
import axios from 'axios';
import CoursesAdminView from './CoursesAdminView';
import CoursesView from './CourseView';
import Loading from '../../common/Loading'

class CoursesContainer extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {      
      		role: '',
	    	tags: []
    	};    
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
          		role: data.user.role,
		  		tags: data.user.tags,
		  		token:token
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
	}
  	render() {
		if(this.state.role === 'courseAdmin'){
		  	return <CoursesAdminView role={this.state.role} tags={this.state.tags}></CoursesAdminView>
	  	}
	  	else if(this.state.role!=''){
		  	return <CoursesView role={this.state.role} tags={this.state.tags}></CoursesView>
	  	}
	  	else{
		  	return <Loading></Loading>
	  	}	
  	}
}
export default CoursesContainer;