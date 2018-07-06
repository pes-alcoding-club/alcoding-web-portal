import React, { Component } from 'react';

class AssignmentCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
    // functions
  }

  render(){
    return(
      <div id="AssignmentCard">
        <div className="card bg-light mx-auto">
          <div className="card-title text-center"><h3><strong>{this.props.name}</strong>: <i>{this.props.code}</i></h3></div>
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

export default AssignmentCard;
