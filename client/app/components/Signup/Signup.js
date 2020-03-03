import React, { Component } from 'react'
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';
import ReactLoading from '../common/Loading';
import { ToastContainer, ToastStore } from 'react-toasts';
import { Button, Label } from 'reactstrap';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false            
        };   
        this.onSignup = this.onSignup.bind(this);             
    }

    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect push to='/' />
        }
    }

    onSignup(event){
        event.preventDefault();
        const formElements = event.target.elements; 
        console.log(formElements);               
        const firstName = formElements["firstName"].value;
        const lastName = formElements["lastName"].value;
        const email = formElements["emailid"].value;
        const password = formElements["password"].value;
        const confirmPassword = formElements["confirmPassword"].value;
        // TODO: Add signup validation with regex
        if(confirmPassword !== password){
            ToastStore.error("Passwords do not match");
            return;
        }
        const signupData = {
            firstName,
            lastName,
            email,
            password            
        }
        axios.post("/api/admin/signup", signupData)
            .then((res) => {
                console.log(res);
                ToastStore.success(res.data.message);
            })
            .catch((err) => {
                console.log(err.response);                
                ToastStore.error(err.response.data.message);
            })
    }

    render() {
        return (
            <div className="card bg-light">
                {this.renderRedirect()}
                <h4 className="card-header">Signup</h4>
                <div className="card-body">                    
                    <form onSubmit={this.onSignup}>  
                        <div className="form-group text-left">
                    		<h6>First Name<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="First Name" name="firstName" required={true} />
                		</div>
                		<div className="form-group text-left">
                    		<h6>Last Name<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="Last Name" name="lastName" required={true} />
                		</div>
                        <div className="form-group text-left">
                    		<h6>Email ID<sup>*</sup></h6>
                    		<input type="text" className="form-control" placeholder="Email ID" name="emailid" required={true} />
                		</div>
                        <div className="form-group text-left">
                    		<h6>Password<sup>*</sup></h6>
                    		<input type="password" className="form-control" placeholder="Password" name="password" required={true} />
                		</div>
                        <div className="form-group text-left">
                    		<h6>Retype Password<sup>*</sup></h6>
                    		<input type="password" className="form-control" placeholder="Retype Password" name="confirmPassword" required={true} />
                		</div>                                              
                        <Button color="dark">Signup</Button>
                    </form>
                </div>                
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_LEFT} />
            </div>
        )
    }
}