import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const [rootBlocks, setRootBlocks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/root-blocks')
            .then(response => {
                // console.log('Initial response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // console.log('Data fetched:', data);
                setRootBlocks(data);
            })
            .catch(error => {
                console.error('Error fetching root blocks:', error);
            });
    }, []);

    return (
        <nav className="nav-bar">
            <h3>Root Blocks</h3>
            <ul>
                {rootBlocks.map(block => (
                    <li key={block.id}>
                        <Link to={`/page/${block.id}`}>{block.content}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
