import React, { Component } from 'react'
import axios from 'axios';

class SubmissionsCard extends Component {
    constructor(props){
        super(props);

        this.download = this.download.bind(this);
        }

    download(){
        
        ///api/assignments/:fileID/download
        console.log(this.props.fileID)
        var token = localStorage.getItem('token')
        axios.get(`/api/assignments/${this.props.fileID}/download`, {
            headers: {
                'x-access-token': token,
            }
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    render() {
        let content;
        const Content = (
            <div id="SubmissionsCard">
                <div className="card bg-light mx-auto">
                    
                    <div className="card-body text-left">
                        Name : {this.props.user}<br />
                        FileID : {this.props.fileID} <br /><br/>
                        <button className='btn btn-dark' onClick={this.download}> Download Submission </button>
                    </div>
                    
                </div>
                <br />
            </div>
        );
        content = Content;
        return (
            <div>{content}</div>
      
          )
    }
}
export default SubmissionsCard;