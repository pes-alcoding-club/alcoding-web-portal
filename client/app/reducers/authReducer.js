import { SET_CURRENT_USER, GET_DETAILS, LOGOUT_USER } from '../actions/types';
import isEmpty from '../Utils/isEmpty';

const initialState = {
    isAuthenticated: false,
    user: {},
    userName: ""
};
export default function (state = initialState, action) {
    // console.log(action);
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload.token),
                user: action.payload.user_id
            };
        case GET_DETAILS:
            return {
                ...state,
                userName: action.payload
            };

        case LOGOUT_USER:
            return {
                ...state,
                isAuthenticated: !action.payload.success,
                user: null
            };

        default:
            return state;
    }
}