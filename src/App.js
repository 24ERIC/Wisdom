import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Tools from './components/Tools';
import Header from './components/Header';
import Home from './components/Home';
import Blogs from './components/Blogs';


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tools" component={Tools} />
        <Route path="/blogs" component={Blogs} />
        <Route path="/" component={Tools} />
      </Switch>
    </Router>
  );
}

export default App;
