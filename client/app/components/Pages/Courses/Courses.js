import React, { Component } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import CourseCard from '../Courses/CourseCard';
import AnchorForm from './AnchorForm';
import ReactLoading from './../../common/Loading';

class CoursesAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
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
      profRole: '',
      professorID: '',
      classes: [],
      sections: '',
      graduating: '',
      anchorDescription: '',
      show: false,
    };
    this.onAdd = this.onAdd.bind(this);
    this.showForm = this.showForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.chooseProfRole = this.chooseProfRole.bind(this);
    this.chooseAnchorRole = this.chooseAnchorRole.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCreditsChange = this.handleCreditsChange.bind(this);
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
        console.log(error);
        if (error.response) {
          if (error.response.status) {
            alert("Session timed out.");
            window.location.href = '/';
          }
        }
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
      self.setState({ isLoading: false });
      self.setState({
        courses: self.state.courses.concat(data.courses)
      });
      console.log(response.data);
    })
      .catch(function (error) {
        console.log('Error2: ', error);
      });
  }
  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  handleCreditsChange(e) {
    this.setState({
      credits: e.target.value
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
    ///api/courses/createCourse
    var self = this;
    var userID = localStorage.getItem('user_id');
    var token = localStorage.getItem('token');
    var apiPath = 'api/assignments/createCourse';
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
    data.graduating = self.state.graduating;
    if ("prof".localeCompare(self.state.profRole) == 0) {
      data.professorID = self.state.professorID;
      data.sections = self.state.sections
      data.role = 'prof';
      console.log(data);
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
  }
  showForm() {
    this.setState({
      show: true
    })
  }
  closeForm() {
    this.setState({
      show: false,
      profRole: ''
    })
  }
  chooseProfRole() {
    this.setState({
      profRole: 'prof'
    })
  }
  chooseAnchorRole() {
    this.setState({
      profRole: 'anchor'
    })
  }


  render() {
    let content;
    const chooseRole = (
      <div>
        <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.chooseProfRole}>Professor</button>
        <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.chooseAnchorRole}>Anchor</button>
      </div>
    )

    const professorBoxes = (
      <div className="form-group text-left">
        <h6>Sections<sup>*</sup></h6>
        <input type="text" className="form-control mb-3" placeholder="Enter Sections with a comma in between" name="sections" value={this.state.sections} onChange={this.handleInputChange} />
        <h6>Professor<sup>*</sup></h6>
        <input type="text" className="form-control" placeholder="Professor of Class" name="professorID" value={this.state.professorID} onChange={this.handleInputChange} />
      </div>
    )

    const anchorBoxes = (
      <div>
        <AnchorForm name={this.state.name} code={this.state.code} department={this.state.department} description={this.state.description} resourcesUrl={this.state.resourcesUrl} credits={this.state.credits} hours={this.state.hours} isCore={this.state.isCore} startDate={this.state.startDate} endDate={this.state.endDate} graduating={this.state.graduating} professorID={this.state.professorID} anchorDescription={this.state.anchorDescription} />
      </div>
    )

    const anchorDescription = (
      <div className="form-group text-left">
        <h6>Anchor Description</h6>
        <textarea className="form-control" placeholder="Anchor Description" name="anchorDescription" value={this.state.anchorDescription} onChange={this.handleInputChange} />
      </div>
    )

    const description = (
      <div className="form-group text-left">
        <h6>Course Description</h6>
        <textarea className="form-control" placeholder="Description" name="description" value={this.state.description} onChange={this.handleInputChange} />
      </div>
    )

    const click = (
      <div>
        <form>
          <div className="form-group text-left">
            <h6>Course Name<sup>*</sup></h6>
            <input type="text" className="form-control" placeholder="Name" name="name" value={this.state.name} onChange={this.handleInputChange} required={true} />
          </div>
          <div className="form-group text-left">
            <h6>Code<sup>*</sup></h6>
            <input type="text" className="form-control" placeholder="Code" name="code" value={this.state.code} onChange={this.handleInputChange} required={true} />
          </div>
          <div className="form-group text-left">
            <h6>Year of Graduation<sup>*</sup></h6>
            <input type="text" className="form-control" placeholder="Graduating" name="graduating" value={this.state.graduating} onChange={this.handleInputChange} required={true} />
          </div>
          <div className="form-group text-left">
            <h6>Department<sup>*</sup></h6>
            <input type="text" className="form-control" placeholder="Department" name="department" value={this.state.department} onChange={this.handleInputChange} required={true} />
          </div>
          <div className="form-group text-left">
            <div>
              {this.state.profRole == 'anchor' ? null : professorBoxes}
              {this.state.profRole == 'anchor' ? anchorDescription : description}
            </div>
          </div>
          <div className="form-group text-left">
            <h6>Credits<sup>*</sup></h6>
            <input type="number" className="form-control" placeholder="Credits" value={this.state.credits} onChange={this.handleCreditsChange} required={true} />
          </div>
          <div className="form-group text-left">
            <h6>Duration</h6>
            <label>Start Date<sup>*</sup></label>
            <input type="date" className="form-control" placeholder="Start Date" name="startDate" value={this.state.startDate} onChange={this.handleInputChange} required={true} />
            <label>End Date<sup>*</sup></label>
            <input type="date" className="form-control" placeholder="End Date" name="endDate" value={this.state.endDate} onChange={this.handleInputChange} required={true} />
            <label>Number of Hours</label>
            <input type="number" className="form-control" placeholder="Hours" value={this.state.hours} onChange={this.handleHoursChange} />
          </div>
          <div className="form-group text-left">
            <h6>Resources</h6>
            <input type="url" className="form-control" placeholder="URLs" name="resourcesUrl" value={this.state.resourcesUrl} onChange={this.handleInputChange} />
          </div>
        </form>

        {this.state.profRole == 'anchor' ? anchorBoxes : null}
        {this.state.profRole == 'anchor' ? <button type="close" className="btn mx-3 w-20" onClick={this.closeForm}>Close</button> : null}
      </div>
    )

    const profContent = (
      <div className='row'>
        <div className='col-sm-7'>
          <div>
            {
              this.state.courses.length < 1 &&
              <div className="lead text-center mb-2">Sorry, no courses found.</div>
            }
            {
              this.state.courses.map(function (each) {
                return <CourseCard key={each.code} code={each.code} name={each.name} department={each.department} description={each.description} anchorDescription={each.anchorDescription} credits={each.credits} resourceUrl={each.resourceUrl} courseID={each._id} role='prof' />
              })
            }
            <div className="text-center"><a href="/" className="btn btn-dark" role="button">Home</a></div>
          </div>
        </div>
        <div className='col-sm-5'>
          <div className='card bg-light text-center'>
            <div className='card-body'>
              {this.state.profRole == '' ? this.state.show && this.state.profRole == '' ? chooseRole : <button type="button" className="btn btn-dark w-50 mx-3" onClick={this.showForm}>Add Course</button> : null}
              {this.state.show && this.state.profRole != '' ? click : null}
              {this.state.show && this.state.profRole != 'anchor' ? <hr />: null}
              {this.state.show && this.state.profRole == 'prof' ? <button type="submit" className="btn btn-dark mx-3 w-20 " onClick={this.onAdd}>Submit</button> : null}
              {this.state.show && this.state.profRole != 'anchor' ? <button type="close" className="btn mx-3 w-20" onClick={this.closeForm}>Close</button> : null}

            </div>
          </div>
        </div>
      </div>



    );
    const studContent = (
      <div>
        {
          this.state.courses.length < 1 &&
          <div className="lead text-center mb-2" style={{color: "white"}}>Sorry, no courses found.</div>
        }
        {
          this.state.courses.map(function (each) {
            return <CourseCard key={each.code} code={each.code} name={each.name} department={each.department} description={each.description} anchorDescription={each.anchorDescription} credits={each.credits} resourceUrl={each.resourceUrl} courseID={each._id} role='student' />
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
    if (this.state.isLoading)
      return <ReactLoading/>;
    else
      return (
        <div>{content}</div>
      );
  }
}

export default CoursesAdd;
