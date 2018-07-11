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
          <div className="card-title"><h3><i>{this.props.uniqueID}</i>: <strong>{this.props.name}</strong></h3></div>
          <div className="card-body text-left">
            Description: {this.props.details}<br />
            Type: {this.props.type}<br />
            Due Date: {this.props.dueDate}<br />
            Maximum Marks: {this.props.maxMarks}<br />
            Resource URL: <a href={'//'+this.props.resourceUrl}>{this.props.resourceUrl}</a><br /><br />
            <input placeholder="Upload File"/> <a href="/" className="btn btn-dark btn-sm" role="button">Submit</a>
          </div>
        </div>
        <br/>
      </div>
    );
  }
}

export default AssignmentCard;
