import React, { Component } from 'react';

class CourseCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
    // functions
  }

  renderCourseCard(){
    return(
      <div id="CourseCard">
        <div className="card bg-light">
          <div className="card-title text-center"><h3>{this.props.title}</h3></div>
          <div className="card-body text-center">{this.props.body}</div>
        </div>
      </div>
    );
  }

  render(){
    this.renderCourseCard();
  }
}

export default CourseCard;
