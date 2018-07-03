import React, { Component } from 'react';

class Home extends Component {
  constructor() {
    super();

  }


  render() {
    const staticText = {
      aboutUs: "The Alcoding Club is part of the Computer Science & Engineering Department of PES University. It was formed in 2014 under the supervision of Prof. Channa Bankapur.",
      latestNews: "2 July 2018: The meeting to kick off the club was successfully conducted in B-Block, G201, the headquaters.",
      announcements: "Important: All further meetings stand cancelled until further intimation."
    }

    return (
        <div className="card-deck">
          <div className="card bg-light">
            <div className="card-body text-center">
            <h4 className="card-title">About Us</h4>
            <p className="card-text">{staticText.aboutUs}</p>
            </div>
          </div>
          <div className="card bg-light">
            <div className="card-body text-center">
            <h4 className="card-title">Latest News</h4>
            <p className="card-text">{staticText.latestNews}</p>
            </div>
          </div>
          <div className="card bg-light">
            <div className="card-body text-center">
            <h4 className="card-title">Announcements</h4>
            <p className="card-text">{staticText.announcements}</p>
            </div>
          </div>
        </div>
    );
  }
}

export default Home;