import React, { Component } from 'react';

class Home extends Component {
  constructor() {
    super();

  }


  render() {
    const staticText = {
      aboutUs: "ALCODING Club - a club of ALgorithms and CODING enthusiasts in the department of Computer Science & Engineering, PES University. It is founded and led by Prof. Channa Bankapur to encourage and keep up the coding culture in the campus.",
      latestNews: "1 October 2018: Release of the Alcoding Club Platform which will enable students of the department to view Global Rankings, upcoming contests and any messages.",
      announcements: "The ACM International Collegiate Programming Contest (ACM ICPC) is the largest collegiate programming contest being organized all over the world every year. The ACM ICPC is an activity of the ACM that provides college students with an opportunity to demonstrate and sharpen their problem-solving and computing skills. The contest is considered as the \"Olympiad of Computer Programming\".  For more information about ACM ICPC, visit https://icpc.baylor.edu"
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
