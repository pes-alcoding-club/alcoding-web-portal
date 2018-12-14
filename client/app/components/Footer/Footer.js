import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => (
  <footer>
    <hr width="80%"></hr>
    <div className="row text-center">
      <div className="col-12 mb-2">
        <div className="lead">We'd love your help! <Link to="/contribute">Contribute</Link> to this project on Github.</div>
        <p>Copyright © The Alcoding Club, CS&E, PES University, Bengaluru, India.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
