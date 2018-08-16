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
            <form className="form-inline">
                <div className="form-group mx-2 font-weight-bold">
                    <label htmlFor="staticTxt" className="sr-only">{this.props.field}</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.fieldName} />
                </div>
                <div className="form-group mx-2  mb-2 ">
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={fieldValue} />
                </div>

                <button onClick={this.edit} type="button" className="btn btn-dark mb-2">Edit</button>
            </form>
        );
    }


    renderEditing() {
        var inputType = "text";
        if (this.props.field == "dob") {
            inputType = "date";
        }
        return (
            <form className="form-inline">
                <div className="form-group mb-2 mx-2">
                    <label htmlFor="staticTxt" className="sr-only">field</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.fieldName} />
                </div>
                <div className="form-group mx-2 mb-2">
                    <label htmlFor="input" className="sr-only">{this.props.val}</label>
                    <input ref="newText" type={inputType} className="form-control" id="input" placeholder={this.props.val} />
                </div>
                <button onClick={this.save} type="button" className="btn btn-dark mb-2">Save</button>
            </form>
        );
    }

    render() {
        if (!this.state.isEditing) { return (this.renderNormal()); }
        else { return (this.renderEditing()); }
    }
}

export default MutableBox;