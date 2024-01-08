import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function Block() {
    const [block, setBlock] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/blocks/${id}`)
            .then(response => {
                setBlock(response.data);
            })
            .catch(error => console.error('Error fetching block:', error));
    }, [id]);

    return (
        <div className="block-content">
            {block ? (
                <>
                    <p>{block.content}</p>
                    {block.children.map(child => (
                        <div key={child.id}>
                            <Link to={`/blocks/${child.id}`}>{child.content}</Link>
                        </div>
                    ))}
                </>
            ) : (
                <p>Loading block...</p>
            )}
        </div>
    );
}

export default Block;
