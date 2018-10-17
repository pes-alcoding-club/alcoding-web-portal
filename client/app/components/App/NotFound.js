import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const NotFound = ({ location }) => (
    <div>
        <div className="row text-center">
            <div className="col-12">
                <p className="lead">Page not found</p>
                <p className="lead">The requested URL <code>{location.pathname}</code> was not found on this server.
              </p>
                <Link to="/">Go to Homepage</Link>
            </div>
        </div>
    </div>
);

export default NotFound;


