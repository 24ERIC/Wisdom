import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Page.css';

function Page() {
    const [pageData, setPageData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                console.log("!!!!!!!!!!", response.data);
                setPageData(response.data);
            })
            .catch(error => console.error('Error fetching page:', error));
    }, [id]);

    return (
        <div className="page-content">
            {pageData ? (
                <>
                    <h2>{pageData[0].page_title}</h2>
                    <div className="blocks-container">
                        {pageData.slice(1).map(block => (
                            <div key={block.block_id} className="block">
                                <p>Content: {block.block_content}</p>
                                <p>Type: {block.block_type}</p>
                                <p>Meta: {block.block_meta}</p>
                                <p>Indent: {block.block_indent}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading page...</p>
            )}
        </div>
    );
}

export default Page;
