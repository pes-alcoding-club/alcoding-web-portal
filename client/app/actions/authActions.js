import { SET_CURRENT_USER, GET_DETAILS } from '../actions/types';
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
                dispatch(setCurrentUser(response.data.token));
            }

        })
        .catch(err =>
            alert('Invalid Login')
        );
};


// Set logged in user
export const setCurrentUser = token => {
    return {
        type: SET_CURRENT_USER,
        payload: token
    };
};

export const logoutUser = () => dispatch => {
    var userID = localStorage.getItem('user_id')
    var token = localStorage.getItem('token')
    axios.get('/api/account/' + userID + '/logout', {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        },
    })
    console.log(userID + " logged out.");
    //save data into local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    dispatch(setCurrentUser({}))
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