import React, { Component } from 'react';


class MutableBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        };

        this.edit = this.edit.bind(this);
        this.save = this.save.bind(this);
    }

    edit() {
        this.setState({ isEditing: true });
    }

    save() {
        var inp = this.refs.newText.value;
        if (inp) {
            this.props.updateFieldValue(this.props.field, inp);
        }
        this.setState({ isEditing: false });
    }

    renderNormal() {
        return (
            <form className="form-inline">
                <div className="form-group mx-2 font-weight-bold">
                    <label htmlFor="staticTxt" className="sr-only">{this.props.field}</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.field} />
                </div>
                <div className="form-group mx-2  mb-2 ">
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.val} />
                </div>
                
                <button onClick={this.edit} type="button" className="btn btn-dark mb-2">Edit</button>
            </form>
        );
    }


    renderEditing() {
        return (
            <form className="form-inline">
                <div className="form-group mb-2 mx-2">
                    <label htmlFor="staticTxt" className="sr-only">field</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.field} />
                </div>
                <div className="form-group mx-2 mb-2">
                    <label htmlFor="input" className="sr-only">{this.props.val}</label>
                    <input ref="newText" type="text" className="form-control" id="input" placeholder={this.props.val} />
                </div>
                <button onClick={this.save} type="button" className="btn btn-dark mb-2">Change</button>
            </form>
        );
    }

    render() {
        if (!this.state.isEditing) { return (this.renderNormal()); }
        else { return (this.renderEditing()); }
    }
}

export default MutableBox;