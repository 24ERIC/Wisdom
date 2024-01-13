import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Page() {
    const [pageData, setPageData] = useState({ page_title: '', blocks: [] });
    const { id } = useParams();
    const focusedElementRef = useRef(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/pages/${id}`)
            .then(response => {
                if (response.data && response.data.page_title && Array.isArray(response.data.blocks)) {
                    setPageData(response.data);
                } else {
                    console.error('Invalid format of fetched data');
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
            });
    }, [id]);

    const handleTitleChange = (content, element) => {
        const caret = getCaretPosition(element);
        const updatedPageData = {
            ...pageData,
            page_title: content
        };
        setPageData(updatedPageData);
        setTimeout(() => setCaretPosition(element, caret), 0);


        axios.put(`http://localhost:5000/pages/${id}`, {
            title: content,
        })
            .then(response => {
                console.log('Title Saved:', response.data);
            })
            .catch(error => {
                console.error('Error saving title:', error);
            });
    };

    const getCaretPosition = (element) => {
        let caretOffset = 0;
        const doc = element.ownerDocument || element.document;
        const win = doc.defaultView || doc.parentWindow;
        let sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                const range = win.getSelection().getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        }
        return caretOffset;
    };

    const setCaretPosition = (element, offset) => {
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(element.childNodes[0], offset);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        element.focus();
    };
    const handleContentChange = (content, index, element) => {
        const caret = getCaretPosition(element);
        let updatedBlocks = [...pageData.blocks];
    
        // Find the block by id rather than using the index
        const blockIndex = updatedBlocks.findIndex(block => block.block_id === index);
        if (blockIndex !== -1) {
            updatedBlocks[blockIndex].block_content = content;
    
            const updatedPageData = {
                ...pageData,
                blocks: updatedBlocks
            };
            setPageData(updatedPageData);
    
            // Ensure we set the caret position only if the element is still focused
            if (document.activeElement === element) {
                setTimeout(() => {
                    if (element.childNodes[0] && caret <= element.childNodes[0].length) {
                        setCaretPosition(element, caret);
                    }
                }, 0);
            }

            // Save the content after state update to prevent race conditions
            axios.put(`http://localhost:5000/blocks/${updatedBlocks[blockIndex].block_id}`, {
                content: content,
            })
            .then(response => {
                console.log('Saved:', response.data);
            })
            .catch(error => {
                console.error('Error saving block:', error);
            });
        }
    };
    const handleInput = (event) => {
        const blockId = event.target.getAttribute('data-block-id');
        handleContentChange(event.target.innerText, blockId, event.target);
    };
    

    const renderBlocks = (blocks, indentLevel = 0) => {
        if (!Array.isArray(blocks)) {
            return null;
        }
        return blocks.map((block, index) => {
            const blockStyle = { marginLeft: `${indentLevel * 20}px` };
            const key = `block-${block.block_id}`;
            const handleInput = (event) => {
                focusedElementRef.current = event.target;
                const actualIndex = pageData.blocks.findIndex(b => b.block_id === block.block_id);
                handleContentChange(event.target.innerText, actualIndex, event.target);
            };

            const blockProps = {
                onInput: handleInput,
                contentEditable: true,
                suppressContentEditableWarning: true,
                className: `block block-${block.block_type}`,
                style: blockStyle,
                'data-block-id': block.block_id // Added data attribute for block id
            };

            const renderChildren = (children) => {
                return children.map((child, childIndex) => {
                    return (
                        <li key={`child-${child.block_id}`} style={blockStyle}>
                            <div
                                {...blockProps}
                                onBlur={(event) => handleContentChange(event.target.innerText, childIndex, event.target)}
                            >
                                {child.block_content}
                            </div>
                            {child.children && child.children.length > 0 && (
                                <ul>{renderChildren(child.children)}</ul>
                            )}
                        </li>
                    );
                });
            };

            switch (block.block_type) {
                case 'header1':
                    return <h1 key={key} {...blockProps}>{block.block_content}</h1>;
                case 'header2':
                    return <h2 key={key} {...blockProps}>{block.block_content}</h2>;
                case 'header3':
                    return <h3 key={key} {...blockProps}>{block.block_content}</h3>;
                case 'bullet-point':
                    return (
                        <ul key={key}>
                            <li>
                                <div {...blockProps}>
                                    {block.block_content}
                                </div>
                            </li>
                            {block.children && <ul>{renderChildren(block.children)}</ul>}
                        </ul>
                    );
                case 'text':
                default:
                    return <p key={key} {...blockProps}>{block.block_content}</p>;
            }
        });
    };

    return (
        <div className="page-content">
            {pageData && pageData.blocks && pageData.blocks.length > 0 ? (
                <>
                    <div
                        contentEditable
                        onInput={(e) => handleTitleChange(e.target.innerText, e.target)}
                        onBlur={(e) => {/* handle saving the title */ }}
                        suppressContentEditableWarning={true}
                        ref={focusedElementRef}
                    >
                        {pageData.page_title}
                    </div>
                    <div className="blocks-container">
                        {renderBlocks(pageData.blocks)} 
                    </div>
                </>
            ) : (
                <p>Loading page or no data available...</p>
            )}
        </div>
    );
}

export default Page;