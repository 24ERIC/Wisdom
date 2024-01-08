import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [page, setPage] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                setPage(response.data);
            })
            .catch(error => console.error('Error fetching page:', error));
    }, [id]);

    const renderBlockChain = (block) => {
        if (!block) return null;

        return (
            <div className="block">
                <div>{block.content}</div>
                {block.childBlock && <div className="child-block">{renderBlockChain(block.childBlock)}</div>}
            </div>
        );
    };

    return (
        <div className="page-content">
            {page ? (
                <>
                    <h2>{page.title}</h2>
                    <div className="blocks-container">
                        {renderBlockChain(page.childBlock)}
                    </div>
                </>
            ) : (
                <p>Loading page...</p>
            )}
        </div>
    );
}

export default Page;
