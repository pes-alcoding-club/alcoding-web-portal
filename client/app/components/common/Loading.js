import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='d-flex justify-content-center'>
                <div className="jumbotron py-1  px-4 bg-light">
                    <div className="row text-center">
                        <div className="col-12">
                            <ReactLoading 
                                type={this.props.type ? this.props.type : "bubbles"} 
                                color={this.props.color ? this.props.color : "#18bc9c"} 
                                />
                            {/* Loading.. */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;
