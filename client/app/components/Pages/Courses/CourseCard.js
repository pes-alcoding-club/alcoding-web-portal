import React, { Component } from 'react';

class CourseCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
    // functions
  }

  render(){
    return(
      <div id="CourseCard">
        <div className="card bg-light mx-auto">
          <div className="card-title text-center"><h3><strong><i>{this.props.code}</i>: {this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            Description: {this.props.description}<br />
            Resource URL: <a href={'//'+this.props.resourceUrl}>{this.props.resourceUrl}</a>
          </div>
        </div>
        <br/>
      </div>
    );
  }
}

export default CourseCard;
