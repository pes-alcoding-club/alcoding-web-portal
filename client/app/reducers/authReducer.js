import { SET_CURRENT_USER, SET_DETAILS, LOGOUT_USER } from '../actions/types';
import isEmpty from '../Utils/isEmpty';

const initialState = {
    isAuthenticated: false, 
    token: "",
    user_id: "",
    name: {}
};
export default function (state = initialState, action) {
    // console.log(action);
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload.token),
                user_id: action.payload.user_id,
                token: action.payload.token
            };
        case SET_DETAILS:
            return {
                ...state,
                name: action.payload.name
            };

        case LOGOUT_USER:
            return initialState;

        default:
            return state;
    }
}