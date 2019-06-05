import React, { Component } from 'react'
import axios from 'axios';
import SubmissionsCard from '../Assignments/submissionsCard';

class viewSubmissions extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            submissions:[]
        })
        this.zipFile = this.zipFile.bind(this);
    }
    
    componentDidMount(){
        //get details

        ///api/assignments/:assignmentID/submissions
        var token = localStorage.getItem('token')

        axios.get(`/api/assignments/${this.props.location.state.assignmentID}/submissions`, {
            headers: {
                'x-access-token': token,
            }
        })
        .then(res => {
            this.setState({
                submissions: res.data.data.assignment.submissions
            })
            console.log(this.state.submissions);
        })
        .catch(err => console.log(err))
    }

    zipFile(){
        var token = localStorage.getItem('token');
        axios.get(`/api/assignments/${this.props.location.state.assignmentID}/zip`, {
            headers: {
                'x-access-token': token,
            }
        }).then(function(res){
            console.log("Files successfully zipped");
        }).catch(function(err){
            console.log(err);
        })
    }
    //add usn
    render() {
        let content;
        const zipSubmission = "/api/assignments/" + this.props.location.state.assignmentID +'/zip?token=' + localStorage.getItem('token');
        const Content = (
            <div>
              {
          this.state.submissions.map(function (each) {
            return <SubmissionsCard key={each.user} fileID={each.file} user={each.user}/>
          })
        }
                <div>
                    <div className="text-center"><a href={zipSubmission} className="btn btn-dark" role="button">Download All</a>   <a href="/" className="btn btn-dark" role="button">Home</a></div>
                </div>
            </div>
        );
        content = Content;
        return (
            <div>
                {content}
            </div>
        )
    }
}

export default viewSubmissions;