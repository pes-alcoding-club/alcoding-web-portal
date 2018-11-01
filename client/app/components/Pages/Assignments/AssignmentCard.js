import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import viewSubmissions from './viewSubmissions';

class AssignmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      file: null,
      showUpload: true
    })
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    var userID = localStorage.getItem('user_id');
    var success = 0;
    if (this.props.submissions.length) {
      for (var i = 0; i < this.props.submissions.length; i++) {
        var submission = this.props.submissions[i];
        if (submission.user == userID) {
          this.setState({
            showUpload: false
          })
        }
      }
    }

    else {
      this.setState({
        showUpload: true
      })
    }
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  onSubmit(event) {
    event.preventDefault();
    var self = this
    var userID = localStorage.getItem('user_id');
    var token = 'Bearer ' + localStorage.getItem('token');
    var assignmentID = this.props.assignmentID;
    var inputData = new FormData();
    inputData.append("inputFile", this.state.file);
    var config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }

    var apiPath = 'api/assignments/' + userID + '/' + assignmentID + '/upload'
    axios.post(apiPath, inputData, config)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          self.setState({
            showUpload: false
          })
        }
        else {
          alert('Assignment failed to upload!')
        }
      })

  }

  render() {
    const toUpload = (
      <div className="row">
        <div className="custom-file col-4">
          {/* <input type="file" className="custom-file-input" id="validatedCustomFile" onChange={this.onChange}/>
          <label className="custom-file-label" for="validatedCustomFile">Choose file</label> */}
          <input type="file" onChange={this.onChange} /><br />
        </div>
        <div className="col-8">
          <button className="btn btn-dark" onClick={this.onSubmit}> Submit </button>
        </div>
      </div>
    );
    let content;
    const profContent = (
      <div id="AssignmentCard">
        <div className="card bg-light mx-auto">
          <div className="card-title"><h3><i>{this.props.uniqueID}</i>: <strong>{this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            Description: {this.props.details}<br />
            Type: {this.props.type}<br />
            Due Date: {this.props.dueDate}<br />
            Maximum Marks: {this.props.maxMarks}<br />
            Resource URL: <a href={'//' + this.props.resourceUrl}>{this.props.resourceUrl}</a><br /><br />
            <Link className='btn btn-dark mx-2' to={{
              pathname: '/assignments/' + this.props.assignmentID,
              state: {
                uniqueID: this.props.uniqueID,
                name: this.props.name,
                details: this.props.details,
                type: this.props.type,
                dueDate: this.props.dueDate,
                maxMarks: this.props.maxMarks,
                resourceUrl: this.props.resourceUrl
              }
            }}> View Assignment </Link>
            <Link className='btn btn-dark mx-2' to={{
              pathname: '/assignments/submissions/' + this.props.uniqueID,
              state: {
                assignmentID: this.props.assignmentID
              }
            }}> View Submissions </Link>

          </div>
        </div>
        <br />
      </div>
    );
    const studContent = (
      <div id="AssignmentCard">
        <div className="card bg-light mx-auto">
          <div className="card-title"><h3><i>{this.props.uniqueID}</i>: <strong>{this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            Description: {this.props.details}<br />
            Type: {this.props.type}<br />
            Due Date: {this.props.dueDate}<br />
            Maximum Marks: {this.props.maxMarks}<br />
            Resource URL: <a href={'//' + this.props.resourceUrl}>{this.props.resourceUrl}</a><br /><br />
            {this.state.showUpload ? toUpload : <h6 className="text-info">Assignment Submitted!</h6>}
          </div>
        </div>
        <br />
      </div>
    );

    if (this.props.role == "prof") {
      content = profContent;
    }
    else {
      content = studContent;
    }

    return (
      <div>{content}</div>

    )
  }
}

export default AssignmentCard;
