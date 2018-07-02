import { combineReducers } from 'redux';
import authReducer from '../reducers/authReducer'
import errorReducer from './errorReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
