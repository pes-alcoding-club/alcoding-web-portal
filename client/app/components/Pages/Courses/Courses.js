import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import CourseCard from '../Courses/CourseCard';

class CoursesAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      name: '',
      code: '',
      department: '',
      description: '',
      resourcesUrl: '',
      startDate: '',
      endDate: '',
      credits: '',
      hours: '',
      isCore: '',
      courses: [],
      show: false
    };
    this.onAdd = this.onAdd.bind(this);
    this.showForm = this.showForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCreditsChange = this.handleCreditsChange.bind(this);
    this.handleURLChange = this.handleURLChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleisCoreChange = this.handleisCoreChange.bind(this);
    this.handleHoursChange = this.handleHoursChange.bind(this);

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
          role: data.user.role
        });
      })
      .catch(function (error) {
        console.log('Error2: ', error);
      });
    ///api/assignments/:userID/courses
    var apiPath = 'api/assignments/' + userID + '/courses'
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      if (!response.data.success) {
        console.log("Error1: " + response.data);
      }
      var data = response.data;
      self.setState({
        courses: self.state.courses.concat(data.courses.courses)
      });
      console.log(response.data);
    })
      .catch(function (error) {
        console.log('Error2: ', error);
      });
  }
  handleNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }
  handleCodeChange(e) {
    this.setState({
      code: e.target.value
    })
  }
  handleDepartmentChange(e) {
    this.setState({
      department: e.target.value
    })
  }
  handleDescriptionChange(e) {
    this.setState({
      description: e.target.value
    })
  }
  handleCreditsChange(e) {
    this.setState({
      credits: e.target.value
    })
  }
  handleURLChange(e) {
    this.setState({
      resourcesUrl: e.target.value
    })
  }
  handleStartDateChange(e) {
    this.setState({
      startDate: e.target.value
    })
  }
  handleEndDateChange(e) {
    this.setState({
      endDate: e.target.value
    })
  }
  handleisCoreChange(e) {
    this.setState({
      isCore: e.target.value
    })
  }
  handleHoursChange(e) {
    this.setState({
      hours: e.target.value
    })
  }
  reload() {
    window.location.reload()
  }

  onAdd() {
    ///api/courses/:userID/createCourse
    var self = this;
    var userID = localStorage.getItem('user_id');
    var token = localStorage.getItem('token');
    var apiPath = 'api/courses/' + userID + '/createCourse';
    var config = {
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json'
      }
    }
    var data = Object.assign({}, self.state.course);

    data.name = self.state.name;
    data.code = self.state.code;
    data.department = self.state.department;
    data.description = self.state.description;
    data.resourcesUrl = self.state.resourcesUrl;
    var details = { credits: self.state.credits, hours: self.state.hours, isCore: self.state.isCore }
    data.details = details;
    var duration = { startDate: self.state.startDate, endDate: self.state.endDate }
    data.duration = duration;
    data = JSON.stringify(data)
    console.log(data)
    axios.post(apiPath, data, config)
      .then(res => {
        console.log(res.data);
        this.reload();
      })
      .catch(err => {
        console.log(err);
        alert('Course Failed to Upload!')
      })

  }
  showForm() {
    this.setState({
      show: true
    })
  }
  closeForm() {
    this.setState({
      show: false
    })
  }


  render() {
    let content;
    const click = (
      <div>
        <form>
          <div className="form-group text-left">
            <h6>Course Name</h6>
            <input type="text" className="form-control" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
          </div>
          <div className="form-group text-left">
            <h6>Code</h6>
            <input type="text" className="form-control" placeholder="Code" value={this.state.code} onChange={this.handleCodeChange} />
          </div>
          <div className="form-group text-left">
            <h6>Department</h6>
            <input type="text" className="form-control" placeholder="Department" value={this.state.department} onChange={this.handleDepartmentChange} />
          </div>
          <div className="form-group text-left">
            <h6>Course Description</h6>
            <textarea className="form-control" placeholder="Description" value={this.state.description} onChange={this.handleDescriptionChange} />
          </div>
          <div className="form-group text-left">
            <h6>Credits</h6>
            <input type="number" className="form-control" placeholder="Credits" value={this.state.credits} onChange={this.handleCreditsChange} />
          </div>
          <div className="form-group text-left">
            <h6>Duration</h6>
            <label>Start Date</label>
            <input type="date" className="form-control" placeholder="Start Date" value={this.state.startDate} onChange={this.handleStartDateChange} />
            <label>End Date</label>
            <input type="date" className="form-control" placeholder="End Date" value={this.state.endDate} onChange={this.handleEndDateChange} />
            <label>Number of Hours</label>
            <input type="number" className="form-control" placeholder="Hours" value={this.state.hours} onChange={this.handleHoursChange} />
          </div>
          <div className="form-group text-left">
            <h6>Resources</h6>
            <input type="url" className="form-control" placeholder="URLs" value={this.state.resourcesUrl} onChange={this.handleURLChange} />
          </div>


        </form>
      </div>
    )

    const profContent = (
      <div className='row'>
        <div className='col-sm-7'>

          <div>
            {
              this.state.courses.map(function (each) {
                return <CourseCard key={each.code} code={each.code} name={each.name} department={each.department} description={each.description} credits={each.credits} resourceUrl={each.resourceUrl} courseID={each._id} role='prof' />
              })
            }
            <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
          </div>
        </div>
        <div className='col-sm-5'>
          <div className='card bg-light text-center'>
            <div className='card-body'>
              {this.state.show ? click : <button type="button" className="btn btn-dark w-50 mx-3" onClick={this.showForm}>Add Course</button>}
              {this.state.show ? <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.onAdd}>Submit</button> : null}
              {this.state.show ? <button type="close" className="btn mx-3 w-20" onClick={this.closeForm}>Close</button> : null}

            </div>
          </div>
        </div>
      </div>



    );
    const studContent = (
      <div>
        {
          this.state.courses.map(function (each) {
            return <CourseCard key={each.code} code={each.code} name={each.name} department={each.department} description={each.description} credits={each.credits} resourceUrl={each.resourceUrl} courseID={each._id} role='student' />
          })
        }
        <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
      </div>
    );
    if (this.state.role == "prof") {
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

export default CoursesAdd;