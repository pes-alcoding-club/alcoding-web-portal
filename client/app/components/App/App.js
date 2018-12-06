import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

const App = ({ children }) => (
  <div className="app-wrapper">
    <Header />

    <main>
      {children}
    </main>

    <Footer/>
  </div>
);

export default App;
