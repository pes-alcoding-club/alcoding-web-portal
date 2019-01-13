import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container
} from 'reactstrap';

const Footer = () => (
  <footer className="footer">
    <Container fluid className="text-light bg-dark">
    <div className="lead text-center pt-2">We'd love your help! Click <Link to="/contribute">here</Link> to contribute to this project.</div>
    <div className="footer-copyright text-center py-3">
      <div>
        &copy; {new Date().getFullYear()}{" "}
        The Alcoding Club, CS&E, PES University, Bengaluru, India.
      </div>
    </div>
    </Container>
  </footer>
);

export default Footer;

// OLD
// {/* <hr width="80%"></hr>
//     <div className="row text-center">
//       <div className="col-12 mb-2">
//         <div className="lead">We'd love your help! <Link to="/contribute">Contribute</Link> to this project on Github.</div>
//         <p>Copyright © The Alcoding Club, CS&E, PES University, Bengaluru, India.</p>
//       </div>
//     </div> */}