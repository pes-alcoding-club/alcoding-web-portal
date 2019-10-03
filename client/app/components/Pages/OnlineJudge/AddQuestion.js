import React, { Component } from 'react';
import axios from 'axios';

class AddQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        const styles = {
            page: {
                width: "90%",
                background: "#E4ECF4",
                marginLeft: "5%",
                borderRadius: "10px",
                marginTop:"20px",
                marginBottom:"40px"
            },
            form: {
                padding: "30px",
            },
            submitBtn:{
                width:"20%",
                marginLeft:"40%"
            },
            cancelBtn: {
                width: "20%",
                marginLeft: "40%",
                marginTop:"20px"
            }
        }

        return (
            <div style={styles.page}>
                <div style={styles.form}>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Problem Title</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Problem Title" aria-describedby="basic-addon2" />
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Problem Description</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Input Format</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Output Format</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Constraints</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Sample Input</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Sample Explaination</span>
                            </div>
                            <textarea class="form-control" aria-label="Problem Description"></textarea>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" id="inputGroupFile02" />
                            <label class="custom-file-label" for="inputGroupFile02" aria-describedby="inputGroupFileAddon02">Choose test cases file</label>
                        </div>
                        <div class="input-group-append">
                            <span class="input-group-text" id="inputGroupFileAddon02">Upload</span>
                        </div>
                    </div>
                    <button type="button" class="btn btn-success" style={styles.submitBtn}>Submit</button>
                    <button type="button" class="btn btn-danger" onClick={() => this.props.page("Home")} style={styles.cancelBtn}>Cancel</button>
                </div>
            </div>
        );
    }
}
export default AddQuestion;
