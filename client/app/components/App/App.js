import React, { Component } from 'react';

import Header from '../Header';
import Footer from '../Footer';

const App = ({ children }) => (
  <div className="app-wrapper">
    <Header />

    <main style={{
      paddingTop: "100px",
      // paddingBottom: "50px",
      minHeight: "90vh",
      overflow: "hidden",
      display: "block",
      position: "relative",
    }}>
      {children}
    </main>

    <Footer />
  </div>
);

export default App;