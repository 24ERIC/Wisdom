



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Page from './components/Page';
import './App.css';
import MyEditor from './components/MyEditor';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate replace to="/page/1" />} />
                    <Route path="/page/:id" element={<MyEditor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;