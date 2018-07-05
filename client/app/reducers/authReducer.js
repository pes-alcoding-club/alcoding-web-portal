import { SET_CURRENT_USER, GET_DETAILS } from '../actions/types';
import isEmpty from '../isEmpty';
const initialState = {
    isAuthenticated: false,
    user: {},
    userName : {}
}

export default function(state = initialState, action){
    switch(action.type){
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated : !isEmpty(action.payload),
                user : action.payload
            };
        case GET_DETAILS:
            return {
                ...state,
                userName : action.payload
            };
            
        default:
            return state;
        }
    }