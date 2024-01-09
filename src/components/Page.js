import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                console.log('Data received:', response.data); // Debugging line
                setPageData(response.data);
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);

    const renderBlock = (block) => {
        const createMarkup = (htmlContent) => {
            return { __html: htmlContent };
        };
    
        console.log(`Rendering block: ${block.block_content}, Type: ${block.block_type}`); // Debugging line
    
        switch (block.block_type) { // Make sure this matches the property name exactly
            case 'header1':
                return <h1 dangerouslySetInnerHTML={createMarkup(block.block_content)} />;
            case 'header2':
                return <h2 dangerouslySetInnerHTML={createMarkup(block.block_content)} />;
            case 'header3':
                return <h3 dangerouslySetInnerHTML={createMarkup(block.block_content)} />;
            case 'text':
            default:
                return <p dangerouslySetInnerHTML={createMarkup(block.block_content)} />;
        }
    };
    

    return (
        <div className="page-content">
            {pageData ? (
                <>
                    <h2>{pageData[0].title}</h2>
                    <div className="blocks-container">
                        {pageData.slice(1).map((block, index) => (
                            <div key={index} className="block">
                                {renderBlock(block)}
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
