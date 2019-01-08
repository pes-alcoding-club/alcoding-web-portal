import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

const App = ({ children }) => (
  <div className="app-wrapper">
    <Header />

    <main style={{paddingTop:100}}>
      {children}
    </main>

    <Footer/>
  </div>
);

export default App;
