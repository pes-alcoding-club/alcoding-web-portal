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
                <h5>{this.props.fieldName}:</h5>
                <div className="form-inline">
                    <p className="ml-4 mt-2 mb-1" id={fieldValue}>{fieldValue}</p>
                    <button onClick={this.edit} type="button" className="btn btn-dark ml-auto">Edit</button>
                </div>
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
                <h5>{this.props.fieldName}:</h5>
                <div className="form-inline">
                    <input ref="newText" type={inputType} className="form-control ml-3 mt-1" id="input" placeholder={this.props.val} />
                    <button type="submit" onClick={this.save}  className="btn btn-dark ml-auto">Save</button>
                </div>
            </div>
        );
    }

    render() {
        if (!this.state.isEditing) { return (this.renderNormal()); }
        else { return (this.renderEditing()); }
    }
}

export default MutableBox;
