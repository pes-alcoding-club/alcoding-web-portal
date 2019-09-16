import React, { Component } from 'react';
import './QuestionBlock.css';
import axios from 'axios';

class Contests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const styles = {
            questionContainer : {
                background: "#D4F4E4",
                width: "40%",
                scroll:"auto",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingLeft:"10px",
                margin: "10px",
                borderRadius:"3px",
            },
            question:{
                fontSize:"1.2rem",
            },
            desc: {
                fontSize: "0.7rem",
            },
        }

        return (
            <div style={styles.questionContainer}>
                <p style={styles.question}>{this.props.title}</p>
                {/* <p style={styles.desc}>{this.props.desc}</p> */}
            </div>
        );
    }
}
export default Contests;
