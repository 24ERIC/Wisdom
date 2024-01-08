import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Page from './components/Page';

import Block from './components/Block';
import './App.css'; // assuming you have an App.css for styling

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/page/1" />} />
                    <Route path="/page/:id" element={<Page />} />
                    <Route path="/blocks/:id" element={<Block />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
