import React, { Component } from 'react';

class StaticBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="form-inline">
                <h2>{this.props.field}:</h2>
                <p className="font-weight-bold ml-4 mt-2">{this.props.val}</p>
                <br/>
            </div>
        );
    }
}

export default StaticBox;
