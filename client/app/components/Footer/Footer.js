import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => (
  <footer>
    <hr width="95%"></hr>
    <div className='container'>
      <div className="jumbotron pt-3 pb-2 bg-light">
        <div className="row text-center">
          <div className="col-12">
            <div className="lead">We'd love your help! <Link to="/contribute">Contribute</Link> to this project on Github.</div>
            <p>Copyright © The Alcoding Club, CS&E, PES University, Bengaluru, India.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
