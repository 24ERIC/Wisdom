import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Assuming you will create this CSS file

function NavBar() {
    const [rootBlocks, setRootBlocks] = useState([]);

    useEffect(() => {
        // Fetch root blocks from your API and set them in state
        // For demonstration, let's assume the API returns an array of block objects
        fetch('/api/root-blocks') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => setRootBlocks(data))
            .catch(error => console.error('Error fetching root blocks:', error));
    }, []);

    return (
        <nav className="nav-bar">
            <h3>Root Blocks</h3>
            <ul>
                {rootBlocks.map(block => (
                    <li key={block.id}>
                        <Link to={`/page/${block.id}`}>{block.title}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
