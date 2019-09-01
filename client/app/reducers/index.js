import { combineReducers } from 'redux';
import authReducer from './authReducer'
import errorReducer from './errorReducer';
import profReducer from './profReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profs: profReducer
});
