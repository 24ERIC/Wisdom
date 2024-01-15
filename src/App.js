import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import Page from './components/Page';
import './App.css';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Navigate to="/page/1" />} />
                        <Route path="/page/:id" element={<Page />} />
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
}
export default App;