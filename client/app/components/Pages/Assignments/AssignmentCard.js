import React, { Component } from 'react';
import axios from 'axios';

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
    if (!this.props.submissions.length) {
      this.setState({
        showUpload: true
      })
    } else {
      this.setState({
        showUpload: false
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

    var apiPath = 'api/assignment/' + userID + '/' + assignmentID + '/upload'
    axios.post(apiPath, inputData, config)
      .then(res => {
        console.log(res.data)
        if (res.data.success) {
          self.setState({
            showUpload: false
          })
        }
        else{
          alert('Assignment failed to upload!')
        }
      })

  }

  render() {
    const toUpload = (
      <div>
        <input type="file" className="btn btn-default pl-0" placeholder="Upload File" onChange={this.onChange} />
        <br />
        <button className="btn btn-dark" onClick={this.onSubmit}> Submit </button>
      </div>
    );
    return (
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
  }
}

export default AssignmentCard;
