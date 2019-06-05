import { SET_CURRENT_USER, SET_DETAILS, LOGOUT_USER } from '../actions/types';
import axios from 'axios';

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

// Set name of logged in user
export const setName = (name) => {
    return {
        type: SET_DETAILS,
        payload: {
            name
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


/*
ACTION FUNCTIONS aka THUNKS
*/

export const logoutUser = () => {
    return (dispatch, getState) => {
        const userID = getState().auth.user_id;
        const token = getState().auth.token;
        axios.get('/api/account/' + userID + '/logout', {
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                console.log(userID + " logged out.");
                //remove data from local storage
                localStorage.clear();
                return dispatch(logoutUserCreator());
            })
    }
}

export const getName = () => {
    return (dispatch, getState) => {
        const userID = getState().auth.user_id;
        const token = getState().auth.token;
        axios.get('/api/account/' + userID + '/details',
            {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            })
            .then(res => {
                dispatch(setName(res.data.user.name));
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status == 401) {
                        dispatch(logoutUser());
                    }
                }
                else console.log(error)
            });
    }
}

export const loginUser = user => dispatch => {
    axios.post("/api/account/signin", user)
        .then((res) => {
            // console.log(res);

            if (res.data.success) {
                //save data into local storage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', res.data.user_id);

                //set current user
                dispatch(setCurrentUser(res.data.token, res.data.user_id));
            }
            dispatch(getName());
        })
        .catch(err => {
            console.log(err);
            alert('Invalid Login.');
        }
        );
};
