import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import { setCurrentUser,logoutUser,loginUser } from './actions/authActions';
import Landing from '../app/components/Layout/Landing';
import { Provider } from 'react-redux';
import store from '../app/store/store';

import PrivateRoute from '../app/components/common/PrivateRoute';
import Header from '../app/components/Header/Header';
import Footer from '../app/components/Footer/Footer';

import Navbar from '../app/components/Layout/Navbar';

import App from '../app/components/App/App';
import NotFound from '../app/components/App/NotFound';

import Home from '../app/components/Home/Home';

import Login from '../app/components/Login/Login';

import './styles/styles.scss';

if(localStorage.token){
  store.dispatch(setCurrentUser(localStorage.token));
}else{
  store.dispatch(setCurrentUser({}));
}

render((
  <Provider store={store}>
  <Router>
    <div className='App'>
      <Header />
      <Route exact path="/" component={Home}/>
      <div className='Container'>
      <Switch>
        <Route path="/login" component={Login}/>
      </Switch>
      <Switch>
                <PrivateRoute exact path="/landing" component={Landing} />
      </Switch>
      </div>
    <Footer />
    </div>
  </Router>
  </Provider>
), document.getElementById('app'));
