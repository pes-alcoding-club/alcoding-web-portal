import {FETCHED_PROFS, FETCHED_STUDENTS, CLEARED_PROFS, CLEARED_STUDENTS} from '../actions/types';
const initialState = {
	professors:{},
	students:{}
};

export default function(state = initialState, action) {  
  	switch (action.type) {
    	case FETCHED_PROFS:
      		return {
				...state,
				professors: action.payload
			}
    	case CLEARED_PROFS:
      		return {
				  ...state,
				  professors: {}
			}
		case FETCHED_STUDENTS:
			return {
				...state,
				students:action.payload
			}
		case CLEARED_STUDENTS:
			return {
				...state,
				students:{}
			}
    	default:
      		return state;
  	}
}
