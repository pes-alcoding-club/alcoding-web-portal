import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Landing extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      
      <div className="landing">
        <div className="dark-overlay landing-inner text-dark">
          <div className="col-md-12">
            <h1 className="display-3 mb-3">News</h1>
              <p className="lead">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <hr />
          </div>
            
        </div>
      </div>
    );
  }
}


export default Landing;