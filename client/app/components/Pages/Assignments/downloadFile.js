import React, { Component } from 'react'
import axios from 'axios';

class downloadFile extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        //api/assignments/:fileID/download
        const { match: { params } } = this.props;

        // console.log(params.fileID)
        var token = localStorage.getItem('token')
        axios.get(`/api/assignments/${params.fileID}/${params.userID}/download`, {
            headers: {
                'x-access-token': token,
            }
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err))

        window.close();
    }
    render() {
        return (
            <div>

            </div>
        )
    }
}

export default downloadFile;