import { SET_CURRENT_USER, GET_DETAILS, LOGOUT_USER } from '../actions/types';
import axios from 'axios';

export const loginUser = user => dispatch => {
    axios.post("/api/account/signin", user)
        .then((response) => {
            console.log(response);

            if (response.data.success) {

                //save data into local storage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_id', response.data.user_id);

                //set current user
                dispatch(setCurrentUser(response.data.token, response.data.user_id));
            }

        })
        .catch(err =>
            alert('Invalid Login')
        );
};


/*
ACTION CREATORS
*/
// Set a logged in user
export const setCurrentUser = (token, user_id) => {
    return {
        type: SET_CURRENT_USER,
        payload: {
            token, user_id
        }
    };
};

// Logout a user
const logoutUserCreator = () => {
    return {
        type: LOGOUT_USER,
        payload: {
            success: true
        }
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        var userID = localStorage.getItem('user_id')
        var token = localStorage.getItem('token')
        axios.get('/api/account/' + userID + '/logout', {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
        })
        console.log(userID + " logged out.");
        //remove data from local storage
        localStorage.clear();
        return dispatch(logoutUserCreator());
    }
}

export const getName = () => dispatch => {
    var userID = localStorage.getItem('user_id')
    var token = localStorage.getItem('token')
    axios.get('/api/account/' + userID + '/details',
        {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
        })
        .then(res => {
            dispatch({
                type: GET_DETAILS,
                payload: res.data.user.name
            })
        })
        .catch((error) => {
            // Error
            if (error.response) {
                console.log(error.response.status);
                if (error.response.status == 401) {
                    // import logoutUser from './authActions';
                    console.log("User not authenticated");
                    localStorage.clear();
                    dispatch(setCurrentUser({}))
                }
            }
            else console.log(error)
        })
}