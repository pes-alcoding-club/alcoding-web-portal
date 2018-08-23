import React, { Component } from 'react';

class StaticBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var fieldValue = this.props.val;
        return (
            <div>
                <div className="form-inline">
                    <h5>{this.props.fieldName}: {fieldValue}</h5>
                </div>
            </div>
        );
    }
}

export default StaticBox;
