import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">

      <Link className="navbar-brand" to="/">
        Alcoding
          </Link>
      <button
        className="navbar-toggler"
        type="button"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
                </Link>
          </li>
        </ul>
      </div>
      <ul className="navbar-nav ml-auto text-light">
        <li className="nav-item">
          <Link className="nav-link" to="/Login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
