import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import News from './components/News';
import Blogs from './components/Blogs';
import Tools from './components/Tools';
import Header from './components/Header';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Header />

      <Switch>
        <Route path="/">
          <Home />
        </Route>

        <Route path="/news">
          <News />
        </Route>

        <Route path="/blogs">
          <Blogs />
        </Route>

        <Route path="/tools">
          <Tools />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
