import React, { Component } from 'react';
var locale = require('browser-locale')();


class MutableBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            hasChanged: false
        };

        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
    }

    edit() {
        this.setState({ isEditing: true });
        this.props.changeEditingStatus(1);
    }

    save() {
        var inp = this.refs.newText.value;
        var currentState = Object.assign({}, this.state);

        if (inp) {

            // var phoneno = /^\d{10}$/;
            // if (!(inp.match(phoneno))) {
            //     alert("Enter a valid 10 digit phone number.");
            //     return;
            // }
            currentState.hasChanged = true;
            this.props.updateFieldValue(this.props.field, inp);
        }
        this.props.changeEditingStatus(-1);
        currentState.isEditing = false;
        this.setState(currentState);
    }

    renderNormal() {
        var fieldValue = this.props.val;
        if (this.props.field == "dob") {
            let date = new Date(this.props.val);
            fieldValue = date.toLocaleDateString(locale ? locale : "en-GB");
        }

        var inputStyle = "color:black;"
        // if (this.state.hasChanged) {
        //     inputStyle = "color:red;"
        // }

        return (
            <div>
                <div className="form-inline">
                    <h4 className="container ">{this.props.field}:</h4>
                    <p className="ml-4 mt-2" id={fieldValue}>{fieldValue}</p>

                    <button onClick={this.edit} type="button" className="btn btn-dark ml-auto">Edit</button>

                </div>
                <hr />
            </div>
        )

    }


    renderEditing() {
        var inputType = "text";
        if (this.props.field == "dob") {
            inputType = "date";
        }
        return (
            <div>
                <div className="form-inline">
                    <h4 className="container">{this.props.field}:</h4>
                    <input ref="newText" type={inputType} className="form-control ml-4 mt-1 mb-2" id="input" placeholder={this.props.val} />

                    <button onClick={this.save} type="button" className="btn btn-dark ml-auto">Save</button>

                </div>
                <hr />

            </div>
        );
    }

    render() {
        if (!this.state.isEditing) { return (this.renderNormal()); }
        else { return (this.renderEditing()); }
    }
}

export default MutableBox;