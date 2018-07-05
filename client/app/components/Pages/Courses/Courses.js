import React, { Component } from 'react'
/*<div className="container-fluid">
<div className="row text-center">
  <div className="col-md-12">
    <div className="jumbotron jumbotron-fluid">
       <h1 className="display-3">Courses</h1>
        <button type="button" className="btn btn-dark">Info</button>
    </div>
  </div>
 </div>
</div>*/

export default class Courses extends Component {
  render() {
    return (
      <div class="alert alert-secondary" role="alert">
        <div className="row text-center">
          <div className="col-md-12">
            <h1 className="display-3">Courses</h1>
            
              <p className="lead">Courses Opted</p>
            
            <button type="button" className="btn btn-dark">Info</button>
          </div>
        </div>
      </div>   
  
    )
  }
}
