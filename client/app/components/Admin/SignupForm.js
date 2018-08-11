import React, { Component } from 'react';
import axios from 'axios';

class SignupForm extends Component {
	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
		this.fileInput = React.createRef();
	}

	handleSubmit(event) {
		event.preventDefault();
		var fileObj = this.fileInput.current.files[0];
		var token = 'Bearer ' + localStorage.getItem('token');
		var configSignup = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': token
			}
		};
		var signUpUrl = '/api/admin/signup';
		const NO_OF_MANDATORY_FIELDS = 3; //NUMBER OF FIELDS MANDATORY FOR SIGNUP.
		var reader = new FileReader();
		reader.onload = function (file) {
			var data = file.target.result.split('\n');
			var row, invalid, attributes,count;
			for (var row_count = 0; row_count < data.length; row_count++) {
				row = data[row_count];
				invalid = 0;
				attributes = row.split(',');
				for (count = 0; count < NO_OF_MANDATORY_FIELDS; count++) {
					if (attributes[count] == "") { invalid = 1; }
				};//to check cases where there are blank fields for each user
				if (!invalid) {
					var body = "firstName=" + attributes[0];
					body += '&email=' + attributes[1];
					body += '&usn=' + attributes[2];

					axios.post(signUpUrl, body, configSignup)
						.then(function (response) {
						    console.log(response.data);
						 })
						.catch(function (err) {
						    console.log(err);
						 })
				}
				else {
					console.log("error at user: " + attributes);
				}
			}
		}
		
		if (fileObj) {
			reader.readAsText(fileObj, "UTF-8");
		}
		else { console.log('Please Upload a file!'); }
	}

	render() {
		return (
			<div className='container-fluid'>
				<h3>Upload Student Details :</h3>
				<form id="formObject">
					<span>Please upload a .csv file</span>
					<input type="file" className="btn btn-default form-control" ref={this.fileInput} />
					<br />
					<button type="submit" className="btn btn-dark form-control w-25" onClick={this.handleSubmit}>Submit</button>
				</form>
			</div>
		);
	}
}

export default SignupForm;
