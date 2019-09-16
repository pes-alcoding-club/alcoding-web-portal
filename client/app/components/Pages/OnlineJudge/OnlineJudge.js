import React, { Component } from 'react';
import axios from 'axios';
import ReactLoading from '../../common/Loading';
import QuestionBlock from './QuestionBlock';
import AddQuestion from './AddQuestion';
import 'react-table/react-table.css';
import './OnlineJudge.css';

class OnlineJudge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "AddQuestion",
            questions:{}
        };
    }

    render() {
        const style = {
            QuestionBlock: {
                marginTop: "40px",
            }
        }
        if (this.state.page === "AddQuestion") {
            return (
                <div className="jumbotron pt-3 pb-4 bg-light">
                    <button type="button" className="btn btn-primary" id="addQuestion" onClick={() => {this.setState({ page: "" })}}>Add Question</button>
                    {/* <div className = "" */}
                    <div style={style.QuestionBlock}>
                        <QuestionBlock title="Question Title" desc="Some description about the Q" />
                        <QuestionBlock title="Question Title" desc="Some description about the Q" />
                        <QuestionBlock title="Question Title" desc="Some description about the Q" />
                    </div>
                </div>
            );
        }
        else{
            return(
                <div>
                    <AddQuestion/>
                </div>
            );
        }
    }
}
export default OnlineJudge;
