import React, { Component } from 'react'
import axios from "axios";
import { Link, Redirect } from 'react-router-dom';
import Avatar from 'react-avatar';
import ReactLoading from '../common/Loading';
import { Jumbotron, Row, Col } from 'reactstrap';

export default class Contribute extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div>
                <Jumbotron className="center pt-3 pb-2 bg-light">
                    <h2 className='d-md-none'>Contribute</h2>
                    <div className="d-none d-md-block display-4 mb-3">Contribute</div>
                    <p>This project is Open Source under the MIT Licence and all details can be found at this project's GitHub repository.</p>
                    <p>Find the repository <a href="https://github.com/aniketnk/alcoding-data-analysis" target="_blank">here.</a></p>
                    <h3>We're hiring!</h3>
                    <p>If you would like to work with The Alcoding Club's Web Application team, here are some details for you. You can gain visibility by fixing issues found under our GitHub 'Issues' tab. You may also work on a fork of this repository and add a feature. Make sure to send in legitimate pull requests with well documented code. If we like your enhancement, we'll pull your code! Once you're visible to us, a member of our team will get in touch with you for the interview process.</p>
                    <p>By working with the Web App team, you'll be exposed to technologies like React, Express and Mongo. You will also be working with specialists in these technologies who are excited to help you start your journey into developement!</p>
                    <p>The setup instructions and guidlines for contributing are available at this project's GitHub page. For any queries, feel free to contact any of the authors. May the force be with you.</p>
                </Jumbotron>
                {/* <div className="d-flex justify-content-center">
                    <a href="https://parthvshah.github.io" target="_blank"><Avatar name="Parth Vipul Shah" size="100" round={true} />&nbsp; </a>
                    <a href="https://github.com/aniketnk" target="_blank"><Avatar googleId="107470330673159780136" name="Aniket Nitin Kaulavkar" size="100" round={true} />&nbsp; </a>
                    <a href="https://github.com/RRK1000" target="_blank"><Avatar name="Rishi Ravikumar" size="100" round={true} />&nbsp; </a>
                    <a href="https://github.com/adityavinodk" target="_blank"><Avatar name="Aditya Vinod Kumar" size="100" round={true} />&nbsp; </a>
                </div> */}
                <Jumbotron className="center pt-3 pb-2 bg-light">
                    <h3 className="mb-4">Developers</h3>
                    <Row>
                        <Col sm="12" lg="6">
                            <Row>
                                <Col sm="12" md="2" lg="3" className="mb-4">
                                    <Avatar googleId="107470330673159780136" name="Aniket Nitin Kaulavkar" size="100" round={"5px"} />&nbsp;
                                </Col>
                                <Col >
                                    <a href="https://github.com/aniketnk" target="_blank">
                                        <p className="bold lead">Aniket Nitin Kaulavkar</p>
                                    </a>
                                    <p>Full-stack, Android, React-native and React Developer. Competitive coding fanatic.</p>
                                    <hr />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="12" lg="6">
                            <Row>
                                <Col sm="12" md="2" lg="3" className="mb-4">
                                    <Avatar name="Parth Vipul Shah" githubhandle="parthvshah" size="100" round={"5px"} />&nbsp;
                                </Col>
                                <Col>
                                    <a href="https://parthvshah.github.io" target="_blank">
                                        <p className="bold lead">Parth V Shah</p>
                                    </a>
                                    <p>Technology enthusiast and Full-stack developer.</p>
                                    <hr />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" lg="6">
                            <Row>
                                <Col sm="12" md="2" lg="3" className="mb-4">
                                    <Avatar initials="RRK" name="Rishi Ravikumar" size="100" round={"5px"} />&nbsp;
                                </Col>
                                <Col>
                                    <a href="https://github.com/RRK1000" target="_blank">
                                        <p className="bold lead">Rishi Ravikumar</p>
                                    </a>
                                    <p>Full-Stack Developer. Ardent Competitive Coder.</p>
                                    <hr />
                                </Col>
                            </Row>
                        </Col>
                        <Col sm="12" lg="6">
                            <Row>
                                <Col sm="12" md="2" lg="3" className="mb-4">
                                    <Avatar githubHandle='adityavinodk' name="Aditya Vinod Kumar" size="100" round={"5px"} />&nbsp;
                                </Col>
                                <Col>
                                    <a href="https://github.com/adityavinodk" target="_blank">
                                        <p className="bold lead">Aditya Vinod Kumar</p>
                                    </a>
                                    <p>Full-Stack Developer. Machine Learning and Competitive Coding Enthusiast.</p>
                                    <hr />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Jumbotron>
            </div>
        )
    }
}
