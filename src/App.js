import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Page from './components/Page';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/page/1" />} />
                    <Route path="/page/:id" element={<Page />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
