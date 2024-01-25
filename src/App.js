import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MyEditor from './components/MyEditor';
import NavBar from './components/NavBar';

function App() {
    return (
        <Router>
            <div className="App">
                <NavBar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate replace to="/page/1" />} />
                        <Route path="/page/:id" element={<MyEditor />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
