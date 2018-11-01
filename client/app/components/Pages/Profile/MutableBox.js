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
        this.cancel = this.cancel.bind(this);

    }

    edit() {
        this.setState({ isEditing: true });
        this.props.changeEditingStatus(1);
    }

    save() {
        var inp = this.refs.newText.value;
        var currentState = Object.assign({}, this.state);

        if (inp) {
            currentState.hasChanged = true;
            this.props.updateFieldValue(this.props.field, inp);
        }
        this.props.changeEditingStatus(-1);
        currentState.isEditing = false;
        this.setState(currentState);
    }

    cancel(){
        this.setState({ isEditing: false });
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
                <div className="lead" ><b>{this.props.fieldName}</b></div>
                <div className="form-inline">
                    <div className="lead ml-4" >{fieldValue}</div>
                    <button onClick={this.edit} type="button" className="btn btn-dark ml-auto">Edit</button>
                </div>
            </div>
        )

    }


    renderEditing() {
        var inputType = this.props.inputType;
        return (
            <div>
                <div className="lead" ><b>{this.props.fieldName}</b></div>
                <div className="form-inline">
                    <input ref="newText" type={inputType} className="form-control ml-3" id="input" placeholder={this.props.val} />
                    <button type="submit" onClick={this.save} className="btn btn-dark ml-auto">Save</button>
                    <button type="submit" onClick={this.cancel} className="btn btn-danger ml-1">Cancel</button>
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
