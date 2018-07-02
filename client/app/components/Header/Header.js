import React,{ Component } from 'react';
import Navbar from '../Layout/Navbar';

class Header extends Component {
  constructor() {
    super();
  }
  render(){
    return(
      <header>
        <Navbar/>
      </header>
    );
  }
}
export default Header;
