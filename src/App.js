// import React, { useState, useEffect } from 'react';
// import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   const [currentTime, setCurrentTime] = useState(0);

//   useEffect(() => {
//     fetch('/api/time').then(res => res.json()).then(data => {
//       setCurrentTime(data.time);
//     });
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <BrowserRouter>
//           <div>
//             <Link className="App-link" to="/">Home</Link>
//             &nbsp;|&nbsp;
//             <Link className="App-link" to="/page2">Page2</Link>
//           </div>
//           <Switch>
//             <Route exact path="/">
//                 <img src={logo} className="App-logo" alt="logo" />
//                 <p>
//                   Edit <code>src/App.js</code> and save to reload.
//                 </p>
//                 <a
//                   className="App-link"
//                   href="https://reactjs.org"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Learn React
//                 </a>
//                 <p>The current time is {currentTime}.</p>
//             </Route>
//             <Route path="/page2">
//                 <p>This is page 2!</p>
//             </Route>
//           </Switch>
//         </BrowserRouter>
//       </header>
//     </div>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import './App.css';

import News from './components/News';
import Blogs from './components/Blogs';
import Tools from './components/Tools';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div>
            <Link className="App-link" to="/">Home</Link>
            &nbsp;|&nbsp;
            <Link className="App-link" to="/news">News</Link>
            &nbsp;|&nbsp;
            <Link className="App-link" to="/blogs">Blogs</Link>
            &nbsp;|&nbsp;
            <Link className="App-link" to="/tools">Tools</Link>
          </div>
          <Switch>
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
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
