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
        const updatedPageData = [...pageData];
        updatedPageData[index].block_content = content;
        setPageData(updatedPageData);
    
        // Debounce this PUT request or trigger it onBlur instead to reduce the number of requests
        axios.put(`http://localhost:5000/blocks/${updatedPageData[index].block_id}`, {
            content: content,
            // include other block attributes if necessary
        })
        .then(response => {
            console.log('Saved:', response.data);
        })
        .catch(error => {
            console.error('Error saving block:', error);
        });
    };
    

    const renderBlock = (block, index) => {
        const handleInput = (event) => {
            handleContentChange(event.target.innerText, index + 1);
        };
    
        const blockProps = {
            onInput: handleInput,
            contentEditable: true,
            suppressContentEditableWarning: true,
            className: `block block-${block.block_type}`,
        };
    
        switch (block.block_type) {
            case 'header1':
                return <h1 {...blockProps}>{block.block_content}</h1>;
            case 'header2':
                return <h2 {...blockProps}>{block.block_content}</h2>;
            case 'header3':
                return <h3 {...blockProps}>{block.block_content}</h3>;
            case 'text':
            default:
                return <p {...blockProps}>{block.block_content}</p>;
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
