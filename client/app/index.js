import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import './styles/styles.scss';
import { setCurrentUser, logoutUser, loginUser } from './actions/authActions';
import { Provider } from 'react-redux';
import store from '../app/store/store';
import PrivateRoute from '../app/components/common/PrivateRoute';
import App from '../app/components/App';
import Home from '../app/components/Home';
import Profile from '../app/components/Pages/Profile';
import Assignments from '../app/components/Pages/Assignments';
import Contests from '../app/components/Pages/Contests';
import Courses from '../app/components/Pages/Courses';
import NotFound from './components/App/NotFound';
import SignupForm from '../app/components/Admin/SignupForm';
import AssignmentAdd from '../app/components/Pages/Courses/AddAssignment'
import viewSubmissions from './components/Pages/Assignments/viewSubmissions';
import viewAssignment from './components/Pages/Assignments/viewAssignment';
import ForgotPassword from './components/Layout/ForgotPassword';
import ChangePassword from './components/Layout/ChangePassword';
import downloadFile from './components/Pages/Assignments/downloadFile';
import updateHandle from './components/Pages/Profile/UpdateHandle';
import PublicProfile from './components/Pages/Profile/PublicProfile';
import contribute from './components/Pages/Contribute';
// import 'bootstrap/dist/css/bootstrap.min.css';


if (localStorage.token) {
  store.dispatch(setCurrentUser(localStorage.token));
} else {
  store.dispatch(setCurrentUser({}));
}
render((
  <Provider store={store}>
    <Router>
      <App>
        <div className='container'>
          <Switch>
            <Route exact path="/" component={Home} />

            <Route exact path="/users/:username" component = {PublicProfile} />

            <PrivateRoute exact path="/assignments" component={Assignments} />

            <PrivateRoute exact path='/assignments/:assignmentID' component={viewAssignment} />

            <PrivateRoute exact path="/contests" component={Contests} />

            <PrivateRoute exact path="/courses" component={Courses} />

            <PrivateRoute exact path="/profile" component={Profile} />

            <PrivateRoute exact path="/admin" component={SignupForm} />

            <PrivateRoute exact path="/courses/:courseID" component={AssignmentAdd} />

            <PrivateRoute exact path="/assignments/submissions/:assignmentID" component={viewSubmissions} />

            <PrivateRoute exact path="/download/:fileID/:userID" component={downloadFile} />

            <PrivateRoute exact path="/updateHandle" component={updateHandle} />

            <Route exact path="/contribute" component={contribute} />

            <Route exact path="/forgotpassword" component={ForgotPassword} />

            <Route exact path="/reset/:token/:userID" component={ChangePassword} />

            <Route component={NotFound} />
          </Switch>

        </div>
      </App>
    </Router>
  </Provider>
), document.getElementById('app'));
