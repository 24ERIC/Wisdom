import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
    const [page, setPage] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/pages/1')  // Assuming your API is set up to handle this route
            .then(response => {
                setPage(response.data);
            })
            .catch(error => console.error('Error fetching page:', error));
    }, []);

    return (
        <div className="page-content">
            {page ? (
                <>
                    <h1>{page.title}</h1>
                    <Link to={`/blocks/${page.block_id}`}>Go to Blocks</Link>
                </>
            ) : (
                <p>Loading page...</p>
            )}
        </div>
    );
}

export default Home;
