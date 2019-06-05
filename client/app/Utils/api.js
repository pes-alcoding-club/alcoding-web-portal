import axios from "axios";
import { logoutUser } from './../actions/authActions';

const _API_CALL = (apiPath, method, body, token) => {
    switch (method) {
        case "POST":
        case "post":
            return axios.post(apiPath, body, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response;
            }).catch((error) => {
                if (error.response) {
                    if (error.response.status == 401) {
                        // Invalid token
                        dispatch(logoutUser());
                        error = { ...error, message: "User not authenticated." };
                    }
                    else if (error.response.status == 500) {
                        // Internal server error
                        error = { ...error, message: "Server Error. Please try again after a while." };
                    }
                    else {
                        console.log(error)
                    }
                }
                throw error;
            });
            break;

        case "GET":
        case "get":
            return axios.get(apiPath, {
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    return response;
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status == 401) {
                            // Invalid token
                            dispatch(logoutUser());
                            error = { ...error, message: "User not authenticated." };
                        }
                        else if (error.response.status == 500) {
                            // Internal server error
                            error = { ...error, message: "Server Error. Please try again after a while." };
                        }
                        else {
                            console.log(error)
                        }
                    }
                    throw error;
                });
            break;

    }
};

export { _API_CALL };