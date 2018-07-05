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
		var configUpload = {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': token
			}
		};
		var all_users=[];
		if (fileObj) {
			var reader = new FileReader();
			reader.onload = function (file) {
			var data= file.target.result.split('\n');
			data.splice(-1, 1); //splice used to remove one last empty element that gets added due to the csv formatting
			const NO_OF_MANDATORY_FIELDS = 4; //MODIFY ACCORDING TO NUMBER OF FIELDS REQUIRED FOR SIGNUP
			var row, valid_count=0;
				for (row in data) {
				var invalid=0;
				var attributes = data[row].split(',');
					for(var count=0;count<NO_OF_MANDATORY_FIELDS;count++){
						if(attributes[count]==""){invalid=1;}
					};//to check cases where there are blank fields for each user
					if (!invalid) {
						valid_count++;
						//TODO : IMPROVE THE WAY 'BODY' IS CONSTRUCTED
						var body = "firstName=" + attributes[0];
						body += '&email=' + attributes[1];
						body += '&password=' + attributes[2];
						body += '&usn=' + attributes[3];
						all_users.push(body);//append valid users to a list all_users
					}
				}
				var total_rows=(++row);
				if(total_rows==valid_count){
					//if valid rows and total rows are same
					//upload the file and signup all users
					
					var uploadUrl = '/api/admin/upload'
					var formData = new FormData();
					formData.append("inputFile", fileObj);
					axios.post(uploadUrl, formData, configUpload)
					.then(res => {
						console.log(res);
						console.log(res.data);
					})

					var signUpUrl = '/api/admin/signup';
					all_users.forEach(function(body) {
    					axios.post(signUpUrl, body, configSignup)
						.then(res => {
							console.log(res);
							console.log(res.data);
						})
						.catch(err =>
							console.log(err)
						)
					});	

				}
				else{console.log("all users in csv files are not valid!");}

			}
			reader.readAsText(fileObj, "UTF-8");
			
		}
		else{console.log('UPLOAD FILE PLEASE!');}
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
