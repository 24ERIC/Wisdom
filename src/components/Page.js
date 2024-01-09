import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                setPageData(response.data);
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);

    const handleContentChange = (content, index) => {
        // Here we update the content of the block in the pageData array
        const updatedPageData = [...pageData];
        updatedPageData[index].block_content = content;
        setPageData(updatedPageData);

        // This is where you would handle saving the updated content back to your server
        // For example, using axios to send a PUT request
    };

    const renderBlock = (block, index) => {
        const handleInput = (event) => {
            handleContentChange(event.target.innerText, index + 1);
        };

        switch (block.block_type) {
            case 'header1':
                return <h1 onInput={handleInput} contentEditable>{block.block_content}</h1>;
            case 'header2':
                return <h2 onInput={handleInput} contentEditable>{block.block_content}</h2>;
            case 'header3':
                return <h3 onInput={handleInput} contentEditable>{block.block_content}</h3>;
            case 'text':
            default:
                return <p onInput={handleInput} contentEditable>{block.block_content}</p>;
        }
    };

    return (
        <div className="page-content">
            {pageData ? (
                <>
                    <div
                        contentEditable
                        onInput={(e) => handleContentChange(e.target.innerText, 0)}
                        onBlur={(e) => {/* handle saving the title */}}
                        suppressContentEditableWarning={true}
                    >
                        {pageData[0].page_title}
                    </div>
                    <div className="blocks-container">
                        {pageData.slice(1).map((block, index) => (
                            <div key={block.block_id} className="block">
                                {renderBlock(block, index)}
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
