import { combineReducers } from 'redux';
import authReducer from './authReducer'
import errorReducer from './errorReducer';
import collegeMembersReducer from './collegeMembersReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  collegeMembers: collegeMembersReducer
});
