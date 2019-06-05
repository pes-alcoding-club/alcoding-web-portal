import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser, logoutUser } from '../../actions/authActions';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from 'reactstrap';

class NavbarClass extends Component {
  constructor() {
    super();
    this.state = {
      signInUsn: "",
      signInpassword: "",
      loginShow: true,
      navbarIsOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onTextboxChangeSignInUsn = this.onTextboxChangeSignInUsn.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
  };


  componentDidMount() {
    //   <Redirect to="/" />
  }

  onTextboxChangeSignInPassword(event) {
    event.preventDefault();
    this.setState({
      signInPassword: event.target.value,
    });

  }

  onTextboxChangeSignInUsn(event) {
    event.preventDefault();
    this.setState({
      signInUsn: event.target.value,
    });

  }

  onSignIn(event) {
    event.preventDefault();
    const user = {
      usn: this.state.signInUsn,
      password: this.state.signInPassword
    };

    this.props.loginUser(user);
  }

  onLogoutClick(event) {
    event.preventDefault();
    // this.forceUpdate();   
    this.props.logoutUser();
  }

  reload() {
    // this.forceUpdate();   
    // window.location.reload();
  }

  toggle() {
    this.setState({
      navbarIsOpen: !this.state.navbarIsOpen
    });
  }

  render() {
    var isAuthenticated = this.props.auth.isAuthenticated;
    var displayName = (this.props.auth.name && this.props.auth.name.firstName) || "";

    const authLinks = (
      <Collapse isOpen={this.state.navbarIsOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/contests" activeclassname="active">Contests</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/courses" activeclassname="active">Courses</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/assignments" activeclassname="active">Assignments</NavLink>
          </NavItem>
        </Nav>
        <hr/>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink disabled active>
              {displayName.split(" ", 1)[0]}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/profile" activeclassname="active">Profile</NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret >
            {this.state.navbarIsOpen? "Options":""}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag={Link} to="/contribute">
                Contribute
            </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={this.onLogoutClick.bind(this)}>
                Logout
            </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    );

    const guestLinks = (
      <Collapse isOpen={this.state.navbarIsOpen} navbar>
        <Nav className="ml-auto" navbar>
          <Form inline onSubmit={this.onSignIn}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="usn" hidden>USN</Label>
              <Input type="text" name="usn" id="usn" placeholder="USN" required onChange={this.onTextboxChangeSignInUsn} />
            </FormGroup>
            {' '}
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="Password" hidden>Password</Label>
              <Input type="password" name="password" id="Password" placeholder="Password" required onChange={this.onTextboxChangeSignInPassword} />
            </FormGroup>
            {' '}
            <Button color="dark">Login</Button>
          </Form>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret >
              {this.state.navbarIsOpen ? "Options" : ""}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag={Link} to="/contribute">
                Contribute
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem tag={Link} to="/forgotPassword">
                Forgot Password
            </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    );

    return (
      <Navbar color="navbar-dark fixed-top" dark expand="md" className="mb-4">
      <Container className="pb-2 pt-2">
          <NavbarBrand tag={Link} to="/">The Alcoding Club</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          {isAuthenticated ? authLinks : guestLinks}
      </Container>
        </Navbar>
    );
  }
}

NavbarClass.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginUser, logoutUser })(NavbarClass);

