import React, { Component } from 'react'
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';
import Avatar from 'react-avatar';
import ReactLoading from 'react-loading';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
        // Bind this

    }

    render() {
      if (this.state.isLoading)
        return <ReactLoading type="bubbles" color="#000080" />;
      else
        return (
          <div className="container col-md-12">
              <div className="jumbotron center pt-3 pb-2 bg-light">
                  <div className='display-4 mb-3'>Contribute</div>
                  <p>This project is Open Source under the MIT Licence and all details can be found at this project's GitHub repository.</p>
                  <p>Find the repository <a href="https://github.com/aniketnk/alcoding-data-analysis">here.</a></p>
                  <h3>We're hiring!</h3>
                  <p>If you would like to work with The Alcoding Club's Web Application team, here are some details for you. You can gain visibility by fixing issues found under our GitHub 'Issues' tab. You may also work on a fork of this repository and add a feature. Make sure to send in legitimate pull requests with well documented code. If we like your enhancement, we'll pull your code! Once you're visible to us, a member of our team will get in touch with you for the interview process.</p>
                  <p>By working with the Web App team, you'll be exposed to technologies like React, Express and Mongo. You will also be working with specialists in these technologies who are excited to help you start your journey into developement!</p>
              </div>
              <div>
                  <Avatar facebookId="parth.v.shah.925" size="100" round={true}/>&nbsp;
                  <Avatar facebookId="aniket.kaulavkar" size="100" round={true}/>&nbsp;
                  <Avatar facebookId="1056861003" size="100" round={true}/>&nbsp;
                  <Avatar facebookId="adityavinodk" size="100" round={true}/>&nbsp;
              </div>
          </div>
                )
    }
}
