import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class SubmissionsCard extends Component {
    constructor(props) {
        super(props);
        }

    openWindow(){
        // <Link className="btn btn-dark" to={{
        //     pathname: '/download/' + this.props.fileID
        // }}> Download Submission </Link>
    }

    render() {
        let content;
        const Content = (
            <div id="SubmissionsCard">
                <div className="card bg-light mx-auto">

                    <div className="card-body text-left">
                        Name : {this.props.user}<br />
                        FileID : {this.props.fileID} <br /><br />
                        <button className="btn btn-dark" onClick={()=>window.open("/download/"+this.props.fileID)}> Download Submission </button>
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