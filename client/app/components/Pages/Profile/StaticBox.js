import React, { Component } from 'react';

class StaticBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var fieldValue = this.props.val;
        return (
            <div>
                <div className="lead" ><b>{this.props.fieldName}:</b> {fieldValue}</div>
            </div>
        );
    }
}

export default StaticBox;
