import React, { Component } from 'react';

class StaticBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <form className="form-inline">
                <div className="form-group mb-2 mx-2 font-weight-bold">
                    <label htmlFor="staticTxt" className="sr-only ">{this.props.field}</label>
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.field} />
                </div>
                
                <div className="form-group mb-2 mx-2">
                    <input type="text" readOnly className="form-control-plaintext" id="staticTxt" value={this.props.val} />
                </div>
            </form>
        );
    }
}

export default StaticBox;