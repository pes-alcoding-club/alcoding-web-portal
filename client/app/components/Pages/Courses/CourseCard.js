import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class CourseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseID: ''
    };
  }
  componentDidMount() {
    this.setState({
      courseID: this.props.courseID
    })
  }


  render() {
    let content;
    const profContent = (
      <div id="CourseCard">
        <div className="card bg-light mx-auto">
          <div className="card-title text-center"><h3><strong><i>{this.props.code}</i>: {this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            <b>Credits:</b> {this.props.credits}<br />
            <b>Deparment:</b> {this.props.department}<br />
            <b>Description:</b> {this.props.description}<br />
            <b>Resource URL:</b> <a href={'//' + this.props.resourceUrl}>{this.props.resourceUrl}</a>
          </div>
          <div className="card-footer">
            <Link className='btn btn-dark mx-2' to={{
              pathname: '/courses/' + this.props.courseID,
              state: {
                code: this.props.code,
                name: this.props.name,
                anchorDescription: this.props.anchorDescription
              }
            }}> View Course </Link>
          </div>
        </div>
        <br />
      </div>
    );
    const studContent = (
      <div id="CourseCard">
        <div className="card bg-light mx-auto">
          <div className="card-title text-center"><h3><strong><i>{this.props.code}</i>: {this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            <b>Credits:</b> {this.props.credits}<br />
            <b>Deparment:</b> {this.props.department}<br />
            <b>Description:</b> {this.props.description}<br />
            <b>Resource URL:</b> <a href={'//' + this.props.resourceUrl}>{this.props.resourceUrl}</a>
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

export default CourseCard;
