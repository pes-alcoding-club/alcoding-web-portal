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
		var formData = new FormData();
		formData.append("inputFile", fileObj);
		
		var token = 'Bearer ' + localStorage.getItem('token');

		var config={
			headers : {
				'Content-Type': 'multipart/form-data',
				'Authorization': token	
			}
		};
		axios.post('http://127.0.0.1:8080/api/admin/upload', formData, config)
			.then(res => {
				console.log(res);
				console.log(res.data);
			})
	}

	render() {
		return (
			<div>
				<h3>Upload Student Details :</h3>
				<form id="formObject" onChange={this.handleSubmit}>
					<span>Please upload a .csv file</span>
					<input type="file" className="form-control w-25 center" ref={this.fileInput} />
					<br />
					<button type="submit" className="form-control w-25">Submit</button>
				</form>
			</div>
		);
	}
}

export default SignupForm;
