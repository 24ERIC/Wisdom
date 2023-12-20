import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

import Header from './components/Header';
import Home from './components/Home';
import Blogs from './components/Blogs';
import Tools from './components/Tools';
import Audio from './components/Tools/Audio/Audio';
import Video from './components/Tools/Video/Video';
import Finance from './components/Tools/Finance/Finance';
import CyberSecurity from './components/Tools/CyberSecurity/CyberSecurity';
import MLAI from './components/Tools/MLAI/MLAI';
import Gym from './components/Tools/Gym/Gym';
import Food from './components/Tools/Food/Food';


import Test from './components/Test';
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tools/audio" component={Audio} />
        <Route path="/tools/video" component={Video} />
        <Route path="/tools/finance" component={Finance} />
        <Route path="/tools/cybersecurity" component={CyberSecurity} />
        <Route path="/tools/mlai" component={MLAI} />
        <Route path="/tools/gym" component={Gym} />
        <Route path="/tools/food" component={Food} />
        <Route path="/tools" component={Tools} />
        <Route path="/blogs" component={Blogs} />
        <Route path="/t" component={Test} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
